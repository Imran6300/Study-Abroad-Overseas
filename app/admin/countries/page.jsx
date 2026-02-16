"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

import AddCountryForm from "@/components/adminform/addcountry";
import ConfirmationModal from "@/components/adminform/confirmmsg";

import { useSelector } from "react-redux";

import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

export default function CountriesPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [countries, setCountries] = useState([
    {
      id: 1,
      name: "Canada",
      flag: "https://flagcdn.com/w320/ca.png",
      image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800", // example
      continent: "North America",
      capital: "Ottawa",
      languages: "English, French",
      avgTuitionUSD: "$20,000–$40,000 / year",
      visaSuccessRate: "92%",
      featured: true,
      universitiesCount: 38,
    },
    // ... more mock entries
  ]);

  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const [mode, setMode] = useState(null); // "add" | "edit" | "view" | null
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);

  const isFormOpen = mode !== null;

  const openAdd = () => {
    setSelectedCountry(null);
    setMode("add");
  };

  const openView = (country) => {
    setSelectedCountry(country);
    setMode("view");
  };

  const openEdit = (country) => {
    setSelectedCountry(country);
    setMode("edit");
  };

  const openDeleteConfirm = (country) => {
    setCountryToDelete(country);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = () => {
    setCountries((prev) => prev.filter((c) => c.id !== countryToDelete.id));
    setShowConfirmDelete(false);
    setCountryToDelete(null);
  };

  const handleFormSuccess = (submittedData) => {
    const {
      name,
      finalFlagUrl,
      finalPhotoUrl,
      // you can add more later: popularCourses, careerOpportunities, etc.
    } = submittedData;

    if (mode === "add") {
      const newCountry = {
        id: Date.now(),
        name: name || "Unknown",
        flag: finalFlagUrl || "https://flagcdn.com/w320/xx.png",
        image: finalPhotoUrl || null,
        continent: "", // ← add to form if needed
        capital: "",
        languages: "",
        avgTuitionUSD: "N/A",
        visaSuccessRate: "N/A",
        featured: false,
        universitiesCount: 0,
      };
      setCountries((prev) => [...prev, newCountry]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } else if (mode === "edit" && selectedCountry) {
      setCountries((prev) =>
        prev.map((c) =>
          c.id === selectedCountry.id
            ? {
                ...c,
                name: name || c.name,
                flag: finalFlagUrl || c.flag,
                image: finalPhotoUrl || c.image,
                // continent: submittedData.continent || c.continent,
                // etc...
              }
            : c,
        ),
      );
    }

    setMode(null);
    setSelectedCountry(null);
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.continent.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title={
            mode === "add"
              ? "Add New Country"
              : mode === "edit"
                ? "Edit Country"
                : mode === "view"
                  ? "View Country"
                  : "Countries Management"
          }
          counselorName={CounselorName}
          btnName={isFormOpen ? "Close" : "+ Add Country"}
          onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50 relative">
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-20 max-w-5xl mx-auto mb-12"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-5 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {mode === "add"
                        ? "Add New Country"
                        : mode === "edit"
                          ? "Edit Country"
                          : "Country Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-6 lg:p-10">
                    <AddCountryForm
                      mode={mode}
                      initialData={selectedCountry}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setMode(null)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Country added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <input
                type="text"
                placeholder="Search by country name or continent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-shadow"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-20">
                        Flag
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-24">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Country
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        Continent
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">
                        Capital
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 hidden lg:table-cell">
                        Visa Success
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCountries.map((country) => (
                      <motion.tr
                        key={country.id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-8 rounded overflow-hidden border border-gray-200 shadow-sm">
                            <img
                              src={country.flag}
                              alt={`${country.name} flag`}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/48x32?text=Flag")
                              }
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {country.image ? (
                            <div className="w-16 h-10 rounded overflow-hidden border border-gray-200 shadow-sm">
                              <img
                                src={country.image}
                                alt={`${country.name} preview`}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://via.placeholder.com/64x40?text=No+Img")
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {country.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">
                          {country.continent}
                        </td>
                        <td className="px-6 py-4 text-gray-600 hidden md:table-cell">
                          {country.capital}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {country.visaSuccessRate}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <button
                            onClick={() => openView(country)}
                            className="text-sky-600 hover:text-sky-800 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEdit(country)}
                            className="text-amber-600 hover:text-amber-800 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(country)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {filteredCountries.length === 0 && (
              <motion.p
                variants={itemVariants}
                className="text-center mt-12 text-gray-500 text-lg"
              >
                No countries found.
              </motion.p>
            )}
          </motion.div>

          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Country"
                message={`Are you sure you want to delete ${countryToDelete?.name}? This cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirmed}
                onCancel={() => setShowConfirmDelete(false)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
