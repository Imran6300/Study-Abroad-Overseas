// app/dashboard/courses/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddCourseForm from "@/components/adminform/addcourse";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";
import { useSelector } from "react-redux";

export default function CoursesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(null); // "success" | "error"

  const { user } = useSelector((state) => state.auth);
  const counselorName = user?.name;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Modal states
  const [mode, setMode] = useState(null); // null | "add" | "edit" | "view"
  const [selectedCourse, setSelectedCourse] = useState(null);
  const isFormOpen = mode !== null;

  // Delete confirmation
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch courses");
      }

      // 🔥 map backend fields to your table format
      const formatted = data.courses.map((course) => ({
        id: course._id,
        slug: course.slug,
        name: course.title,
        university: course.primaryUniversity?.name || "—",
        level: course.level,
        field: course.field,
        duration: course.duration,
        tuition: course.fees,
        featured: course.featured,
      }));

      setCourses(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ─── Handlers ───
  const openAdd = () => {
    setSelectedCourse(null);
    setMode("add");
  };

  const openEdit = async (course) => {
    try {
      setIsSubmitting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${course.slug}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch course details");
      }

      setSelectedCourse(data.course); // FULL backend object
      setMode("edit");
    } catch (error) {
      setModalType("error");
      setModalMessage("Failed to load course details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (course) => {
    setCourseToDelete(course);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${courseToDelete.slug}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      await fetchCourses();

      setModalType("success");
      setModalMessage("Course deleted successfully!");
    } catch (error) {
      setModalType("error");
      setModalMessage("Failed to delete course.");
    } finally {
      setShowConfirmDelete(false);
      setCourseToDelete(null);
    }
  };

  const handleFormSuccess = async (formData) => {
    try {
      setIsSubmitting(true); // 🔥 start loading

      const form = new FormData();

      // Basic Fields
      form.append("topLabel", formData.topLabel);
      form.append("title", formData.title);
      form.append("subtitle", formData.subtitle);
      form.append("duration", formData.duration);
      form.append("fees", formData.fees);
      form.append("scholarships", formData.scholarships);
      form.append("avgSalary", formData.avgSalary);

      form.append("level", formData.level);
      form.append("field", formData.field);
      form.append("primaryUniversity", formData.primaryUniversity);
      form.append("salariesInCountries", formData.salariesInCountries);

      form.append("featured", formData.featured);

      form.append("overviewTitle", formData.overviewTitle);
      form.append("overviewDescription", formData.overviewDescription);

      form.append("keyHighlights", JSON.stringify(formData.keyHighlights));
      form.append(
        "entryRequirements",
        JSON.stringify(formData.entryRequirements),
      );
      form.append("popularJobRoles", JSON.stringify(formData.popularJobRoles));
      form.append("topUniversities", JSON.stringify(formData.topUniversities));

      form.append("careerProspects", formData.careerProspects);
      form.append("salaryExpectations", formData.salaryExpectations);

      if (formData.bgImageFile) {
        form.append("bgImage", formData.bgImageFile);
      }

      const isEdit = mode === "edit";

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/${selectedCourse.slug}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setModalType("error");
        setModalMessage(data.message || "Failed to create course.");
        return;
      }

      // ✅ SUCCESS
      setModalType("success");
      if (isEdit) {
        setModalMessage("Course updated successfully!");
      } else {
        setModalMessage("Course added successfully!");
      }
      setMode(null);
      await fetchCourses();
    } catch (error) {
      setModalType("error");
      setModalMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // 🔥 stop loading
    }
  };

  const filteredCourses = courses.filter((c) => {
    const searchLower = search.toLowerCase();

    return (
      (c.name || "").toLowerCase().includes(searchLower) ||
      (c.university || "").toLowerCase().includes(searchLower) ||
      (c.field || "").toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-600"
        >
          Loading courses...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title={
            mode === "add"
              ? "Add New Course"
              : mode === "edit"
                ? "Edit Course"
                : mode === "view"
                  ? "Course Details"
                  : "Courses Management"
          }
          counselorName={counselorName}
          btnName={isFormOpen ? "Close" : "+ Add Course"}
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
                className="relative z-20 max-w-4xl mx-auto mb-12"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-5 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {mode === "add"
                        ? "Add New Course"
                        : mode === "edit"
                          ? "Edit Course"
                          : "Course Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <AddCourseForm
                      mode={mode}
                      initialData={selectedCourse}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setMode(null)}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success toast */}
          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Course added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Search by course name, university or field..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[180px]">
                        Course Name
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        University
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Level
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Field
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">
                        Duration
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Tuition (approx.)
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Featured
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <motion.tr
                        key={course.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                          {course.name}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">
                          {course.university}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">
                          {course.field}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden lg:table-cell">
                          {course.duration}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">
                          {course.tuition}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              course.featured
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {course.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium whitespace-nowrap">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(course)}
                              className="text-sky-600 hover:text-sky-800 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(course)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCourses.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-10 text-gray-500 text-base sm:text-lg"
              >
                No courses found matching your search.
              </motion.p>
            )}
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Course"
                message={`Are you sure you want to delete "${courseToDelete?.name}"? This cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setShowConfirmDelete(false)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {modalType && (
              <ConfirmationModal
                title={modalType === "success" ? "Success" : "Error"}
                message={modalMessage}
                confirmText="OK"
                confirmVariant={modalType === "success" ? "success" : "danger"}
                onConfirm={() => setModalType(null)}
                onCancel={() => setModalType(null)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
