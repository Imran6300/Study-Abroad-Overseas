import BlogClient from "@/components/BlogClient";

export const metadata = {
  title: "Study Abroad Blogs | Khizar Overseas",
  description:
    "Explore expert guides on studying abroad, visa tips, scholarships, and top universities for 2026.",
};

async function getBlogs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`,
      {
        next: { revalidate: 86400 },
      },
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("[blog] fetch error:", err.message);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogs();

  return <BlogClient posts={posts} />;
}
