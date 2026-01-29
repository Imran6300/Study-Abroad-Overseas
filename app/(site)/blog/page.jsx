import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogClient from "@/components/BlogClient";

const postsDirectory = path.join(process.cwd(), "content/blog");

function getAllPosts() {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const content = fs.readFileSync(path.join(postsDirectory, file), "utf8");
      const { data } = matter(content);

      return {
        slug,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        date: data.date
          ? new Date(data.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Date unavailable",

        author: data.author || "Khizar Team",
        readTime: data.readTime || "5 min read",
        image: data.image || null,
        category: data.category || "General",
      };
    });
}

export default function BlogPage() {
  const posts = getAllPosts();

  // 👇 ONLY THIS
  return <BlogClient posts={posts} />;
}

export const revalidate = 3600;
