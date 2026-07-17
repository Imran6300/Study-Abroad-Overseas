// app/api/revalidate/route.js
//
// On-demand ISR trigger. The backend calls this AFTER a successful save in
// universityController / courseController / countryController, so a page
// regenerates the moment its data actually changes — instead of blindly
// regenerating every page on a 24h timer whether or not anything changed.
//
// `export const revalidate = 86400` on each page stays in place as a
// SAFETY NET ceiling (catches anything this endpoint misses, e.g. a manual
// DB edit), not as the primary refresh mechanism anymore.
//
// UPDATE (Cloudflare edge cache, July 2026): once Cloudflare caches these
// HTML pages at the edge with `respect_origin` (s-maxage from the
// `revalidate` export), revalidatePath() alone is no longer enough —
// it only refreshes Vercel's copy. Cloudflare's edge will keep serving the
// OLD cached HTML for up to 24h after an edit unless we also purge it by
// URL. This route now does both, in that order: Vercel first (so the fresh
// HTML exists to be re-fetched), then Cloudflare (so the stale edge copy
// is dropped and the next visitor pulls the fresh one through).
//
// A Cloudflare purge failure is logged but never fails the response —
// the 24h revalidate ceiling is still the safety net if this call fails.
//
// Required env vars (frontend .env, Vercel):
//   REVALIDATE_SECRET        - existing shared secret, unchanged
//   CLOUDFLARE_ZONE_ID       - from the CF dashboard, Overview page, right sidebar
//   CLOUDFLARE_API_TOKEN     - a token scoped to "Zone > Cache Purge > Purge"
//                              for this zone only (Cloudflare dashboard ->
//                              My Profile -> API Tokens -> Create Token ->
//                              use the "Purge Cache" template)
//
// Request body:
//   {
//     "type": "university" | "course" | "country",
//     "slug": "amity-university-dubai",
//     "comboSlugs": ["msc-cs-in-uae", "mba-in-uae"]   // courses only, optional
//   }

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const SITE_ORIGIN = "https://www.khizaroverseas.in";

async function purgeCloudflare(paths) {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken) {
    console.warn(
      "[revalidate] CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN not set — skipping edge purge. Cloudflare will keep serving the old cached page for up to 24h.",
    );
    return { purged: false, reason: "not_configured" };
  }

  const urls = paths.map((p) => `${SITE_ORIGIN}${p}`);

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: urls }),
        // Keep this fast — a slow/hanging CF purge must never hold up the
        // admin's save request response.
        signal: AbortSignal.timeout(8000),
      },
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error(
        "[revalidate] Cloudflare purge failed:",
        data.errors || data,
      );
      return { purged: false, reason: "cf_error", errors: data.errors };
    }

    console.log(`[revalidate] Cloudflare purged: ${urls.join(", ")}`);
    return { purged: true, urls };
  } catch (error) {
    console.error(
      "[revalidate] Cloudflare purge request failed:",
      error.message,
    );
    return { purged: false, reason: "request_failed" };
  }
}

export async function POST(req) {
  const secret = req.headers.get("x-revalidate-secret");

  if (!process.env.REVALIDATE_SECRET) {
    console.error("REVALIDATE_SECRET is not set on the frontend deployment.");
    return NextResponse.json(
      { message: "Revalidation is not configured." },
      { status: 500 },
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const { type, slug, comboSlugs } = body || {};

  if (!type || !slug) {
    return NextResponse.json(
      { message: "'type' and 'slug' are required." },
      { status: 400 },
    );
  }

  const revalidated = [];

  try {
    switch (type) {
      case "university": {
        const path = `/programs/universities/${slug}`;
        revalidatePath(path);
        revalidated.push(path);
        break;
      }

      case "course": {
        const coursePath = `/courses/${slug}`;
        revalidatePath(coursePath);
        revalidated.push(coursePath);

        // A course edit can affect every combo page it appears in
        // (/study-{course}-in-{country}). The backend sends the current
        // comboPageSlugs list so we only touch the combos that actually
        // exist for this course, not the whole route.
        if (Array.isArray(comboSlugs)) {
          for (const countrySlug of comboSlugs) {
            const comboPath = `/study-combo/${slug}-in-${countrySlug}`;
            revalidatePath(comboPath);
            revalidated.push(comboPath);
          }
        }
        break;
      }

      case "country": {
        // Country data is rendered on two separate routes — keep both in
        // sync until /all-countries is fully retired in favor of /study-in.
        const studyInPath = `/study-in/${slug}`;
        const allCountriesPath = `/all-countries/${slug}`;
        revalidatePath(studyInPath);
        revalidatePath(allCountriesPath);
        revalidated.push(studyInPath, allCountriesPath);
        break;
      }

      default:
        return NextResponse.json(
          { message: `Unknown type '${type}'.` },
          { status: 400 },
        );
    }

    // Purge Cloudflare's edge copy AFTER Vercel has queued the fresh
    // regeneration, so the next visitor's request (which now misses at
    // Cloudflare) pulls genuinely fresh HTML from Vercel rather than
    // racing the regeneration.
    const purgeResult = await purgeCloudflare(revalidated);

    return NextResponse.json({
      revalidated,
      cloudflarePurge: purgeResult,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidate route error:", error);
    return NextResponse.json(
      { message: "Revalidation failed.", error: String(error) },
      { status: 500 },
    );
  }
}
