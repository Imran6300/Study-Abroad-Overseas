// app/admin/counselors/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "use-debounce";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddCounselorForm from "@/components/adminform/addcounselor";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { useSelector } from "react-redux";

// Animations (same as students page)
import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

function CounselorRow({ counselor, openView, openEdit, openDeleteConfirm }) {
  return (
    <motion.tr
      variants={itemVariants}
      className="hover:bg-gray-50 transition-colors duration-150"
    >
      <td className="px-6 py-4 font-medium text-gray-900">{counselor.name}</td>
      <td className="px-6 py-4 text-gray-600">{counselor.email}</td>
      <td className="px-6 py-4 text-gray-600">{counselor.phone}</td>
      <td className="px-6 py-4 text-gray-600">{counselor.specialization}</td>
      <td className="px-6 py-4 text-center font-medium text-gray-900">
        {counselor.assignedStudents}
      </td>
      <td className="px-6 py-4 text-center font-medium text-emerald-700">
        {counselor.successRate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
            counselor.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {counselor.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
        <button
          onClick={() => openView(counselor)}
          className="text-sky-600 hover:text-sky-800 mr-4"
        >
          View
        </button>
        <button
          onClick={() => openEdit(counselor)}
          className="text-amber-600 hover:text-amber-800 mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => openDeleteConfirm(counselor)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </td>
    </motion.tr>
  );
}

export default function CounselorsAdminPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 320);

  const [mode, setMode] = useState(null); // null | "add" | "edit" | "view"
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [counselorToDelete, setCounselorToDelete] = useState(null);
  const [justAdded, setJustAdded] = useState(false);

  const isFormOpen = mode !== null;

  useEffect(() => {
    // Mock data (replace with real API later)
    const mockCounselors = [
      {
        id: 1,
        name: "Sara Ahmed",
        email: "sara@overseas.com",
        phone: "+91 98765 12345",
        specialization: "Canada, UK",
        assignedStudents: 28,
        successRate: "94%",
        status: "Active",
        lastActive: "2026-01-29",
      },
      {
        id: 2,
        name: "John Mathew",
        email: "john@overseas.com",
        phone: "+91 87654 98765",
        specialization: "Australia, USA",
        assignedStudents: 35,
        successRate: "89%",
        status: "Active",
        lastActive: "2026-01-28",
      },
      {
        id: 3,
        name: "Aisha Khan",
        email: "aisha@overseas.com",
        phone: "+91 76543 21098",
        specialization: "Germany, Ireland",
        assignedStudents: 19,
        successRate: "92%",
        status: "Active",
        lastActive: "2026-01-25",
      },
    ];

    setCounselors(mockCounselors);
    setLoading(false);
  }, []);

  // Handlers — same logic as students page
  const openAdd = () => {
    setSelectedCounselor(null);
    setMode("add");
  };

  const openView = (counselor) => {
    setSelectedCounselor(counselor);
    setMode("view");
  };

  const openEdit = (counselor) => {
    setSelectedCounselor(counselor);
    setMode("edit");
  };

  const openDeleteConfirm = (counselor) => {
    setCounselorToDelete(counselor);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setCounselors((prev) => prev.filter((c) => c.id !== counselorToDelete.id));
    setShowConfirmDelete(false);
    setCounselorToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newCounselor = {
        id: Date.now(),
        name: formData.fullName || "Unknown",
        email: formData.email || "",
        phone: formData.mobile || "",
        whatsapp: formData.whatsapp || "",
        specialization: formData.specialization || "",
        assignedStudents: 0,
        successRate: "0%",
        status: formData.status || "Active",
        lastActive: new Date().toISOString().split("T")[0],
      };
      setCounselors((prev) => [...prev, newCounselor]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedCounselor) {
      setCounselors((prev) =>
        prev.map((c) =>
          c.id === selectedCounselor.id
            ? {
                ...c,
                name: formData.fullName || c.name,
                email: formData.email || c.email,
                phone: formData.mobile || c.phone,
                whatsapp: formData.whatsapp || c.whatsapp,
                specialization: formData.specialization || c.specialization,
                status: formData.status || c.status,
              }
            : c,
        ),
      );
    }

    // Close form/modal
    setMode(null);
    setSelectedCounselor(null);
  };

  const filteredCounselors = useMemo(() => {
    if (!debouncedSearch?.trim()) return counselors;

    const term = debouncedSearch.toLowerCase();
    return counselors.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.specialization.toLowerCase().includes(term),
    );
  }, [counselors, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading counselors…
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
              ? "Add New Counselor"
              : mode === "edit"
                ? "Edit Counselor"
                : mode === "view"
                  ? "View Counselor"
                  : "Counselors Management"
          }
          counselorName={CounselorName}
          btnName={isFormOpen ? "Close" : "+ Add New Counselor"}
          onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 relative">
          {/* Backdrop when form is open */}
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
                        ? "Add New Counselor"
                        : mode === "edit"
                          ? "Edit Counselor"
                          : "Counselor Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <AddCounselorForm
                      mode={mode}
                      initialData={selectedCounselor}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setMode(null)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success toast after add */}
          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Counselor added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counselors List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="max-w-md">
              <input
                type="search"
                placeholder="Search by name, email or specialization…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm transition-all duration-200"
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Specialization
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-center">
                        Assigned Students
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-center">
                        Success Rate
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCounselors.map((counselor) => (
                      <CounselorRow
                        key={counselor.id}
                        counselor={counselor}
                        openView={openView}
                        openEdit={openEdit}
                        openDeleteConfirm={openDeleteConfirm}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCounselors.length === 0 && debouncedSearch && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-12 text-gray-500 text-lg"
              >
                No counselors found matching “{debouncedSearch}”
              </motion.p>
            )}
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Counselor"
                message={`Are you sure you want to delete ${counselorToDelete?.name}? This cannot be undone.`}
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
