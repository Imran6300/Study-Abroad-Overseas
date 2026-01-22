// app/blog/[slug]/page.jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import Button from "@/components/mdx/Button";
import Callout from "@/components/mdx/Callout";

const postsDirectory = path.join(process.cwd(), "content/blog");

async function getPost(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { frontmatter: data, content };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
      {/* Elegant thin accent gradient bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 w-full" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl xl:max-w-4xl pt-12 pb-24 lg:pt-16">
        {/* Back link – refined */}
        <Link
          href="/blog"
          className="group mb-12 inline-flex items-center gap-3 text-slate-600 hover:text-orange-700 font-medium text-lg transition-colors duration-200"
        >
          <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-2 duration-300" />
          Back to Articles
        </Link>

        <article className="relative bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border border-slate-100/80">
          {/* Hero image – dramatic but clean */}
          {frontmatter.image && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent/0 z-10" />
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                width={1400}
                height={720}
                priority
                quality={85}
                className="w-full h-[38vh] sm:h-[45vh] md:h-[52vh] lg:h-[58vh] object-cover brightness-[0.88] contrast-[1.04] saturate-[1.05]"
              />
              {/* Desktop title overlay – elegant & cinematic */}
              <div className="absolute inset-x-0 bottom-0 z-20 px-8 pb-12 hidden md:block">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                  {frontmatter.title}
                </h1>
              </div>
            </div>
          )}

          <div className="px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-12 pb-16 md:pt-14 lg:pt-16">
            {/* Mobile title – big & bold */}
            <h1 className="md:hidden text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              {frontmatter.title}
            </h1>

            {/* Meta – spacious, elegant icons */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-5 text-base text-slate-500 mb-12 pb-10 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-orange-600 text-xl flex-shrink-0" />
                <time className="font-medium">
                  {new Date(String(frontmatter.date)).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </time>
              </div>
              <div className="flex items-center gap-3">
                <FaUser className="text-orange-600 text-xl flex-shrink-0" />
                <span className="font-medium">{frontmatter.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-600 text-xl flex-shrink-0" />
                <span className="font-medium">{frontmatter.readTime}</span>
              </div>
            </div>

            {/* Main content – BEAUTIFUL TYPOGRAPHY */}
            <div
              className={`
                prose prose-lg md:prose-xl lg:prose-2xl prose-slate max-w-none
                prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900
                prose-h1:text-4xl md:prose-h1:text-5xl lg:prose-h1:text-6xl prose-h1:leading-[1.05] prose-h1:mb-10
                prose-h2:text-3xl md:prose-h2:text-4xl lg:prose-h2:text-5xl prose-h2:mt-16 prose-h2:mb-8
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-8
                prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-orange-400 hover:prose-a:underline-offset-4
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/60 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:shadow-sm prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:my-10
                prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8 prose-li:text-lg prose-li:leading-relaxed prose-li:marker:text-orange-500
                prose-ol:my-8 prose-ol:list-decimal prose-ol:pl-8 prose-li:text-lg prose-li:leading-relaxed
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-slate-200 prose-img:my-10
                prose-code:text-sm prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-800 prose-pre:text-slate-200 prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-2xl prose-pre:overflow-x-auto prose-pre:my-10
                leading-relaxed tracking-wide font-sans
              `}
            >
              <MDXRemote
                source={content}
                components={{
                  Button,
                  Callout,
                  FaArrowRight,
                }}
              />
            </div>

            {/* Final CTA – prominent & inviting */}
            <div className="mt-20 pt-14 border-t border-slate-200/70 text-center">
              <p className="text-xl md:text-2xl text-slate-800 font-semibold mb-10 leading-relaxed">
                2026 में अपना विदेश पढ़ाई का सपना सच करने के लिए तैयार हो?
              </p>

              <Button
                href="/contact"
                className={`
                  group relative overflow-hidden
                  bg-gradient-to-r from-orange-600 to-amber-600
                  hover:from-orange-700 hover:to-amber-700
                  text-white px-12 py-6 rounded-full font-bold text-xl
                  inline-flex items-center gap-4 shadow-xl hover:shadow-2xl
                  transform hover:-translate-y-1.5 transition-all duration-300
                `}
              >
                Free Counselling बुक करो{" "}
                <FaArrowRight className="text-2xl group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((file) => ({
    slug: file.replace(/\.mdx$/, ""),
  }));
}

export const revalidate = 3600;
