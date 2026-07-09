"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ConfirmationModal from "@/components/adminform/confirmmsg";

import AddSuccessStoryForm from "@/components/adminform/addtestominal";
import { useSelector } from "react-redux";

// Animations (same as students page)
import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

export default function SuccessStoriesPage({ initialStories }) {
  const [submitting, setSubmitting] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    type: null, // "success" | "error"
    message: "",
  });
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [stories, setStories] = useState(initialStories || []);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const [mode, setMode] = useState(null); // "add" | "edit" | "view" | null
  const [selectedStory, setSelectedStory] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const isFormOpen = mode !== null;

  useEffect(() => {
    setStories(initialStories || []);
  }, [initialStories]);
  useEffect(() => {
    if (!initialStories || initialStories.length === 0) {
      fetchTestimonials();
    }
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/testimonial`,
        {
          credentials: "include",
        },
      );
      const data = await res.json();

      if (data.success) {
        setStories(data.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setSelectedStory(null);
    setMode("add");
  };

  const openEdit = (story) => {
    setSelectedStory(story);
    setMode("edit");
  };

  const openView = (story) => {
    setSelectedStory(story);
    setMode("view");
  };

  const openDeleteConfirm = (story) => {
    setStoryToDelete(story);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/testimonial/${storyToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      await fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }

    setShowConfirmDelete(false);
    setStoryToDelete(null);
  };

  const handleFormSuccess = async (formData) => {
    try {
      setSubmitting(true);

      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          key !== "photoFile"
        ) {
          form.append(key, formData[key]);
        }
      });

      if (formData.photoFile) {
        form.append("photo", formData.photoFile);
      }

      let res;

      if (mode === "add") {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/testimonial`,
          {
            method: "POST",
            body: form,
            credentials: "include",
          },
        );
      } else if (mode === "edit" && selectedStory) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/testimonial/${selectedStory._id}`,
          {
            method: "PUT",
            body: form,
            credentials: "include",
          },
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      await fetchTestimonials();

      setMode(null);
      setSelectedStory(null);

      setFeedbackModal({
        open: true,
        type: "success",
        message:
          mode === "add"
            ? "Success story added successfully!"
            : "Success story updated successfully!",
      });
    } catch (error) {
      setFeedbackModal({
        open: true,
        type: "error",
        message: error.message || "Failed to save success story.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStories = stories.filter(
    (s) =>
      (s.studentName || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.university || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={
            mode === "add"
              ? "Add New Success Story"
              : mode === "edit"
                ? "Edit Success Story"
                : mode === "view"
                  ? "View Success Story"
                  : "Success Stories Management"
          }
          counselorName={CounselorName}
          btnName={isFormOpen ? "Close" : "+ Add New Story"}
          onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 relative">
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

          {/* Form Modal */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-20 max-w-5xl mx-auto mb-12"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-5 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {mode === "add"
                        ? "Add New Success Story"
                        : mode === "edit"
                          ? "Edit Success Story"
                          : "Success Story Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <AddSuccessStoryForm
                      mode={mode}
                      initialData={selectedStory}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setMode(null)}
                      submitting={submitting}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Success story added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* List + Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="mb-6">
              <input
                type="text"
                placeholder="Search by student name or university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
              />
            </motion.div>

            {/* Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-10 text-gray-500">
                    Loading testimonials...
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">
                          Photo
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          University
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Country
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Visa
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Published
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStories.map((story) => (
                        <motion.tr
                          key={story._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                              <img
                                src={story.photo?.url}
                                alt={story.studentName}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/48?text=?")
                                }
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {story.studentName}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {story.university}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {story.country}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                story.visaStatus === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {story.visaStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                story.published
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {story.published ? "Yes" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                            <button
                              onClick={() => openView(story)}
                              className="text-sky-600 hover:text-sky-800 mr-4"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEdit(story)}
                              className="text-amber-600 hover:text-amber-800 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(story)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>

            {!loading && filteredStories.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-12 text-gray-500 text-lg"
              >
                No success stories found.
              </motion.p>
            )}
          </motion.div>

          {/* Delete Modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Success Story"
                message={`Are you sure you want to delete ${storyToDelete?.studentName}'s story? This cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setShowConfirmDelete(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {feedbackModal.open && (
              <ConfirmationModal
                title={feedbackModal.type === "success" ? "Success" : "Error"}
                message={feedbackModal.message}
                confirmText="OK"
                confirmVariant={
                  feedbackModal.type === "success" ? "success" : "danger"
                }
                onConfirm={() =>
                  setFeedbackModal({ open: false, type: null, message: "" })
                }
                onCancel={() =>
                  setFeedbackModal({ open: false, type: null, message: "" })
                }
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
