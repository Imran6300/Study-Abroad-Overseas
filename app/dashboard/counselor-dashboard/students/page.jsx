"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import AddStudentForm from "@/components/adminform/addstudents";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

const STATUS_OPTIONS = [
  "application_started",
  "application_submitted",
  "offer_received",
  "visa_process",
  "enrolled",
  "lost",
];
export default function StudentsAdminPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [deleting, setDeleting] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const [mode, setMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const isFormOpen = mode !== null;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead`,
          { credentials: "include" },
        );

        console.log("STATUS:", res.status);

        const data = await res.json();

        console.log("API RESPONSE:", data);

        // SAFE CHECK
        const leadsArray = Array.isArray(data?.leads)
          ? data.leads
          : Array.isArray(data)
            ? data
            : [];

        const formatted = leadsArray.map((lead) => ({
          id: lead.user || null,
          leadId: lead._id,

          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          target: lead.preferredCountry,
          status: lead.counselorStage,
          counselor: lead.assignedCounselor || "Unassigned",
          created: new Date(lead.createdAt).toISOString().split("T")[0],
        }));

        setStudents(formatted);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const deleteStudent = async (leadId) => {
    try {
      setDeleting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${leadId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete student");
        return false;
      }

      setStudents((prev) => prev.filter((s) => s.leadId !== leadId));
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;

    return (
      (s.name || "").toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term) ||
      (s.phone || "").toLowerCase().includes(term) ||
      (s.status || "").toLowerCase().includes(term)
    );
  });

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newStudent = {
        id: formData.leadId,
        name: formData.fullName || "Unknown",
        email: formData.email || "",
        phone: formData.mobile || "",
        origin: "India",
        target: formData.preferredCountries?.[0] || "Not specified",
        status: formData.currentStatus || "Lead",
        counselor: formData.assignedCounselor || "Unassigned",
        created: new Date().toISOString().split("T")[0],
      };
      setStudents((prev) => [...prev, newStudent]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    }
    setMode(null);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col ">
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50">
          {/* Backdrop */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
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
                className="relative z-20 max-w-5xl mx-auto mb-10 sm:mb-12"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-5 sm:px-6 py-4 sm:py-5 border-b flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                      {mode === "add"
                        ? "Add New Student"
                        : mode === "edit"
                          ? "Edit Student"
                          : "Student Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 lg:p-10">
                    <AddStudentForm
                      mode={mode}
                      initialData={selectedStudent}
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
                className="mb-6 mx-2 sm:mx-0 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Student added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="mb-6 px-1 sm:px-0">
              <input
                type="text"
                placeholder="Search by name, email, phone or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* Table wrapper */}
            <motion.div
              className="w-full
    bg-white
    rounded-2xl
    shadow-sm
    overflow-hidden
    border border-gray-200"
              variants={itemVariants}
            >
              <div className="w-full overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                    Loading students...
                  </div>
                ) : students.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 text-lg">
                    No students found.
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 text-lg">
                    No students match your search.
                  </div>
                ) : (
                  <table className="w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden sm:table-cell">
                          Email
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Phone
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell">
                          Target Country
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredStudents.map((student) => (
                        <motion.tr
                          key={student.leadId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 hidden sm:table-cell">
                            {student.email}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                            {student.phone}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 hidden md:table-cell">
                            {student.target}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                                student.status === "enrolled"
                                  ? "bg-green-100 text-green-700"
                                  : student.status === "visa_process"
                                    ? "bg-violet-100 text-violet-700"
                                    : student.status === "offer_received"
                                      ? "bg-blue-100 text-blue-700"
                                      : student.status ===
                                          "application_submitted"
                                        ? "bg-amber-100 text-amber-700"
                                        : student.status ===
                                            "application_started"
                                          ? "bg-indigo-100 text-indigo-700"
                                          : student.status === "lost"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {student.status
                                ?.replace(/_/g, " ")
                                ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              {student.id && (
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/counselor-dashboard/students/${student.id}`,
                                    )
                                  }
                                  className="text-sky-600 hover:text-sky-800 text-sm"
                                >
                                  View
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setStudentToDelete(student);
                                  setShowConfirmDelete(true);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Student"
                message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                  if (!studentToDelete) return;

                  const success = await deleteStudent(studentToDelete.leadId);

                  if (success) {
                    setShowConfirmDelete(false);
                    setStudentToDelete(null);
                  }
                }}
                onCancel={() => setShowConfirmDelete(false)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
