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
// Auth: a shared secret (REVALIDATE_SECRET) sent as a header. This route is
// server-only — never expose the secret as NEXT_PUBLIC_*.
//
// Request body:
//   {
//     "type": "university" | "course" | "country",
//     "slug": "amity-university-dubai",
//     "comboSlugs": ["msc-cs-in-uae", "mba-in-uae"]   // courses only, optional
//   }

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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

    return NextResponse.json({ revalidated, now: Date.now() });
  } catch (error) {
    console.error("Revalidate route error:", error);
    return NextResponse.json(
      { message: "Revalidation failed.", error: String(error) },
      { status: 500 },
    );
  }
}
