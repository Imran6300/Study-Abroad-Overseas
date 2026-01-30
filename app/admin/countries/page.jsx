// app/dashboard/countries/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

// Animation variants (same as everywhere)
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

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock data – replace with real fetch later
    const mockData = [
      {
        id: 1,
        name: "Canada",
        flag: "https://flagcdn.com/w320/ca.png",
        continent: "North America",
        capital: "Ottawa",
        languages: "English, French",
        avgTuitionUSD: "$20,000–$40,000 / year",
        visaSuccessRate: "92%",
        featured: true,
        universitiesCount: 38,
      },
      {
        id: 2,
        name: "Australia",
        flag: "https://flagcdn.com/w320/au.png",
        continent: "Oceania",
        capital: "Canberra",
        languages: "English",
        avgTuitionUSD: "$25,000–$45,000 / year",
        visaSuccessRate: "88%",
        featured: true,
        universitiesCount: 42,
      },
      {
        id: 3,
        name: "Germany",
        flag: "https://flagcdn.com/w320/de.png",
        continent: "Europe",
        capital: "Berlin",
        languages: "German",
        avgTuitionUSD: "€0–€15,000 / year",
        visaSuccessRate: "85%",
        featured: true,
        universitiesCount: 25,
      },
      {
        id: 4,
        name: "United Kingdom",
        flag: "https://flagcdn.com/w320/gb.png",
        continent: "Europe",
        capital: "London",
        languages: "English",
        avgTuitionUSD: "£15,000–£35,000 / year",
        visaSuccessRate: "90%",
        featured: true,
        universitiesCount: 130,
      },
    ];
    setCountries(mockData);
    setLoading(false);
  }, []);

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.continent.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg text-gray-600">
          Loading countries...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title="Countries Management" 
          counselorName="Imran" 
          btnName="+ Add Country" 
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
            {/* Search */}
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="Search by country name or continent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm sm:text-base"
              />
            </motion.div>

            {/* Table with Flag */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 w-16">Flag</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">Country</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Continent</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Capital</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden lg:table-cell">Languages</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Avg Tuition (USD)</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Visa Success</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Universities</th>
                      <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCountries.map((country) => (
                      <motion.tr key={country.id} variants={itemVariants} className="hover:bg-gray-50 transition-colors">
                        {/* Flag column */}
                        <td className="px-4 py-3 sm:px-6">
                          <div className="w-10 h-6 sm:w-12 sm:h-8 rounded overflow-hidden border border-gray-200 shadow-sm">
                            <img
                              src={country.flag}
                              alt={`${country.name} flag`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/48x32?text=Flag";
                              }}
                            />
                          </div>
                        </td>

                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">{country.name}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden sm:table-cell">{country.continent}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden md:table-cell">{country.capital}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm hidden lg:table-cell">{country.languages}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm">{country.avgTuitionUSD}</td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium text-green-700">
                          {country.visaSuccessRate}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm text-center font-medium">
                          {country.universitiesCount}
                        </td>
                        <td className="px-4 py-3 sm:px-6 text-xs sm:text-sm font-medium">
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            <button className="text-sky-600 hover:text-sky-800">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCountries.length === 0 && (
              <motion.p variants={itemVariants} className="text-center mt-10 text-gray-500 text-base sm:text-lg">
                No countries found matching your search.
              </motion.p>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}