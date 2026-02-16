// app/admin/deadlines/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDebounce } from "use-debounce";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import ConfirmationModal from "@/components/adminform/confirmmsg";

// New form component
import DeadlineForm from "@/components/adminform/adddeadline";
import { useSelector } from "react-redux";

// Animations
import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

function DeadlineRow({ deadline, onView, onEdit, onMarkDone, onDelete }) {
  const getUrgencyClass = (days, status) => {
    if (status === "Done") return "bg-green-100 text-green-800";
    if (days < 0) return "bg-red-100 text-red-800 font-bold";
    if (days <= 3) return "bg-orange-100 text-orange-800 font-bold";
    if (days <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const daysText =
    deadline.daysLeft < 0
      ? `${Math.abs(deadline.daysLeft)} days overdue`
      : `${deadline.daysLeft} days left`;

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
        {deadline.studentName}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
        {deadline.type}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600">
        {new Date(deadline.deadlineDate).toLocaleDateString("en-IN")}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getUrgencyClass(deadline.daysLeft, deadline.status)}`}
        >
          {deadline.status === "Done" ? "Done" : daysText}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
        {deadline.university}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
        {deadline.counselor}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={() => onView(deadline)}
            className="text-sky-600 hover:text-sky-800"
          >
            View
          </button>
          <button
            onClick={() => onEdit(deadline)}
            className="text-amber-600 hover:text-amber-800"
          >
            Edit
          </button>
          {deadline.status !== "Done" && (
            <button
              onClick={() => onMarkDone(deadline)}
              className="text-emerald-600 hover:text-emerald-800"
            >
              Mark Done
            </button>
          )}
          <button
            onClick={() => onDelete(deadline)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function DeadlinesPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  // Modal states
  const [mode, setMode] = useState(null); // null | "add" | "view" | "edit"
  const [selectedDeadline, setSelectedDeadline] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deadlineToDelete, setDeadlineToDelete] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  const isFormOpen = mode !== null;

  useEffect(() => {
    // Mock data
    const mockDeadlines = [
      {
        id: "DL-001",
        studentName: "Ahmed Khan",
        type: "University Application",
        deadlineDate: "2026-02-15",
        daysLeft: 3,
        university: "University of Toronto",
        country: "Canada",
        counselor: "Sara Ahmed",
        status: "Pending",
      },
      {
        id: "DL-002",
        studentName: "Priya Sharma",
        type: "Visa Biometrics",
        deadlineDate: "2026-01-28",
        daysLeft: -2,
        university: "University of Melbourne",
        country: "Australia",
        counselor: "John Mathew",
        status: "Overdue",
      },
      {
        id: "DL-003",
        studentName: "Rahul Verma",
        type: "Fee Payment",
        deadlineDate: "2026-03-10",
        daysLeft: 25,
        university: "University College London",
        country: "UK",
        counselor: "Aisha Khan",
        status: "Pending",
      },
    ];
    setDeadlines(mockDeadlines);
    setLoading(false);
  }, []);

  // Handlers
  const openAdd = () => {
    setSelectedDeadline(null);
    setMode("add");
  };

  const openView = (deadline) => {
    setSelectedDeadline(deadline);
    setMode("view");
  };

  const openEdit = (deadline) => {
    setSelectedDeadline(deadline);
    setMode("edit");
  };

  const openDeleteConfirm = (deadline) => {
    setDeadlineToDelete(deadline);
    setShowConfirmDelete(true);
  };

  const handleMarkDone = (deadline) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === deadline.id ? { ...d, status: "Done", daysLeft: 0 } : d,
      ),
    );
  };

  const handleDeleteConfirmed = () => {
    setDeadlines((prev) => prev.filter((d) => d.id !== deadlineToDelete.id));
    setShowConfirmDelete(false);
    setDeadlineToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newDeadline = {
        id: `DL-${String(Date.now()).slice(-4)}`,
        studentName: formData.studentName || "Unknown",
        type: formData.type || "Reminder",
        deadlineDate:
          formData.deadlineDate || new Date().toISOString().split("T")[0],
        daysLeft: formData.daysLeft || 0,
        university: formData.university || "",
        country: formData.country || "",
        counselor: formData.counselor || "Unassigned",
        status: formData.status || "Pending",
      };
      setDeadlines((prev) => [...prev, newDeadline]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedDeadline) {
      setDeadlines((prev) =>
        prev.map((d) =>
          d.id === selectedDeadline.id
            ? {
                ...d,
                studentName: formData.studentName || d.studentName,
                type: formData.type || d.type,
                deadlineDate: formData.deadlineDate || d.deadlineDate,
                university: formData.university || d.university,
                country: formData.country || d.country,
                counselor: formData.counselor || d.counselor,
                status: formData.status || d.status, // ← updates status!
              }
            : d,
        ),
      );
    }

    setMode(null);
    setSelectedDeadline(null);
  };

  const filteredDeadlines = useMemo(() => {
    if (!debouncedSearch.trim()) return deadlines;
    const term = debouncedSearch.toLowerCase();
    return deadlines.filter(
      (d) =>
        d.studentName.toLowerCase().includes(term) ||
        d.university.toLowerCase().includes(term) ||
        d.type.toLowerCase().includes(term),
    );
  }, [deadlines, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading deadlines...
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
              ? "Add New Reminder"
              : mode === "edit"
                ? "Edit Deadline"
                : mode === "view"
                  ? "Deadline Details"
                  : "Deadlines & Follow-ups"
          }
          counselorName={CounselorName}
          btnName={isFormOpen ? "Close" : "+ Add Reminder"}
          onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50 relative">
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
                        ? "Add New Reminder"
                        : mode === "edit"
                          ? "Edit Deadline"
                          : "Deadline Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <DeadlineForm
                      mode={mode}
                      initialData={selectedDeadline}
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
                Reminder added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search + Table */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-6 sm:space-y-8 transition-opacity ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            <motion.div variants={itemVariants} className="max-w-md">
              <input
                type="search"
                placeholder="Search by student or university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Student
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">
                        Type
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Deadline
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Days Left
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        University
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Counselor
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDeadlines.map((deadline) => (
                      <DeadlineRow
                        key={deadline.id}
                        deadline={deadline}
                        onView={openView}
                        onEdit={openEdit}
                        onMarkDone={handleMarkDone}
                        onDelete={openDeleteConfirm}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredDeadlines.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center py-12 text-gray-500"
              >
                {debouncedSearch
                  ? `No deadlines found matching “${debouncedSearch}”`
                  : "No deadlines yet."}
              </motion.p>
            )}
          </motion.div>

          {/* Delete modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Deadline"
                message={`Are you sure you want to delete this deadline for ${deadlineToDelete?.studentName}?`}
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
