// app/dashboard/universities/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddUniversityForm from "@/components/adminform/adduniversity";
import ConfirmationModal from "@/components/adminform/confirmmsg"; // ← Import the same modal
import { containerVariants, itemVariants, formVariants } from "@/components/Animations/formanimations/animate";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Modal control states for form
  const [mode, setMode] = useState(null); // null | "add" | "edit" | "view"
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  // Delete confirmation states (same pattern as students page)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  const isFormOpen = mode !== null;

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "University of Toronto",
        logo: "/universityeslogos/ethlogo.png",
        country: "Canada",
        city: "Toronto",
        website: "utoronto.ca",
        qsRanking: 25,
        featured: true,
        partnered: true,
        studentsPlaced: 42,
        status: "Active",
      },
      {
        id: 2,
        name: "University of Melbourne",
        logo: "/universityeslogos/mitlogo.png",
        country: "Australia",
        city: "Melbourne",
        website: "unimelb.edu.au",
        qsRanking: 14,
        featured: true,
        partnered: false,
        studentsPlaced: 31,
        status: "Active",
      },
      {
        id: 3,
        name: "Technical University of Munich",
        logo: "/universityeslogos/stanforduniversity.png",
        country: "Germany",
        city: "Munich",
        website: "tum.de",
        qsRanking: 28,
        featured: false,
        partnered: true,
        studentsPlaced: 18,
        status: "Active",
      },
    ];

    setUniversities(mockData);
    setLoading(false);
  }, []);

  // ─── Handlers ───
  const openAdd = () => {
    setSelectedUniversity(null);
    setMode("add");
  };

  const openEdit = (university) => {
    setSelectedUniversity(university);
    setMode("edit");
  };

  const openDeleteConfirm = (university) => {
    setUniversityToDelete(university);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setUniversities((prev) => prev.filter((u) => u.id !== universityToDelete.id));
    setShowConfirmDelete(false);
    setUniversityToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newUni = {
        id: Date.now(),
        name: formData.name || "Unnamed University",
        logo: formData.logoFile ? URL.createObjectURL(formData.logoFile) : "/universityeslogos/placeholder.png",
        country: formData.country || "",
        city: formData.city || "",
        website: formData.website || "",
        qsRanking: formData.qsRanking ? Number(formData.qsRanking) : null,
        featured: !!formData.featured,
        partnered: !!formData.partnered,
        studentsPlaced: formData.studentsPlaced ? Number(formData.studentsPlaced) : 0,
        status: "Active",
      };

      setUniversities((prev) => [...prev, newUni]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedUniversity) {
      setUniversities((prev) =>
        prev.map((uni) =>
          uni.id === selectedUniversity.id
            ? {
                ...uni,
                name: formData.name || uni.name,
                country: formData.country || uni.country,
                city: formData.city || uni.city,
                website: formData.website || uni.website,
                qsRanking: formData.qsRanking ? Number(formData.qsRanking) : uni.qsRanking,
                featured: !!formData.featured,
                partnered: !!formData.partnered,
                studentsPlaced: formData.studentsPlaced ? Number(formData.studentsPlaced) : uni.studentsPlaced,
                // logo handling can be improved later if needed
              }
            : uni
        )
      );
    }

    setMode(null);
    setSelectedUniversity(null);
  };

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading universities...
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
              ? "Add New University"
              : mode === "edit"
              ? "Edit University"
              : mode === "view"
              ? "University Details"
              : "Universities Management"
          }
          counselorName="Imran"
          btnName={isFormOpen ? "Close" : "+ Add University"}
          onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 relative">
          {/* Backdrop for form modal */}
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
                      {mode === "add" ? "Add New University" : mode === "edit" ? "Edit University" : "University Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <AddUniversityForm
                      mode={mode}
                      initialData={selectedUniversity}
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
                University added successfully!
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
                placeholder="Search by name or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 w-16">Logo</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[160px]">Name</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Country</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">City</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Website</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">QS Ranking</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Featured</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Students Placed</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((uni) => (
                      <motion.tr key={uni.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <img
                              src={uni.logo}
                              alt={`${uni.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=Logo")}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{uni.name}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{uni.country}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{uni.city}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden lg:table-cell">
                          <a
                            href={`https://${uni.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline hover:text-sky-800 transition-colors"
                          >
                            {uni.website}
                          </a>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-center font-medium">
                          {uni.qsRanking || "—"}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              uni.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {uni.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-center font-medium">
                          {uni.studentsPlaced}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium whitespace-nowrap">
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => openEdit(uni)}
                              className="text-sky-600 hover:text-sky-800 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteConfirm(uni)}
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

            {filtered.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
                No universities found matching your search.
              </motion.p>
            )}
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete University"
                message={`Are you sure you want to delete ${universityToDelete?.name}? This action cannot be undone.`}
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