"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddUniversityForm from "@/components/adminform/adduniversity";
import ConfirmationModal from "@/components/adminform/confirmmsg";

import { useSelector } from "react-redux";

import {
  containerVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

// ─── Helpers ────────────────────────────────────────────────
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const getErrorMessage = (err) =>
  err?.message || "Something went wrong. Please try again.";

// ─── Main Component ─────────────────────────────────────────
export default function UniversitiesPage() {
  const { user } = useSelector((state) => state.auth);
  const counselorName = user?.name || "Admin";

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const ITEMS_PER_PAGE = 10;

  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [universityToDelete, setUniversityToDelete] = useState(null);

  const isFormOpen = mode !== null;

  // ─── Data Fetching ──────────────────────────────────────────
  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/show-university-data?all=true`;

      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to load universities");
      }

      const data = await res.json();
      setUniversities(data.universities || []);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error("Fetch universities failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  ``;

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // ─── Search Handling ────────────────────────────────────────
  useEffect(() => {
    const handler = debounce((value) => {
      const trimmed = value.trim();
      setDebouncedSearch(trimmed);
      setCurrentPage(1);
    }, 420);

    handler(search);
    return () => handler.cancel?.();
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setCurrentPage(1);
    }
  }, [debouncedSearch]);

  // ─── Sorting ────────────────────────────────────────────────
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedUniversities = useCallback(() => {
    if (!sortConfig.key) return universities;

    return [...universities].sort((a, b) => {
      const aVal = String(a[sortConfig.key] ?? "").toLowerCase();
      const bVal = String(b[sortConfig.key] ?? "").toLowerCase();
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [universities, sortConfig]);

  // ─── Filtering & Pagination ─────────────────────────────────
  const trimmedSearch = (debouncedSearch || "").trim().toLowerCase();

  const filteredUniversities = getSortedUniversities().filter((u) => {
    if (!trimmedSearch) return true;

    const term = trimmedSearch;
    return (
      (u.name || "").toLowerCase().includes(term) ||
      (u.country || "").toLowerCase().includes(term) ||
      (u.city || "").toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUniversities = filteredUniversities.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Auto-correct page if out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // ─── Handlers ───────────────────────────────────────────────
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
    const previousList = [...universities];

    setUniversities((prev) => prev.filter((u) => u._id !== id));
    setShowConfirmDelete(false);
    setUniversityToDelete(null);
    setActionLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/show-university-data/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Delete failed");
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setUniversities(previousList); // rollback
      console.error("Delete failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSuccess = (updatedUni) => {
    if (!updatedUni?._id) return;

    setUniversities((prev) => {
      if (mode === "add") return [updatedUni, ...prev];
      return prev.map((u) => (u._id === updatedUni._id ? updatedUni : u));
    });

    setMode(null);
    setSelectedUniversity(null);
  };

  const clearSearch = () => setSearch("");

  const getSortIcon = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? " ↑"
        : " ↓"
      : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-sky-600 animate-spin" />
          <p className="text-gray-700 font-medium">Loading universities...</p>
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
          counselorName={counselorName}
          btnName={isFormOpen ? "Close Form" : "+ Add University"}
          onButtonClick={isFormOpen ? () => setMode(null) : handleAdd}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-12 px-4 overflow-y-auto"
              >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200/70">
                  <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-indigo-50 border-b flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {mode === "add"
                        ? "Add New University"
                        : "Edit University"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="p-2 rounded-full hover:bg-gray-200/80 transition"
                    >
                      <X size={26} className="text-gray-700" />
                    </button>
                  </div>

                  <div className="p-6 lg:p-8 max-h-[82vh] overflow-y-auto">
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-6 ${isFormOpen ? "opacity-60 pointer-events-none" : ""}`}
          >
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search name, country, city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Table + states */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {error ? (
                <div className="p-10 text-center">
                  <AlertCircle
                    className="mx-auto text-red-500 mb-3"
                    size={40}
                  />
                  <p className="text-red-600 font-medium">{error}</p>
                  <button
                    onClick={fetchUniversities}
                    className="mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredUniversities.length === 0 ? (
                <div className="p-12 text-center text-gray-500 min-h-[240px] flex flex-col items-center justify-center">
                  {debouncedSearch ? (
                    <>
                      <p className="text-lg font-medium">No matches found</p>
                      <p className="mt-2">for "{debouncedSearch}"</p>
                      <button
                        onClick={clearSearch}
                        className="mt-4 text-sky-600 hover:text-sky-800 underline"
                      >
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-medium">No universities yet</p>
                      <p className="mt-2">
                        Click "+ Add University" to get started
                      </p>
                    </>
                  )}
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
                          <th
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 min-w-[160px]"
                            onClick={() => requestSort("name")}
                          >
                            Name {getSortIcon("name")}
                          </th>
                          <th
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 hidden sm:table-cell"
                            onClick={() => requestSort("country")}
                          >
                            Country {getSortIcon("country")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 hidden md:table-cell">
                            City
                          </th>
                          <th
                            className="px-4 py-3 text-center text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => requestSort("qsRanking")}
                          >
                            QS Rank {getSortIcon("qsRanking")}
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
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedUniversities.map((uni) => (
                          <tr
                            key={uni._id}
                            className="hover:bg-gray-50 transition-colors h-20 align-middle"
                          >
                            <td className="px-4 py-4">
                              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <img
                                  src={
                                    uni.logo?.url ||
                                    "/placeholders/university.png"
                                  }
                                  alt={uni.name || "University"}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/64?text=No+Logo";
                                    e.target.onerror = null;
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              {uni.name || "—"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 hidden sm:table-cell">
                              {uni.country || "—"}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                              {uni.city || "—"}
                            </td>
                            <td className="px-4 py-4 text-center text-sm">
                              {uni.qsRanking ?? "—"}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                                  uni.featured
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {uni.featured ? "Yes" : "No"}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center text-sm">
                              {uni.studentsPlaced ?? "—"}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <div className="flex items-center gap-6">
                                <button
                                  onClick={() => handleEdit(uni)}
                                  disabled={actionLoading}
                                  className="text-sky-600 hover:text-sky-800 disabled:opacity-50 transition flex items-center gap-1.5"
                                >
                                  <Edit2 size={16} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(uni)}
                                  disabled={actionLoading}
                                  className="text-red-600 hover:text-red-800 disabled:opacity-50 transition flex items-center gap-1.5"
                                >
                                  <Trash2 size={16} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination - always show when results exist */}
                  {filteredUniversities.length > 0 && (
                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4 text-sm text-gray-600">
                      <div>
                        Showing {startIndex + 1}–
                        {Math.min(
                          startIndex + ITEMS_PER_PAGE,
                          filteredUniversities.length,
                        )}{" "}
                        of {filteredUniversities.length}
                      </div>

                      {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1 || actionLoading}
                            className="p-2 rounded border disabled:opacity-40 hover:bg-gray-50 transition"
                          >
                            <ChevronLeft size={18} />
                          </button>

                          <span className="font-medium">
                            Page {currentPage} of {totalPages}
                          </span>

                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.min(p + 1, totalPages))
                            }
                            disabled={
                              currentPage === totalPages || actionLoading
                            }
                            className="p-2 rounded border disabled:opacity-40 hover:bg-gray-50 transition"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete University"
                message={`Are you sure you want to delete "${universityToDelete?.name ?? "this university"}"? This cannot be undone.`}
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
