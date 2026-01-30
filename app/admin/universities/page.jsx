// app/dashboard/universities/page.jsx
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

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock data with added logo URLs (real official ones)
    const mockData = [
      {
        id: 1,
        name: "University of Toronto",
        logo: "/universityeslogos/ethlogo.png", // official
        country: "Canada",
        city: "Toronto",
        website: "utoronto.ca",
        qsRanking: 25,
        featured: true,
        partnered: true,
        studentsPlaced: 42,
        status: "Active",
      },
      {
        id: 2,
        name: "University of Melbourne",
        logo: "/universityeslogos/mitlogo.png", // official
        country: "Australia",
        city: "Melbourne",
        website: "unimelb.edu.au",
        qsRanking: 14,
        featured: true,
        partnered: false,
        studentsPlaced: 31,
        status: "Active",
      },
      {
        id: 3,
        name: "Technical University of Munich",
        logo: "/universityeslogos/stanforduniversity.png", // official SVG
        country: "Germany",
        city: "Munich",
        website: "tum.de",
        qsRanking: 28,
        featured: false,
        partnered: true,
        studentsPlaced: 18,
        status: "Active",
      },
    ];
    setUniversities(mockData);
    setLoading(false);
  }, []);

  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.country.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading universities...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Universities Management" 
          counselorName="Imran" 
          btnName="+ Add University" 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
            {/* Search */}
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Search by name or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
              />
            </motion.div>

            {/* Table with Logo column */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 w-16">Logo</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[160px]">Name</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Country</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">City</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Website</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">QS Ranking</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Featured</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Students Placed</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((uni) => (
                      <motion.tr key={uni.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        {/* Logo column */}
                        <td className="px-4 py-3 sm:px-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <img
                              src={uni.logo}
                              alt={`${uni.name} logo`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/48?text=Logo"; // fallback
                              }}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{uni.name}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{uni.country}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{uni.city}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden lg:table-cell">
                          <a
                            href={`https://${uni.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline hover:text-sky-800 transition-colors"
                          >
                            {uni.website}
                          </a>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-center font-medium">
                          {uni.qsRanking || "—"}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              uni.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {uni.featured ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-center font-medium">
                          {uni.studentsPlaced}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="text-sky-600 hover:text-sky-800 transition-colors">Edit</button>
                            <button className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filtered.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
                No universities found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}