// app/admin/counselors/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Same animation variants as dashboard & students page
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

export default function CounselorsAdminPage() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Mock data — replace with real fetch later
  useEffect(() => {
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
      // Add more mock entries to test scrolling
    ];
    setCounselors(mockCounselors);
    setLoading(false);
  }, []);

  const filteredCounselors = counselors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-gray-600"
        >
          Loading counselors...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <DashboardHeader title="Counselors Management" counselorName="Imran" />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Title + Add Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors whitespace-nowrap"
              >
                + Add New Counselor
              </motion.button>
            </motion.div>

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
                        Specialization
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Assigned Students
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Success Rate
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCounselors.map((counselor) => (
                      <motion.tr
                        key={counselor.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 transition-colors"
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
                        <td className="px-6 py-4">
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
            {filteredCounselors.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-12 text-gray-500 text-lg"
              >
                No counselors found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}