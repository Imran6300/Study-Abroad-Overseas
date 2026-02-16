// app/admin/visa/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDebounce } from "use-debounce";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ConfirmationModal from "@/components/adminform/confirmmsg";

import { useSelector } from "react-redux";

// New form component (we'll create below)
import VisaCaseForm from "@/components/adminform/addvisa";

// Animations
import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

function VisaRow({ visa, onView, onEdit, onDelete }) {
  const statusStyles = {
    "Under Review": "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    "Refused / Rejected": "bg-red-100 text-red-800",
    "Additional Documents Requested": "bg-orange-100 text-orange-800",
    Withdrawn: "bg-gray-100 text-gray-800",
  };

  const badgeClass = statusStyles[visa.status] || "bg-blue-100 text-blue-800";

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
        {visa.id}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
        {visa.studentName}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
        {visa.passportNo}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
        {visa.country}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
        {visa.visaType}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}
        >
          {visa.status}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
        {visa.expectedDecision
          ? new Date(visa.expectedDecision).toLocaleDateString("en-IN")
          : "—"}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
        {visa.counselor}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => onView(visa)}
            className="text-sky-600 hover:text-sky-800"
          >
            View
          </button>
          <button
            onClick={() => onEdit(visa)}
            className="text-amber-600 hover:text-amber-800"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(visa)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function VisaTrackingPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [visaCases, setVisaCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  // Modal & form states
  const [mode, setMode] = useState(null); // null | "add" | "view" | "edit"
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [visaToDelete, setVisaToDelete] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  const isFormOpen = mode !== null;

  useEffect(() => {
    // Mock data – replace with real API fetch later
    const mockData = [
      {
        id: "VISA-001",
        studentName: "Ahmed Khan",
        passportNo: "J12345678",
        country: "Canada",
        visaType: "Study Permit",
        status: "Under Review",
        submissionDate: "2026-01-15",
        expectedDecision: "2026-03-15",
        counselor: "Sara Ahmed",
      },
      {
        id: "VISA-002",
        studentName: "Priya Sharma",
        passportNo: "K87654321",
        country: "Australia",
        visaType: "Student Visa (Subclass 500)",
        status: "Approved",
        submissionDate: "2025-12-20",
        expectedDecision: "2026-02-10",
        counselor: "John Mathew",
      },
    ];
    setVisaCases(mockData);
    setLoading(false);
  }, []);

  // Handlers
  const openAdd = () => {
    setSelectedVisa(null);
    setMode("add");
  };

  const openView = (visa) => {
    setSelectedVisa(visa);
    setMode("view");
  };

  const openEdit = (visa) => {
    setSelectedVisa(visa);
    setMode("edit");
  };

  const openDeleteConfirm = (visa) => {
    setVisaToDelete(visa);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setVisaCases((prev) => prev.filter((v) => v.id !== visaToDelete.id));
    setShowConfirmDelete(false);
    setVisaToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newVisa = {
        id: `VISA-${String(Date.now()).slice(-4)}`,
        studentName: formData.studentName || "Unknown",
        passportNo: formData.passportNo || "",
        country: formData.country || "",
        visaType: formData.visaType || "",
        status: formData.status || "Under Review",
        submissionDate: new Date().toISOString().split("T")[0],
        expectedDecision: formData.expectedDecision || "",
        counselor: formData.counselor || "Unassigned",
      };
      setVisaCases((prev) => [...prev, newVisa]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedVisa) {
      setVisaCases((prev) =>
        prev.map((v) =>
          v.id === selectedVisa.id
            ? {
                ...v,
                studentName: formData.studentName || v.studentName,
                passportNo: formData.passportNo || v.passportNo,
                country: formData.country || v.country,
                visaType: formData.visaType || v.visaType,
                status: formData.status || v.status, // ← updates visa status!
                expectedDecision:
                  formData.expectedDecision || v.expectedDecision,
                counselor: formData.counselor || v.counselor,
              }
            : v,
        ),
      );
    }

    setMode(null);
    setSelectedVisa(null);
  };

  const filteredCases = useMemo(() => {
    if (!debouncedSearch.trim()) return visaCases;
    const term = debouncedSearch.toLowerCase();
    return visaCases.filter(
      (v) =>
        v.studentName.toLowerCase().includes(term) ||
        v.passportNo.toLowerCase().includes(term) ||
        v.country.toLowerCase().includes(term),
    );
  }, [visaCases, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading visa cases…
        </p>
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
              ? "Add New Visa Case"
              : mode === "edit"
                ? "Update Visa Case"
                : mode === "view"
                  ? "Visa Case Details"
                  : "Visa Tracking"
          }
          counselorName={CounselorName}
          btnName={isFormOpen ? "Close" : "+ New Visa Case"}
          onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50 relative">
          {/* Backdrop when modal open */}
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
                        ? "Add New Visa Case"
                        : mode === "edit"
                          ? "Update Visa Case"
                          : "Visa Case Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <VisaCaseForm
                      mode={mode}
                      initialData={selectedVisa}
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
                Visa case added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search + Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-6 sm:space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            <motion.div variants={itemVariants} className="max-w-md">
              <input
                type="search"
                placeholder="Search by name, passport or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        ID
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">
                        Student
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Passport No
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        Country
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Visa Type
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        Expected Decision
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Counselor
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map((visa) => (
                      <VisaRow
                        key={visa.id}
                        visa={visa}
                        onView={openView}
                        onEdit={openEdit}
                        onDelete={openDeleteConfirm}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCases.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center py-12 text-gray-500"
              >
                {debouncedSearch
                  ? `No visa cases found matching “${debouncedSearch}”`
                  : "No visa cases yet."}
              </motion.p>
            )}
          </motion.div>

          {/* Delete confirmation */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Visa Case"
                message={`Are you sure you want to delete visa case ${visaToDelete?.id} (${visaToDelete?.studentName})? This cannot be undone.`}
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
