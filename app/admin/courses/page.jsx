// app/dashboard/courses/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddCourseForm from "@/components/adminform/addcourse"; 
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { containerVariants, itemVariants, formVariants } from "@/components/Animations/formanimations/animate";

export default function CoursesPage() {
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

  useEffect(() => {
    // Mock data
    const mockData = [
      {
        id: 1,
        name: "Master of Computer Science",
        university: "University of Toronto",
        level: "Master’s",
        field: "Computer Science & IT",
        duration: "2 years",
        tuition: "CAD 45,000 / year",
        intake: "Fall 2026",
        featured: true,
      },
      {
        id: 2,
        name: "Bachelor of Business Administration",
        university: "University of Melbourne",
        level: "Bachelor",
        field: "Business & Management",
        duration: "3 years",
        tuition: "AUD 42,000 / year",
        intake: "Semester 1 & 2",
        featured: true,
      },
      {
        id: 3,
        name: "MSc in Data Science",
        university: "Technical University of Munich",
        level: "Master’s",
        field: "Data Science & AI",
        duration: "2 years",
        tuition: "€ 0 (public university)",
        intake: "Winter 2026",
        featured: false,
      },
    ];
    setCourses(mockData);
    setLoading(false);
  }, []);

  // ─── Handlers ───
  const openAdd = () => {
    setSelectedCourse(null);
    setMode("add");
  };

  const openEdit = (course) => {
    setSelectedCourse(course);
    setMode("edit");
  };

  const openDeleteConfirm = (course) => {
    setCourseToDelete(course);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
    setShowConfirmDelete(false);
    setCourseToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newCourse = {
        id: Date.now(),
        name: formData.name || "Unnamed Course",
        university: formData.university || "",
        level: formData.level || "",
        field: formData.field || "",
        duration: formData.duration || "",
        tuition: formData.tuition || "",
        intake: formData.intake || "",
        featured: !!formData.featured,
      };

      setCourses((prev) => [...prev, newCourse]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? {
                ...c,
                name: formData.name || c.name,
                university: formData.university || c.university,
                level: formData.level || c.level,
                field: formData.field || c.field,
                duration: formData.duration || c.duration,
                tuition: formData.tuition || c.tuition,
                intake: formData.intake || c.intake,
                featured: !!formData.featured,
              }
            : c
        )
      );
    }

    // Close modal
    setMode(null);
    setSelectedCourse(null);
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.university.toLowerCase().includes(search.toLowerCase()) ||
      c.field.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
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
          counselorName="Imran"
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
                      {mode === "add" ? "Add New Course" : mode === "edit" ? "Edit Course" : "Course Details"}
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[180px]">Course Name</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">University</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Level</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Field</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Duration</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Tuition (approx.)</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Featured</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <motion.tr key={course.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{course.name}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{course.university}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{course.field}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden lg:table-cell">{course.duration}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">{course.tuition}</td>
                        <td className="px-4 py-3 sm:px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              course.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
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
        </main>
      </div>
    </div>
  );
}