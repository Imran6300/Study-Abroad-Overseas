// app/admin/students/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Shared variants (same as your dashboard)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 17,
      duration: 0.5,
    },
  },
};

export default function StudentsAdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Mock data
  useEffect(() => {
    const mockStudents = [
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
      // add more rows for testing scroll
    ];
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-600"
        >
          Loading students...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader title="Student Management" counselorName="Imran" btnName="+ Add New Student" />

        {/* Scrollable main */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >

            {/* Search Bar */}
            <motion.div variants={itemVariants} className="mb-6">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow"
              />
            </motion.div>

            {/* Table Container */}
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

            {/* Empty state */}
            {filteredStudents.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-12 text-gray-500 text-lg"
              >
                No students found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}