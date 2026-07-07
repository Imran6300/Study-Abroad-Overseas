import BlogClient from "@/components/BlogClient";

export const metadata = {
  title: "Study Abroad Blogs | Khizar Overseas",
  description:
    "Explore expert guides on studying abroad, visa tips, scholarships, and top universities for 2026.",
};

const PAGE_SIZE = 12;

async function getBlogs() {
  try {
    // FIX: backend defaults to limit=10 with no pagination link anywhere
    // on this page. New posts beyond the 10 most recent had ZERO internal
    // link pointing to them from /blog — the "Load More Articles" button
    // had no onClick handler at all. That meant only sitemap/generateStaticParams
    // could discover them, which is far slower for Google than internal links.
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs?page=1&limit=${PAGE_SIZE}&sort=published`,
      {
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) return { posts: [], total: 0 };

    const json = await res.json();
    return { posts: json.data || [], total: json.total || 0 };
  } catch (err) {
    console.error("[blog] fetch error:", err.message);
    return { posts: [], total: 0 };
  }
}

export default async function BlogPage() {
  const { posts, total } = await getBlogs();

  return <BlogClient posts={posts} initialTotal={total} pageSize={PAGE_SIZE} />;
}
