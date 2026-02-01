// app/admin/students/page.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddStudentForm from "@/components/adminform/students";
import ConfirmationModal from "@/components/adminform/confirmmsg";

//animations

import {containerVariants,itemVariants,formVariants} from "@/components/Animations/formanimations/animate"

// Animation variants


export default function StudentsAdminPage() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      phone: "+91 98765 43210",
      origin: "India",
      target: "Canada",
      status: "Applied",
      counselor: "Sara",
      created: "2025-11-15",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "+91 87654 32109",
      origin: "India",
      target: "UK",
      status: "Enrolled",
      counselor: "John",
      created: "2025-10-20",
    },
  ]);

  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // Modal control states
  const [mode, setMode] = useState(null);           // ← fixed line
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const isFormOpen = mode !== null;

  // ─── Handlers ───
  const openAdd = () => {
    setSelectedStudent(null);
    setMode("add");
  };

  const openView = (student) => {
    setSelectedStudent(student);
    setMode("view");
  };

  const openEdit = (student) => {
    setSelectedStudent(student);
    setMode("edit");
  };

  const openDeleteConfirm = (student) => {
    setStudentToDelete(student);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
    setShowConfirmDelete(false);
    setStudentToDelete(null);
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newStudent = {
        id: Date.now(),
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
    } else if (mode === "edit" && selectedStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id
            ? {
                ...s,
                name: formData.fullName || s.name,
                email: formData.email || s.email,
                phone: formData.mobile || s.phone,
                target: formData.preferredCountries?.[0] || s.target,
                status: formData.currentStatus || s.status,
                counselor: formData.assignedCounselor || s.counselor,
              }
            : s
        )
      );
    }

    // Close modal/form
    setMode(null);
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
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
          counselorName="Imran"
          btnName={isFormOpen ? "Close" : "+ Add New Student"}
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

                  <div className="p-6 lg:p-10">
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
                className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Student added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Student List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="mb-6">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Target Country</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <motion.tr
                        key={student.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 text-gray-600">{student.email}</td>
                        <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                        <td className="px-6 py-4 text-gray-600">{student.target}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              student.status === "Enrolled"
                                ? "bg-green-100 text-green-800"
                                : student.status === "Applied"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <button
                            onClick={() => openView(student)}
                            className="text-sky-600 hover:text-sky-800 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEdit(student)}
                            className="text-amber-600 hover:text-amber-800 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(student)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredStudents.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-12 text-gray-500 text-lg">
                No students found.
              </motion.p>
            )}
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Student"
                message={`Are you sure you want to delete ${studentToDelete?.name}? This cannot be undone.`}
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