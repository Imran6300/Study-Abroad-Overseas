// app/admin/applications/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Animation variants (unchanged)
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

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock data
    const mockApplications = [
      {
        id: "APP-001",
        studentName: "Ahmed Khan",
        email: "ahmed@example.com",
        university: "University of Toronto",
        course: "Computer Science - MSc",
        stage: "Documents Pending",
        submittedDate: "2026-01-10",
        deadline: "2026-02-15",
        counselor: "Sara Ahmed",
        documentsStatus: "Incomplete (4/7)",
      },
      {
        id: "APP-002",
        studentName: "Priya Sharma",
        email: "priya.sharma@gmail.com",
        university: "University of Melbourne",
        course: "Master of Business Administration",
        stage: "Offer Received",
        submittedDate: "2025-12-05",
        deadline: "2026-03-01",
        counselor: "John Mathew",
        documentsStatus: "Complete",
      },
      // ... more entries
    ];
    setApplications(mockApplications);
    setLoading(false);
  }, []);

  const filteredApplications = applications.filter(
    (app) =>
      app.studentName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.university.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading applications...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Applications Management" counselorName="Imran" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            {/* Title + Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors whitespace-nowrap text-sm sm:text-base"
              >
                + New Application
              </motion.button>
            </motion.div>

            {/* Search */}
            <motion.div variants={itemVariants} className="mb-6">
              <input
                type="text"
                placeholder="Search by student, email or university..."
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
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        ID
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">
                        Student
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[160px] hidden md:table-cell">
                        University
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[160px] hidden lg:table-cell">
                        Course
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[130px]">
                        Stage
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden sm:table-cell">
                        Deadline
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Counselor
                      </th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplications.map((app) => (
                      <motion.tr
                        key={app.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                          {app.id}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
                          {app.studentName}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                          {app.university}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                          {app.course}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              app.stage.includes("Pending")
                                ? "bg-yellow-100 text-yellow-800"
                                : app.stage.includes("Offer") || app.stage.includes("Approved")
                                ? "bg-green-100 text-green-800"
                                : app.stage.includes("Rejected")
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {app.stage}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                          {new Date(app.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                          {app.counselor}
                        </td>
                        <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium">
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="text-sky-600 hover:text-sky-800">View</button>
                            <button className="text-amber-600 hover:text-amber-800">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredApplications.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-10 sm:mt-12 text-gray-500 text-base sm:text-lg"
              >
                No applications found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}