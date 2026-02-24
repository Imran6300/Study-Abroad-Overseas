"use client";

import { useState, useEffect, useMemo } from "react";
import { getSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { useSelector } from "react-redux";
import BlogPostForm from "@/components/adminform/addblog";
import ConfirmationModal from "@/components/adminform/confirmmsg";

import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  FileText,
  Star,
  X,
} from "lucide-react";

import {
  containerVariants,
  itemVariants,
  formVariants, // ← must exist – copy from courses page if needed
} from "@/components/Animations/formanimations/animate";

// ─── BlogCard (completely unchanged) ───
function BlogCard({ post, onEdit, onDelete, onView }) {
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
          loading="lazy"
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

        <p className="text-sm text-gray-600 line-clamp-2 mb-5">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{post.readTime}</span>
          <span>{post.views} views</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 sm:p-6">
        <div className="flex gap-3 w-full">
          <button
            onClick={() => onView(post.slug)}
            className="flex-1 bg-white/95 hover:bg-white text-gray-900 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 backdrop-blur-md shadow-sm transition-colors"
          >
            <Eye size={16} /> View
          </button>
          <button
            onClick={() => onEdit(post.slug)}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 backdrop-blur-md shadow-sm transition-colors"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button
            onClick={() => onDelete(post)}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function BlogAdminPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  //real time views

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("blog:viewUpdated", ({ blogId, views }) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === blogId ? { ...post, views } : post,
        ),
      );
    });

    return () => {
      socket.off("blog:viewUpdated");
    };
  }, []);
  const [modalState, setModalState] = useState({
    open: false,
    title: "",
    message: "",
    confirmVariant: "primary",
  });

  // Modal control
  const [mode, setMode] = useState(null); // null | "add"
  const isFormOpen = mode !== null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedSearch] = useDebounce(search, 350);

  const handleEdit = async (slug) => {
    try {
      const res = await fetch(
        `https://overseas-backend-production-4f18.up.railway.app/host/blogs/${slug}`,
        {
          credentials: "include",
        },
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error("Failed to fetch blog");
      }

      setSelectedBlog(result.data);
      setMode("edit");
    } catch (error) {
      console.error(error);
    }
  };

  const handleView = async (slug) => {
    try {
      const res = await fetch(
        `https://overseas-backend-production-4f18.up.railway.app/host/blogs/${slug}`,
        {
          credentials: "include",
        },
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error("Failed to fetch blog");
      }

      setSelectedBlog(result.data);
      setMode("view"); // 👁 open in view mode
    } catch (error) {
      console.error(error);
    }
  };
  const confirmDelete = async (slug) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/blogs/${slug}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Delete failed");

      await fetchBlogs();

      setModalState({
        open: true,
        title: "Deleted",
        message: "Blog deleted successfully",
        confirmVariant: "primary",
      });
    } catch (error) {
      setModalState({
        open: true,
        title: "Error",
        message: error.message,
        confirmVariant: "danger",
      });
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "https://overseas-backend-production-4f18.up.railway.app/host/blogs",
        {
          credentials: "include",
        },
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error("Failed to fetch blogs");
      }

      const formatted = result.data.map((blog) => ({
        id: blog._id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        coverImage: blog.coverImage?.url || "/placeholder.jpg",
        status: blog.status || "Draft",
        featured: blog.featured || false,
        publishDate: blog.publishDate,
        readTime: blog.estimatedReadTime,
        views: blog.views || 0,
      }));

      setPosts(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 🔥 PUT THIS BACK
    }
  };
  const handleDelete = (post) => {
    setModalState({
      open: true,
      title: "Delete Blog?",
      message: `Are you sure you want to delete "${post.title}"?`,
      confirmVariant: "danger",
      blogSlug: post.slug,
    });
  };

  useEffect(() => {
    fetchBlogs();
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

  const counts = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((p) => p.status === "Published").length,
      draft: posts.filter((p) => p.status === "Draft").length,
      scheduled: posts.filter((p) => p.status === "Scheduled").length,
    }),
    [posts],
  );

  const openAddForm = () => {
    setSelectedBlog(null);
    setMode("add");
  };
  const closeForm = () => setMode(null);

  const handleFormSuccess = async (formData) => {
    try {
      setIsSubmitting(true);

      const endpoint =
        mode === "edit"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/blogs/${selectedBlog.slug}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/blogs`;

      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save blog");
      }

      closeForm();
      await fetchBlogs();

      setModalState({
        open: true,
        title: "Success",
        message:
          mode === "edit"
            ? "Blog updated successfully 🚀"
            : "Blog created successfully 🚀",
        confirmVariant: "primary",
      });
    } catch (error) {
      setModalState({
        open: true,
        title: "Error",
        message: error.message,
        confirmVariant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title={isFormOpen ? "Create New Article" : "Blog & Content Hub"}
          counselorName={CounselorName}
          btnName={isFormOpen ? "Close" : "+ New Article"}
          onButtonClick={isFormOpen ? closeForm : openAddForm}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          {/* Backdrop */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Modal Form */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-20 max-w-4xl mx-auto mb-12"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-5 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      New Blog Article
                    </h2>
                    <button
                      onClick={closeForm}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <BlogPostForm
                      initialData={selectedBlog}
                      mode={mode}
                      onSuccess={handleFormSuccess}
                      onCancel={closeForm}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content – dim when form open */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-6 sm:space-y-10 max-w-7xl mx-auto transition-opacity duration-500 ${
              isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Mobile FAB – hide when form is open */}
            {!isFormOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-xl transition-all duration-300"
                onClick={openAddForm}
              >
                <Plus size={28} strokeWidth={2.5} />
              </motion.button>
            )}

            {/* Stats + Filters */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-5"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total Posts
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {counts.total}
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Published</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                    {counts.published}
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
                    {counts.draft}
                  </p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/60 shadow-sm hover:shadow transition-shadow">
                  <p className="text-xs sm:text-sm text-gray-600">Scheduled</p>
                  <p className="text-2xl sm:text-3xl font-bold text-violet-600 mt-1">
                    {counts.scheduled}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {["All", "Published", "Draft", "Scheduled"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setFilterStatus(
                        status.toLowerCase() === "all"
                          ? "all"
                          : status.toLowerCase(),
                      )
                    }
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all
                      ${
                        filterStatus ===
                        (status.toLowerCase() === "all"
                          ? "all"
                          : status.toLowerCase())
                          ? "bg-sky-600 text-white shadow-md"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Posts Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredPosts.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="col-span-full py-20 text-center text-gray-500 text-lg"
                >
                  <p>No articles found.</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search or filter.
                  </p>
                </motion.div>
              ) : (
                filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))
              )}
            </motion.div>
          </motion.div>
          {modalState.open && (
            <ConfirmationModal
              title={modalState.title}
              message={modalState.message}
              confirmText={
                modalState.confirmVariant === "danger" ? "Delete" : "OK"
              }
              cancelText="Cancel"
              confirmVariant={modalState.confirmVariant}
              onConfirm={() => {
                if (modalState.blogSlug) {
                  confirmDelete(modalState.blogSlug);
                } else {
                  setModalState({ ...modalState, open: false });
                }
              }}
              onCancel={() => setModalState({ ...modalState, open: false })}
            />
          )}
        </main>
      </div>
    </div>
  );
}
