"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaArrowRight,
  FaBookOpen,
  FaEnvelope,
  FaGlobeAsia,
} from "react-icons/fa";

import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" },
  hover: {
    y: -10,
    scale: 1.02,
    boxShadow: "0 20px 30px -10px rgba(0,0,0,0.2)",
  },
};

export default function Blog({
  posts,
  initialTotal = 0,
  pageSize = 12,
  currentPage = 1,
  totalPages = 1,
}) {
  // FIX (2026-07): "Load More Articles" was previously a client-only fetch
  // with no backing URL — posts beyond page 1 had no <a href> anywhere in
  // server-rendered HTML for Googlebot to follow, and no independent URL to
  // discover or index. Replaced with real /blog?page=N navigation via
  // next/link, so every page of results (and every post on it) is reachable
  // through a normal crawlable link, not just the sitemap.
  const total = initialTotal;

  // Only spotlight a "featured" post on page 1 — on later pages every post
  // renders in the regular grid.
  const featuredPost = currentPage === 1 ? posts?.[0] || null : null;
  const recentPosts = currentPage === 1 ? posts?.slice(1) || [] : posts || [];
  const categories = [
    "Country Guides",
    "Visa Guidance",
    "Application Tips",
    "Scholarships",
    "Success Stories",
    "Student Life",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero - Fade in from top */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative bg-[#0f2a5f] text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2a5f] via-[#0f2a5f] to-[#091d42] opacity-90" />
        <div className="relative container mx-auto px-6 md:px-12 py-20 md:py-28 max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Study Abroad Insights
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Journey to Global Education Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10">
              Expert advice, real student stories, visa secrets & latest updates
              — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#latest"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition transform hover:scale-[1.03]"
              >
                Explore Latest Articles
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories Bar - Slide in */}
      <motion.section
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="py-10 border-b bg-white sticky top-0 z-10 shadow-sm"
      >
        <div className="container mx-auto px-6 md:px-12 max-w-6xl overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-5 py-2.5 bg-gray-100 hover:bg-[#0f2a5f] hover:text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16" id="latest">
            {/* Featured Post */}
            {featuredPost ? (
              <motion.article
                whileHover="hover"
                initial="rest"
                animate="rest"
                variants={cardHover}
                className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group"
              >
                <div className="relative h-64 md:h-96 overflow-hidden">
                  {featuredPost.coverImage?.url ? (
                    <Image
                      src={featuredPost.coverImage.url}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0f2a5f] to-[#091d42] flex items-center justify-center">
                      <span className="text-white/50 text-2xl">
                        Featured Article
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                      {featuredPost.focusCountry}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <div className="flex items-center gap-6 text-white/90 text-sm">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />{" "}
                        {new Date(featuredPost.publishDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaClock /> {featuredPost.estimatedReadTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <p className="text-gray-700 text-lg mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-3 text-[#0f2a5f] font-semibold hover:text-orange-600 transition-colors text-lg"
                  >
                    Read Full Article <FaArrowRight />
                  </Link>
                </div>
              </motion.article>
            ) : (
              <motion.div
                variants={fadeInUp}
                className="text-center py-12 text-gray-600"
              >
                <p className="text-xl">
                  No featured article yet. Check back soon!
                </p>
              </motion.div>
            )}

            {/* Regular Posts */}
            {recentPosts.length > 0 ? (
              <motion.div
                variants={staggerChildren}
                className="grid md:grid-cols-2 gap-8"
              >
                {recentPosts.map((post) => (
                  <motion.article
                    key={post.slug}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    variants={cardHover}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {post.coverImage?.url ? (
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <span className="absolute top-4 left-4 bg-[#0f2a5f] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {post.focusCountry}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <FaCalendarAlt className="text-orange-500" />{" "}
                          {new Date(post.publishDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaClock className="text-orange-500" />{" "}
                          {post.estimatedReadTime}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0f2a5f] mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <FaUser className="text-orange-500" /> Khizar Overseas
                          Team
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
                        >
                          Read <FaArrowRight className="text-sm" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                variants={fadeInUp}
                className="text-center py-12 text-gray-600"
              >
                <p>No recent articles yet. New content coming soon!</p>
              </motion.div>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="Blog pagination"
                className="flex items-center justify-center flex-wrap gap-2 mt-12"
              >
                {currentPage > 1 && (
                  <Link
                    href={
                      currentPage - 1 === 1
                        ? "/blog"
                        : `/blog?page=${currentPage - 1}`
                    }
                    className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-[#0f2a5f] font-medium hover:bg-gray-50 transition"
                  >
                    ← Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={p === 1 ? "/blog" : `/blog?page=${p}`}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`px-5 py-3 rounded-xl font-semibold transition ${
                        p === currentPage
                          ? "bg-[#0f2a5f] text-white"
                          : "bg-white border border-gray-200 text-[#0f2a5f] hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </Link>
                  ),
                )}

                {currentPage < totalPages && (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="px-5 py-3 rounded-xl bg-[#0f2a5f] text-white font-semibold hover:bg-[#091d42] transition"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-10 lg:sticky lg:top-24 lg:h-fit"
          >
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#0f2a5f] to-[#091d42] text-white rounded-2xl p-8 shadow-xl">
              <FaEnvelope className="text-4xl text-orange-400 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Stay Updated</h4>
              <p className="text-white/80 mb-6">
                Get the latest visa rules, scholarships & success stories
                directly in your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-orange-400"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  Subscribe Now
                </button>
              </form>
            </div>

            {/* Popular Destinations */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h4 className="text-xl font-bold text-[#0f2a5f] mb-6 flex items-center gap-3">
                <FaGlobeAsia className="text-orange-500" /> Popular Destinations
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {["Canada", "Germany", "Australia", "UK", "USA", "Ireland"].map(
                  (country) => (
                    <Link
                      key={country}
                      href={`/study-in-${country.toLowerCase()}`}
                      className="text-center py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-[#0f2a5f] font-medium hover:text-orange-600 transition"
                    >
                      {country}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </div>

      {/* Final CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="bg-gradient-to-r from-[#0f2a5f] via-[#0a2550] to-[#091d42] text-white py-20"
      >
        <div className="container mx-auto px-6 md:px-12 text-center max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Dream University is Waiting
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Thousands of students have transformed their future with our
            guidance. Your turn starts now.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-6 rounded-xl shadow-2xl transition transform hover:scale-[1.05]"
          >
            <FaBookOpen className="text-2xl" /> Book Free Consultation Today
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
