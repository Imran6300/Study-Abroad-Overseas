"use client";

// app/dashboard/counselor-dashboard/students/page.jsx
// Updates from previous version:
//   1. ExportButtons (CSV + PDF) added to header row
//   2. Deposit status badge column added to table
//   3. Offer letter indicator in table
//   4. All existing bugs remain fixed

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import CounselorSidebar from "@/components/counselordashboard/CounselorSidebar";
import CounselorAddStudentModal from "@/components/counselordashboard/CounselorAddStudentModal";
import ExportButtons from "@/components/counselordashboard/ExportButtons";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { useDispatch, useSelector } from "react-redux";
import { fetchCounselorStudents } from "@/store/counselorSlice";
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

const STATUS_STYLES = {
  enrolled: "bg-green-100 text-green-700",
  visa_process: "bg-violet-100 text-violet-700",
  offer_received: "bg-blue-100 text-blue-700",
  application_submitted: "bg-amber-100 text-amber-700",
  application_started: "bg-indigo-100 text-indigo-700",
  lost: "bg-red-100 text-red-700",
};

export default function StudentsAdminPage() {
  const dispatch = useDispatch();
  const { students, loadingStudents } = useSelector((s) => s.counselor);
  const router = useRouter();
  const { user } = useSelector((s) => s.auth);

  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const isFormOpen = mode !== null;

  useEffect(() => {
    dispatch(fetchCounselorStudents());
  }, [dispatch]);

  const deleteStudent = async (leadId) => {
    try {
      setDeleting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${leadId}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error("Delete failed");
      dispatch(fetchCounselorStudents());
    } catch (err) {
      console.error("[deleteStudent]", err);
    } finally {
      setDeleting(false);
      setShowConfirmDelete(false);
      setStudentToDelete(null);
    }
  };

  const filteredStudents = (students || []).filter((s) => {
    if (!s) return false;
    const term = search.toLowerCase();
    if (!term) return true;
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50">
          <CounselorAddStudentModal
            open={mode === "add"}
            onClose={() => setMode(null)}
            onCreated={() => {
              dispatch(fetchCounselorStudents());
              setJustAdded(true);
              setTimeout(() => setJustAdded(false), 3000);
            }}
          />

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
            {/* ── Header row: search + Export + Add ─────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <input
                type="text"
                placeholder="Search by name, email, phone or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {/* Export CSV / PDF */}
              <ExportButtons mode="counselor" />

              <button
                onClick={() => setMode("add")}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-[#020617] px-5 py-2.5 rounded-xl font-bold whitespace-nowrap"
              >
                + Add Student
              </button>
            </div>

            {/* ── Table ─────────────────────────────────────────────────── */}
            <motion.div
              className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
              variants={itemVariants}
            >
              <div className="overflow-x-auto">
                {loadingStudents ? (
                  <div className="p-10 text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-500">
                        Loading students...
                      </p>
                    </div>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 text-lg">
                    {search
                      ? "No students match your search."
                      : "No students assigned yet."}
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
                          Country
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Stage
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden lg:table-cell">
                          Deposit
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden lg:table-cell">
                          Offer
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
                            {student.target || "—"}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[student.status] || "bg-gray-100 text-gray-700"}`}
                            >
                              {student.status
                                ?.replace(/_/g, " ")
                                ?.replace(/\b\w/g, (c) => c.toUpperCase()) ||
                                "—"}
                            </span>
                          </td>

                          {/* Deposit badge */}
                          <td className="px-4 py-3 sm:px-6 sm:py-4 hidden lg:table-cell">
                            {student.deposit?.paid ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                                ✓ Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-full bg-gray-50 text-gray-400 border border-gray-200">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Offer letter badge */}
                          <td className="px-4 py-3 sm:px-6 sm:py-4 hidden lg:table-cell">
                            {student.offerLetter?.path ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                📄 Uploaded
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400">
                                —
                              </span>
                            )}
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
                  await deleteStudent(
                    studentToDelete.leadId || studentToDelete.id,
                  );
                }}
                onCancel={() => {
                  setShowConfirmDelete(false);
                  setStudentToDelete(null);
                }}
                loading={deleting}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
