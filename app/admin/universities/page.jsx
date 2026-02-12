"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddUniversityForm from "@/components/adminform/adduniversity"; // fixed case
import ConfirmationModal from "@/components/adminform/confirmmsg";

import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

// Simple debounce
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form / modal states
  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  // Delete confirmation
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  const isFormOpen = mode !== null;

  // Fetch all universities
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://overseas-backend-production-4f18.up.railway.app/host/show-university-data",
          { credentials: "include" },
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to load universities");
        }
        const data = await res.json();
        setUniversities(data.universities || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = debounce((val) => setDebouncedSearch(val), 400);
    handler(search);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // ─── Handlers ───
  const handleAdd = () => {
    setSelectedUniversity(null);
    setMode("add");
  };

  const handleEdit = (uni) => {
    setSelectedUniversity(uni);
    setMode("edit");
  };

  const handleDeleteClick = (uni) => {
    setUniversityToDelete(uni);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!universityToDelete?._id) return;

    const id = universityToDelete._id;
    const backup = [...universities];

    // Optimistic UI
    setUniversities((prev) => prev.filter((u) => u._id !== id));
    setShowConfirmDelete(false);
    setUniversityToDelete(null);
    setActionLoading(true);

    try {
      const res = await fetch(
        `https://overseas-backend-production-4f18.up.railway.app/host/show-university-data/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      // Rollback
      setUniversities(backup);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSuccess = (updatedUni) => {
    if (!updatedUni?._id) return;

    if (mode === "add") {
      setUniversities((prev) => [updatedUni, ...prev]);
    } else if (mode === "edit") {
      setUniversities((prev) =>
        prev.map((u) => (u._id === updatedUni._id ? updatedUni : u)),
      );
    }

    setMode(null);
    setSelectedUniversity(null);
  };

  // Filter & paginate
  const filtered = universities.filter(
    (u) =>
      u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.country?.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title={
            mode === "add"
              ? "Add New University"
              : mode === "edit"
                ? "Edit University"
                : "University Management"
          }
          counselorName="Imran"
          btnName={isFormOpen ? "Close Form" : "+ Add University"}
          onButtonClick={isFormOpen ? () => setMode(null) : handleAdd}
        />

        <main className="flex-1 p-5 sm:p-6 lg:p-8 overflow-auto relative">
          {/* Backdrop when form is open */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 pointer-events-none"
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
                className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-12 px-4 overflow-y-auto"
              >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200/80">
                  <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {mode === "add"
                        ? "Add New University"
                        : "Edit University"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={24} className="text-gray-700" />
                    </button>
                  </div>

                  <div className="p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
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

          {/* Main content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-6 ${isFormOpen ? "opacity-60 pointer-events-none" : ""}`}
          >
            {/* Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or country..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
              {error ? (
                <div className="p-10 text-center text-red-600 font-medium">
                  {error}
                </div>
              ) : paginated.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  {debouncedSearch
                    ? `No universities found for "${debouncedSearch}"`
                    : "No universities yet. Add one to get started!"}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 w-20">
                            Logo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 min-w-[140px]">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 hidden sm:table-cell">
                            Country
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 hidden md:table-cell">
                            City
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                            QS Rank
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                            Featured
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                            Placed
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginated.map((uni) => (
                          <motion.tr
                            key={uni._id}
                            variants={itemVariants}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <img
                                  src={
                                    uni.logo?.url ||
                                    "/placeholders/university.png"
                                  }
                                  alt={uni.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) =>
                                    (e.target.src =
                                      "https://via.placeholder.com/48?text=Uni")
                                  }
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {uni.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                              {uni.country}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                              {uni.city || "—"}
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                              {uni.qsRanking || "—"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                                  uni.featured
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {uni.featured ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                              {uni.studentsPlaced || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-4">
                                <button
                                  onClick={() => handleEdit(uni)}
                                  className="text-sky-600 hover:text-sky-800 flex items-center gap-1 transition"
                                  disabled={actionLoading}
                                >
                                  <Edit2 size={16} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(uni)}
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1 transition"
                                  disabled={actionLoading}
                                >
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4">
                      <div className="text-sm text-gray-600">
                        Showing {start + 1}–
                        {Math.min(start + ITEMS_PER_PAGE, filtered.length)} of{" "}
                        {filtered.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                          }
                          disabled={currentPage === 1 || actionLoading}
                          className="p-2 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-medium">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          disabled={currentPage === totalPages || actionLoading}
                          className="p-2 rounded border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete University"
                message={`Are you sure you want to delete "${universityToDelete?.name}"? This action cannot be undone.`}
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
