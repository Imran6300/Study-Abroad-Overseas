"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ConfirmationModal from "@/components/adminform/confirmmsg";

// Assume you will create this component (similar to AddStudentForm)
import AddSuccessStoryForm from "@/components/adminform/addtestominal"; // ← create this

// Animations (same as students page)
import { containerVariants, itemVariants, formVariants } from "@/components/Animations/formanimations/animate";

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState([
    {
      id: 1,
      studentName: "Priya Sharma",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      university: "University of Toronto",
      course: "MSc Computer Science",
      country: "Canada",
      scholarship: "CAD 25,000",
      visaStatus: "Approved",
      excerpt: "Overseas made my dream come true – full scholarship and visa in record time!",
      published: true,
      dateAdded: "2026-01-15",
    },
    // ... other mock entries ...
  ]);

  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Modal control
  const [mode, setMode] = useState(null); // "add" | "edit" | "view" | null
  const [selectedStory, setSelectedStory] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const isFormOpen = mode !== null;

  // ─── Handlers ───
  const openAdd = () => {
    setSelectedStory(null);
    setMode("add");
  };

  const openEdit = (story) => {
    setSelectedStory(story);
    setMode("edit");
  };

  // Optional: view mode (read-only form or just details)
  const openView = (story) => {
    setSelectedStory(story);
    setMode("view");
  };

  const openDeleteConfirm = (story) => {
    setStoryToDelete(story);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setStories((prev) => prev.filter((s) => s.id !== storyToDelete.id));
    setShowConfirmDelete(false);
    setStoryToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newStory = {
        id: Date.now(),
        studentName: formData.studentName || "Unknown Student",
        photo: formData.photo || "https://via.placeholder.com/400?text=Student",
        university: formData.university || "",
        course: formData.course || "",
        country: formData.country || "",
        scholarship: formData.scholarship || "—",
        visaStatus: formData.visaStatus || "Pending",
        excerpt: formData.excerpt || "",
        published: formData.published ?? true,
        dateAdded: new Date().toISOString().split("T")[0],
      };
      setStories((prev) => [...prev, newStory]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedStory) {
      setStories((prev) =>
        prev.map((s) =>
          s.id === selectedStory.id
            ? {
                ...s,
                studentName: formData.studentName || s.studentName,
                photo: formData.photo || s.photo,
                university: formData.university || s.university,
                course: formData.course || s.course,
                country: formData.country || s.country,
                scholarship: formData.scholarship || s.scholarship,
                visaStatus: formData.visaStatus || s.visaStatus,
                excerpt: formData.excerpt || s.excerpt,
                published: formData.published ?? s.published,
              }
            : s
        )
      );
    }

    // Close
    setMode(null);
    setSelectedStory(null);
  };

  const filteredStories = stories.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.university.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
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
          counselorName="Imran"
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">Photo</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">University</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Country</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Visa</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Published</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStories.map((story) => (
                      <motion.tr
                        key={story.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                            <img
                              src={story.photo}
                              alt={story.studentName}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=?")}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">{story.studentName}</td>
                        <td className="px-6 py-4 text-gray-600">{story.university}</td>
                        <td className="px-6 py-4 text-gray-600">{story.country}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              story.visaStatus === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {story.visaStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              story.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
              </div>
            </motion.div>

            {filteredStories.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-12 text-gray-500 text-lg">
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
        </main>
      </div>
    </div>
  );
}