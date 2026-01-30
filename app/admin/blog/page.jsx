
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce"; // npm install use-debounce
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { Plus, Eye, Edit2, Trash2, Clock, CheckCircle, FileText, Star } from "lucide-react";

// Animation variants – container only
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function BlogCard({ post }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
            <CheckCircle size={14} /> Published
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-medium">
            <Clock size={14} /> Scheduled
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            <FileText size={14} /> Draft
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <article className="group relative bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all duration-300">
      {post.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
            <Star size={12} fill="white" /> Featured
          </span>
        </div>
      )}

      <div className="h-48 sm:h-56 overflow-hidden relative">
        <img
          src={post.coverImage}
          alt={post.title}
          loading="lazy"                  // ← important
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          {getStatusBadge(post.status)}
          <span className="text-xs text-gray-500 font-medium">
            {post.publishDate
              ? new Date(post.publishDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Draft"}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-700 transition-colors">
          {post.title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-5">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{post.readTime}</span>
          <span>{post.views} views</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 sm:p-6">
        <div className="flex gap-3 w-full">
          <button className="flex-1 bg-white/95 hover:bg-white text-gray-900 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 backdrop-blur-md shadow-sm transition-colors">
            <Eye size={16} /> View
          </button>
          <button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 backdrop-blur-md shadow-sm transition-colors">
            <Edit2 size={16} /> Edit
          </button>
          <button className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [debouncedSearch] = useDebounce(search, 350);

  useEffect(() => {
    // Mock data – replace with real fetch later
    const mockPosts = [
      {
        id: 1,
        title: "Top 10 Universities in Canada for 2026 Intake",
        slug: "top-10-universities-canada-2026",
        excerpt: "Discover the best Canadian universities with high visa success rates and scholarship opportunities...",
        coverImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        status: "Published",
        featured: true,
        author: "Imran",
        publishDate: "2026-01-12",
        readTime: "8 min",
        views: 1240,
      },
      {
        id: 2,
        title: "How to Prepare for IELTS in 30 Days – Step-by-Step Guide",
        slug: "ielts-preparation-30-days-guide",
        excerpt: "Realistic timeline, best resources, and common mistakes to avoid...",
        coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        status: "Draft",
        featured: false,
        author: "Imran",
        publishDate: null,
        readTime: "12 min",
        views: 0,
      },
      {
        id: 3,
        title: "Germany Free Education – Complete Application Process 2026",
        slug: "germany-free-education-2026",
        excerpt: "Public universities with zero tuition + blocked account & APS guide...",
        coverImage: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
        status: "Scheduled",
        featured: false,
        author: "Imran",
        publishDate: "2026-02-05",
        readTime: "10 min",
        views: 0,
      },
      {
        id: 4,
        title: "Why Study in the UK? 2026 Guide for Indian Students",
        slug: "study-in-uk-2026-guide-indian-students",
        excerpt: "Post-study work visa, top universities, scholarships & application tips...",
        coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        status: "Published",
        featured: true,
        author: "Imran",
        publishDate: "2026-01-20",
        readTime: "9 min",
        views: 980,
      },
    ];

    setPosts(mockPosts);
    setLoading(false);
  }, []);


  const filteredPosts = useMemo(() => {
    const term = debouncedSearch?.toLowerCase() || "";

    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(term) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(term));

      const matchesFilter =
        filterStatus === "all" ||
        post.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [posts, debouncedSearch, filterStatus]);

  const counts = useMemo(() => ({
    total: posts.length,
    published: posts.filter((p) => p.status === "Published").length,
    draft: posts.filter((p) => p.status === "Draft").length,
    scheduled: posts.filter((p) => p.status === "Scheduled").length,
  }), [posts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-600">Loading your blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Blog & Content Hub"
          counselorName="Imran"
          btnName="+ New Article"
          onButtonClick={() => alert("→ Open new post editor / modal")}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-10 max-w-7xl mx-auto"
          >
            {/* Mobile FAB */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
              onClick={() => alert("→ New post editor")}
            >
              <Plus size={28} strokeWidth={2.5} />
            </motion.button>

            {/* Stats + Filters */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{counts.total}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Published</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">{counts.published}</p>
                </div>
                {/* Draft & Scheduled cards similarly */}
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{counts.draft}</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Scheduled</p>
                  <p className="text-2xl sm:text-3xl font-bold text-violet-600 mt-1">{counts.scheduled}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["All", "Published", "Draft", "Scheduled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status.toLowerCase() === "all" ? "all" : status.toLowerCase())}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${filterStatus === (status.toLowerCase() === "all" ? "all" : status.toLowerCase())
                        ? "bg-sky-600 text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}
                    `}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Search */}
            <motion.div variants={itemVariants} className="relative max-w-2xl">
              <input
                type="search"
                placeholder="Search articles by title, excerpt or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-base bg-white shadow-inner transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>

            {/* Posts Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="col-span-full py-20 text-center text-gray-500 text-lg"
                >
                  <p>No articles found.</p>
                  <p className="text-sm mt-2">Try adjusting your search or filter.</p>
                </motion.div>
              ) : (
                filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

/*
  For 80+ posts → add virtualization with react-virtuoso

  npm install react-virtuoso

  Replace grid with:

  import { VirtuosoGrid } from 'react-virtuoso';

  <div style={{ height: '70vh' }}>
    <VirtuosoGrid
      data={filteredPosts}
      itemContent={(_, post) => <BlogCard post={post} />}
      listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      // overscan = 3–5 items recommended
    />
  </div>
*/