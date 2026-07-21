import BlogClient from "@/components/BlogClient";
import { buildItemListJsonLd } from "@/lib/structuredData";

const BASE_URL = "https://www.khizaroverseas.in";

// generateMetadata instead of a static `metadata` export because canonical
// needs to point at the actual page URL. Each /blog?page=N is unique,
// crawlable content — so each gets its own self-referencing canonical
// (not all pointing back at page 1, which would tell Google to ignore the
// rest of the pages entirely).
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params?.page) || 1);
  const canonical =
    page === 1 ? `${BASE_URL}/blog` : `${BASE_URL}/blog?page=${page}`;

  return {
    title:
      page === 1
        ? "Study Abroad Blogs | Khizar Overseas"
        : `Study Abroad Blogs — Page ${page} | Khizar Overseas`,
    description:
      "Explore expert guides on studying abroad, visa tips, scholarships, and top universities for 2026.",
    alternates: { canonical },
  };
}

const PAGE_SIZE = 12;

async function getBlogs(page) {
  try {
    // FIX (2026-07): the old "Load More Articles" button loaded page 2+ via a
    // client-side fetch with NO underlying URL. That meant:
    //   1. Every post beyond the first 12 had ZERO <a href> pointing to it
    //      anywhere Googlebot could see in the server-rendered HTML.
    //   2. There was no /blog?page=2 URL for Google to discover, crawl, or
    //      index independently — "Load More" state lived only in memory.
    // Result: those posts relied entirely on sitemap discovery, which is why
    // GSC showed "Referring page: None detected" for them.
    //
    // Fix: /blog now reads ?page= from the URL and server-renders that page.
    // This gives every page of results a real, crawlable, indexable URL with
    // real <Link href="/blog?page=N"> anchors pointing to it.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs?page=${page}&limit=${PAGE_SIZE}&sort=published`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return { posts: [], total: 0, pages: 1 };

    const json = await res.json();
    return {
      posts: json.data || [],
      total: json.total || 0,
      pages: json.pages || 1,
    };
  } catch (err) {
    console.error("[blog] fetch error:", err.message);
    return { posts: [], total: 0, pages: 1 };
  }
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params?.page) || 1);
  const { posts, total, pages } = await getBlogs(currentPage);

  // ItemList JSON-LD (Step 4 fix) — /blog had no structured data before.
  // Same shared builder used on /courses, /programs/universities and
  // /all-countries.
  const structuredData = buildItemListJsonLd(posts, {
    name:
      currentPage === 1
        ? "Study Abroad Blogs | Khizar Overseas"
        : `Study Abroad Blogs — Page ${currentPage}`,
    description:
      "Expert guides on studying abroad, visa tips, scholarships, and top universities for 2026.",
    url: `${BASE_URL}/blog`,
    toListItem: (post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `${BASE_URL}/blog/${post.slug}`,
    }),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogClient
        posts={posts}
        initialTotal={total}
        pageSize={PAGE_SIZE}
        currentPage={currentPage}
        totalPages={pages}
      />
    </>
  );
}
