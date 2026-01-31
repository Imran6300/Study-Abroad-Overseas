// app/admin/students/page.jsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddStudentForm from "@/components/adminform/students";

// Animation variants for the whole list
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 17, duration: 0.5 },
  },
};

// Beautiful animation for the Add Form section
const formVariants = {
  hidden: { opacity: 0, y: -60, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: -80,
    scale: 0.88,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export default function StudentsAdminPage() {
  const [showAddForm, setShowAddForm] = useState(false);
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

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = (newStudentData) => {
    const newStudent = {
      id: Date.now(),
      name: newStudentData.fullName || "Unknown",
      email: newStudentData.email || "",
      phone: newStudentData.mobile || "",
      origin: "India",
      target: newStudentData.preferredCountries?.[0] || "Not specified",
      status: "Lead",
      counselor: newStudentData.assignedCounselor || "Unassigned",
      created: new Date().toISOString().split("T")[0],
    };

    setStudents((prev) => [...prev, newStudent]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 3000);
    setShowAddForm(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader
          title={showAddForm ? "Add New Student" : "Student Management"}
          counselorName="Imran"
          btnName={showAddForm ? "Back to List" : "+ Add New Student"}
          onButtonClick={() => setShowAddForm(!showAddForm)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 relative">
          {/* Backdrop blur when form is open */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Add Form – beautiful entrance/exit */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-12 relative z-20 max-w-5xl mx-auto"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-5 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      Add New Student
                    </h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <AddStudentForm
                      onSuccess={handleAddStudent}
                      onCancel={() => setShowAddForm(false)}
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
                Student added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Students List – always present, just visually dimmed when form is open */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-8 transition-opacity duration-500 ${showAddForm ? "opacity-70" : "opacity-100"}`}
          >
            {/* Search Bar */}
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Target Country
                      </th>
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
                        <td className="px-6 py-4 text-sm font-medium">
                          <button className="text-sky-600 hover:text-sky-800 mr-4">View</button>
                          <button className="text-amber-600 hover:text-amber-800 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredStudents.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-12 text-gray-500 text-lg">
                No students found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}