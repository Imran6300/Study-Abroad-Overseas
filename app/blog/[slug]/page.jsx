// app/blog/[slug]/page.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";

const postsDirectory = path.join(process.cwd(), "content/blog");

async function getPost(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { frontmatter: data, content };
}

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const { frontmatter, content } = post;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#0f2a5f] hover:text-orange-600 mb-8 font-medium"
        >
          <FaArrowLeft /> Back to Blog
        </Link>

        <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {frontmatter.image && (
            <img
              src={frontmatter.image}
              alt={frontmatter.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f2a5f] mb-6">
              {frontmatter.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-10">
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />{" "}
                {new Date(frontmatter.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2">
                <FaUser className="text-orange-500" /> {frontmatter.author}
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="text-orange-500" /> {frontmatter.readTime}
              </span>
            </div>
            <div className="prose prose-lg max-w-none prose-headings:text-[#0f2a5f] prose-a:text-orange-600 prose-a:hover:underline prose-blockquote:border-l-4 border-orange-500 pl-4">
              <MDXRemote source={content} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

// Optional: for production, generate static paths
export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.mdx$/, ""),
  }));
}

export const revalidate = 3600; // ISR every hour
