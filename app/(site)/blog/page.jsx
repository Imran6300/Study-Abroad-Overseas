import BlogClient from "@/components/BlogClient";

export const metadata = {
  title: "Study Abroad Blogs | Khizar Overseas",
  description:
    "Explore expert guides on studying abroad, visa tips, scholarships, and top universities for 2026.",
};

async function getBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const json = await res.json();
  return json.data;
}

export default async function BlogPage() {
  const posts = await getBlogs();

  return <BlogClient posts={posts} />;
}
