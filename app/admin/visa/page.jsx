// app/admin/visa/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

//animation variants
import {containerVariants,itemVariants} from "@/components/Animations/formanimations/animate"

export default function VisaTrackingPage() {
  const [visaCases, setVisaCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock data – replace with real fetch later
    const mockData = [
      {
        id: "APP-001",
        studentName: "Ahmed Khan",
        passportNo: "J12345678",
        country: "Canada",
        visaType: "Study Permit",
        status: "Under Review",
        submissionDate: "2026-01-15",
        expectedDecision: "2026-03-15",
        counselor: "Sara Ahmed",
      },
      {
        id: "APP-002",
        studentName: "Priya Sharma",
        passportNo: "K87654321",
        country: "Australia",
        visaType: "Student Visa (Subclass 500)",
        status: "Approved",
        submissionDate: "2025-12-20",
        expectedDecision: "2026-02-10",
        counselor: "John Mathew",
      },
    ];
    setVisaCases(mockData);
    setLoading(false);
  }, []);

  const filteredCases = visaCases.filter(
    (v) =>
      v.studentName.toLowerCase().includes(search.toLowerCase()) ||
      v.passportNo.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading visa cases...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Visa Tracking" counselorName="Imran" btnName="+ New Visa Case" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">

            {/* Search */}
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Search by student name or passport number..."
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
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">ID</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">Student</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Passport No</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Country</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Visa Type</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Expected Decision</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Counselor</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCases.map((visa) => (
                      <motion.tr key={visa.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{visa.id}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">{visa.studentName}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">{visa.passportNo}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{visa.country}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{visa.visaType}</td>
                        <td className="px-4 py-3 sm:px-6">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              visa.status.includes("Under Review")
                                ? "bg-yellow-100 text-yellow-800"
                                : visa.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : visa.status.includes("Refused")
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {visa.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">
                          {new Date(visa.expectedDecision).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{visa.counselor}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="text-sky-600 hover:text-sky-800">View</button>
                            <button className="text-amber-600 hover:text-amber-800">Update</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCases.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
                No visa cases found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}