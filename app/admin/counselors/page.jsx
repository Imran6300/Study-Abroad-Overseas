// app/admin/counselors/page.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "use-debounce"; // npm install use-debounce
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Animation variants – only container level
import {containerVariants,itemVariants} from "@/components/Animations/formanimations/animate"


function CounselorRow({ counselor }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
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
      <td className="px-6 py-4 whitespace-nowrap">
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
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
        <button className="text-sky-600 hover:text-sky-800 mr-4">View</button>
        <button className="text-amber-600 hover:text-amber-800 mr-4">Edit</button>
        <button className="text-red-600 hover:text-red-800">Delete</button>
      </td>
    </tr>
  );
}

export default function CounselorsAdminPage() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 320);

  useEffect(() => {
    // Replace with real API later → e.g. fetch("/api/counselors")
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
      // ... add 50–100 more entries when testing scroll & filter perf
    ];

    setCounselors(mockCounselors);
    setLoading(false);
  }, []);

  const filteredCounselors = useMemo(() => {
    if (!debouncedSearch?.trim()) return counselors;

    const term = debouncedSearch.toLowerCase();
    return counselors.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.specialization.toLowerCase().includes(term)
    );
  }, [counselors, debouncedSearch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading counselors…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          title="Counselors Management"
          counselorName="Imran"
          btnName="+ Add New Counselor"
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="max-w-md">
              <input
                type="search"
                placeholder="Search by name, email or specialization…"
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
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Specialization
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-center">
                        Assigned Students
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 text-center">
                        Success Rate
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCounselors.map((counselor) => (
                      <CounselorRow key={counselor.id} counselor={counselor} />
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCounselors.length === 0 && debouncedSearch && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-12 text-gray-500 text-lg"
              >
                No counselors found matching “{debouncedSearch}”
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}