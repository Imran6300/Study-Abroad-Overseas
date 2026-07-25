// app/(site)/blog/[slug]/page.jsx
//
// BUGS FIXED:
// 1. generateStaticParams was MISSING entirely. Without it Next.js can't
//    pre-render blog pages at build time. Every blog page was SSR-only,
//    meaning Google had to wait for JS execution → slower indexing.
//    Fix: added generateStaticParams fetching all published blog slugs.
//
// 2. Breadcrumb relatedCountries link used /all-countries/${slug}
//    Should use /study-in-${slug} (the canonical URL).
//
// 3. Not-found render returned a plain <div> instead of notFound().
//    notFound() triggers Next.js 404 page properly.
//
// 4. keywords was using blog.tags only — now also includes secondaryKeywords
//    from the new seo model fields if admin has filled them.
//
// 5. seo.focusKeyword was never injected into keywords. Added.

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import Button from "@/components/mdx/Button";

const BASE_URL = "https://www.khizaroverseas.in";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getBlog(slug) {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

// FIX 1: generateStaticParams — was completely missing
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/blogs?status=Published&limit=500`);
    const json = await res.json();
    // blogController.getBlogsList returns { blogs: [...] }
    return (json.blogs || json.data || []).map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog Not Found" };

  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt || "";
  const canonical = blog.canonicalUrl || `${BASE_URL}/blog/${slug}`;
  const ogImage = blog.socialMeta?.ogImage?.url || blog.coverImage?.url || null;

  // FIX 4+5: include secondaryKeywords and focusKeyword in keywords
  const allKeywords = [
    ...(blog.tags || []),
    ...(blog.seo?.secondaryKeywords || []),
    ...(blog.focusKeyword ? [blog.focusKeyword] : []),
    ...(blog.seo?.focusKeyword ? [blog.seo.focusKeyword] : []),
  ].filter(Boolean);

  return {
    // Bypass the root layout's title template ("%s | Overseas Admission
    // Experts – USA, UK, Canada, Australia, Germany"), which was blindly
    // appending ~70 extra characters to every blog post title and pushing
    // it well past Google's ~60-char display limit, truncating it
    // mid-sentence in search results. Same fix already applied on
    // app/(site)/partners/layout.jsx.
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: !blog.noIndex, follow: true },
    keywords: allKeywords.length ? allKeywords.join(", ") : undefined,

    openGraph: {
      title: blog.socialMeta?.ogTitle || title,
      description: blog.socialMeta?.ogDescription || description,
      url: canonical,
      siteName: "Khizar Overseas",
      type: "article",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : [],
      publishedTime: blog.publishDate
        ? new Date(blog.publishDate).toISOString()
        : undefined,
      modifiedTime: blog.updatedAt
        ? new Date(blog.updatedAt).toISOString()
        : undefined,
      section: blog.structuredData?.articleSection || undefined,
      tags: blog.tags || [],
    },

    twitter: {
      card: "summary_large_image",
      title: blog.socialMeta?.twitterTitle || title,
      description: blog.socialMeta?.twitterDescription || description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Post({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  // FIX 3: use notFound() for proper 404 handling
  if (!blog) return notFound();

  const canonical = blog.canonicalUrl || `${BASE_URL}/blog/${slug}`;
  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt || "";

  // ── Article JSON-LD ────────────────────────────────────────────────────
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description,
    url: canonical,
    image: blog.coverImage?.url
      ? {
          "@type": "ImageObject",
          url: blog.coverImage.url,
          caption: blog.altText || blog.title,
        }
      : undefined,
    datePublished: blog.publishDate
      ? new Date(blog.publishDate).toISOString()
      : undefined,
    dateModified: blog.updatedAt
      ? new Date(blog.updatedAt).toISOString()
      : blog.publishDate
        ? new Date(blog.publishDate).toISOString()
        : undefined,
    author: {
      "@type": "Organization",
      name: blog.author?.name || "Khizar Overseas",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Khizar Overseas",
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    ...(blog.structuredData?.wordCount && {
      wordCount: blog.structuredData.wordCount,
    }),
    ...(blog.structuredData?.articleSection && {
      articleSection: blog.structuredData.articleSection,
    }),
    ...(blog.tags?.length && { keywords: blog.tags.join(", ") }),
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "Blog",
      name: "Khizar Overseas Study Abroad Blog",
      url: `${BASE_URL}/blog`,
    },
  };

  // ── FAQPage JSON-LD ────────────────────────────────────────────────────
  const faqJsonLd = blog.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blog.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  // ── BreadcrumbList JSON-LD ─────────────────────────────────────────────
  let breadcrumbItems;
  if (blog.breadcrumbs?.length) {
    breadcrumbItems = blog.breadcrumbs;
  } else if (blog.relatedCountries?.length) {
    const firstCountry = blog.relatedCountries[0];
    breadcrumbItems = [
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` },
      ...(firstCountry?.name && firstCountry?.slug
        ? [
            {
              name: `Study in ${firstCountry.name}`,
              // FIX 2: was /all-countries/... now /study-in-...
              url: `${BASE_URL}/study-in-${firstCountry.slug}`,
            },
          ]
        : []),
      { name: blog.title, url: canonical },
    ];
  } else {
    breadcrumbItems = [
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` },
      { name: blog.title, url: canonical },
    ];
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-5 from-slate-50 via-white to-slate-50/80">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 w-full" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl xl:max-w-4xl pt-12 pb-24 lg:pt-16">
        <Link
          href="/blog"
          className="group mb-12 inline-flex items-center gap-3 text-slate-600 hover:text-orange-700 font-medium text-lg transition-colors duration-200"
        >
          <FaArrowLeft className="text-lg transition-transform group-hover:-translate-x-2 duration-300" />
          Back to Articles
        </Link>

        <article className="relative bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden border border-slate-100/80">
          {blog.coverImage?.url && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent/0 z-10" />
              <Image
                src={blog.coverImage.url}
                alt={blog.altText || blog.title}
                width={1400}
                height={720}
                priority
                quality={85}
                className="w-full h-[38vh] sm:h-[45vh] md:h-[52vh] lg:h-[58vh] object-cover brightness-[0.88] contrast-[1.04] saturate-[1.05]"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 px-8 pb-12 hidden md:block">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                  {blog.title}
                </h1>
              </div>
            </div>
          )}

          <div className="px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20 pt-12 pb-16 md:pt-14 lg:pt-16">
            <h1 className="md:hidden text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-5 text-base text-slate-500 mb-12 pb-10 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-orange-600 text-xl flex-shrink-0" />
                <time className="font-medium">
                  {new Date(String(blog.publishDate)).toLocaleDateString(
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
                <span className="font-medium">
                  {blog.author?.name || "Khizar Overseas Team"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaClock className="text-orange-600 text-xl flex-shrink-0" />
                <span className="font-medium">{blog.estimatedReadTime}</span>
              </div>
            </div>

            <div
              className={`
                prose prose-lg md:prose-xl lg:prose-2xl prose-slate max-w-none
                prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900
                prose-h1:text-4xl md:prose-h1:text-5xl lg:prose-h1:text-6xl prose-h1:leading-[1.05] prose-h1:mb-10
                prose-h2:text-3xl md:prose-h2:text-4xl lg:prose-h2:text-5xl prose-h2:mt-16 prose-h2:mb-8
                prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-12 prose-h3:mb-6
                prose-p:text-lg md:prose-p:text-xl prose-p:leading-relaxed prose-p:text-slate-700 prose-p:mb-8
                prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/60 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic
                prose-ul:my-8 prose-ul:list-disc prose-ul:pl-8 prose-li:text-lg prose-li:leading-relaxed prose-li:marker:text-orange-500
                prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10
                leading-relaxed tracking-wide font-sans
              `}
            >
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>

            <div className="mt-20 pt-14 border-t border-slate-200/70 text-center">
              <p className="text-xl md:text-2xl text-slate-800 font-semibold mb-10 leading-relaxed">
                2026 में अपना विदेश पढ़ाई का सपना सच करने के लिए तैयार हो?
              </p>
              <Button
                href="/contact"
                className={`
                  group relative overflow-hidden
                  bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700
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

export const revalidate = 86400;
