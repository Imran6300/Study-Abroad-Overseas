// app/admin/deadlines/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

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

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock data – replace with real fetch
    const mockDeadlines = [
      {
        id: "APP-001",
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
        id: "APP-002",
        studentName: "Priya Sharma",
        type: "Visa Biometrics",
        deadlineDate: "2026-01-28",
        daysLeft: -2, // overdue
        university: "University of Melbourne",
        country: "Australia",
        counselor: "John Mathew",
        status: "Overdue",
      },
      {
        id: "APP-003",
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

  const filteredDeadlines = deadlines.filter(
    (d) =>
      d.studentName.toLowerCase().includes(search.toLowerCase()) ||
      d.university.toLowerCase().includes(search.toLowerCase())
  );

  const getUrgencyClass = (days) => {
    if (days < 0) return "bg-red-100 text-red-800 font-bold";
    if (days <= 3) return "bg-orange-100 text-orange-800 font-bold";
    if (days <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading deadlines...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Deadlines & Follow-ups" counselorName="Imran" btnName="+ Add Reminder"/>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
            {/* Search */}
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Search by student or university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Student</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">Type</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Deadline</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Days Left
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        University
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Counselor
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDeadlines.map((deadline) => (
                      <motion.tr key={deadline.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{deadline.studentName}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">{deadline.type}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">
                          {new Date(deadline.deadlineDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 sm:px-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getUrgencyClass(
                              deadline.daysLeft
                            )}`}
                          >
                            {deadline.daysLeft < 0
                              ? `${Math.abs(deadline.daysLeft)} days overdue`
                              : `${deadline.daysLeft} days left`}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                          {deadline.university}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                          {deadline.counselor}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="text-sky-600 hover:text-sky-800">View</button>
                            <button className="text-emerald-600 hover:text-emerald-800">Mark Done</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredDeadlines.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
                No upcoming or overdue deadlines found.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}