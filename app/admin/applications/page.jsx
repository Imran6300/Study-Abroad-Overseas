// app/admin/applications/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce"; // npm install use-debounce
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Animation variants (container level only)
import {containerVariants,itemVariants} from "@/components/Animations/formanimations/animate"


function ApplicationRow({ app }) {
  const stageStyles = {
    "Documents Pending": "bg-yellow-100 text-yellow-800",
    "Offer Received": "bg-green-100 text-green-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const badgeClass = stageStyles[app.stage] || "bg-blue-100 text-blue-800";

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
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
      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}
        >
          {app.stage}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
        {new Date(app.deadline).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
        {app.counselor}
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="text-sky-600 hover:text-sky-800">View</button>
          <button className="text-amber-600 hover:text-amber-800">Edit</button>
          <button className="text-red-600 hover:text-red-800">Delete</button>
        </div>
      </td>
    </tr>
  );
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    // ← In real app: replace with fetch('/api/applications') or similar
    const mockData = [
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
      // ... more items when testing
    ];

    setApplications(mockData);
    setLoading(false);
  }, []);

  const filteredApplications = useMemo(() => {
    if (!debouncedSearch?.trim()) return applications;

    const term = debouncedSearch.toLowerCase();
    return applications.filter((app) =>
      [app.id, app.studentName, app.email, app.university]
        .some((field) => field?.toLowerCase().includes(term))
    );
  }, [applications, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading applications…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Applications Management"
          counselorName="Imran"
          btnName="+ New Application"
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            {/* Search bar */}
            <motion.div variants={itemVariants} className="max-w-md">
              <input
                type="search"
                placeholder="Search by name, email, university or ID…"
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        ID
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">
                        Student
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[160px] hidden md:table-cell">
                        University
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[160px] hidden lg:table-cell">
                        Course
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[130px]">
                        Stage
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden sm:table-cell">
                        Deadline
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Counselor
                      </th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredApplications.map((app) => (
                      <ApplicationRow key={app.id} app={app} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredApplications.length === 0 && debouncedSearch && (
              <motion.p
                variants={itemVariants}
                className="text-center py-12 text-gray-500 text-base"
              >
                No applications found matching “{debouncedSearch}”
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}