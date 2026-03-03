"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddStudentForm from "@/components/adminform/addstudents";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

const STATUS_OPTIONS = ["Lead", "Applied", "Enrolled", "Closed"];

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
        const data = await res.json();

        const formatted = data.leads.map((lead) => ({
          id: lead._id,
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

  const deleteStudent = async (id) => {
    try {
      setDeleting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${id}`,
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

      setStudents((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

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

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ counselorStage: newStatus }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update status");
        return;
      }

      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
      );
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

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
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title={
            mode === "add"
              ? "Add New Student"
              : mode === "edit"
                ? "Edit Student"
                : mode === "view"
                  ? "View Student"
                  : "Student Management"
          }
          counselorName={CounselorName}
          onButtonClick={
            isFormOpen ? () => setMode(null) : () => setMode("add")
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50">
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
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mx-1 sm:mx-0"
              variants={itemVariants}
            >
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                    Loading students...
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
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
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Contacted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredStudents.map((student) => (
                        <motion.tr
                          key={student.id}
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
                                  : student.status === "applied"
                                    ? "bg-blue-100 text-blue-700"
                                    : student.status === "qualified"
                                      ? "bg-purple-100 text-purple-700"
                                      : student.status === "contacted"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : student.status === "lost"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {capitalize(student.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <button
                                onClick={() =>
                                  router.push(`/admin/students/${student.id}`)
                                }
                                className="text-sky-600 hover:text-sky-800 text-sm"
                              >
                                View
                              </button>
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
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                            <label className="inline-flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={student.status === "contacted"}
                                onChange={() => {
                                  const newStatus =
                                    student.status === "contacted"
                                      ? "lead"
                                      : "contacted";
                                  updateStatus(student.id, newStatus);
                                }}
                              />
                              <div
                                className={`
                                  relative w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 
                                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-100 
                                  rounded-full peer transition-colors
                                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                                  after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all 
                                  peer-checked:bg-emerald-500
                                  group-hover:bg-gray-300 peer-checked:group-hover:bg-emerald-600
                                `}
                              />
                            </label>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>

            {!loading && filteredStudents.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-10 sm:mt-12 text-gray-500 text-base sm:text-lg px-4"
              >
                No students found matching your search.
              </motion.p>
            )}
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

                  const success = await deleteStudent(studentToDelete.id);

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
