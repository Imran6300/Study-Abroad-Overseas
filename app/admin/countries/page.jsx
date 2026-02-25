"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";

import AddCountryForm from "@/components/adminform/addcountry";
import ConfirmationModal from "@/components/adminform/confirmmsg";

import Image from "next/image";

import { useSelector } from "react-redux";

import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

export default function CountriesPage() {
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [messageModal, setMessageModal] = useState({
    open: false,
    type: "", // "success" | "error"
    message: "",
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        setCountries(data.data);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const openView = async (country) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries/${country.slug}`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (data.success) {
        setSelectedCountry(data.data);
        setMode("view");
      }
    } catch (err) {
      console.error("Failed to fetch country details:", err);
    }
  };

  const openEdit = async (country) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries/${country.slug}`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (data.success) {
        setSelectedCountry(data.data); // full country object
        setMode("edit");
      }
    } catch (err) {
      console.error("Failed to fetch country details:", err);
    }
  };

  const openDeleteConfirm = (country) => {
    setCountryToDelete(country);
    setShowConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/country/${countryToDelete.slug}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      await fetchCountries();
    } catch (err) {
      console.error("Delete failed:", err);
    }

    setShowConfirmDelete(false);
    setCountryToDelete(null);
  };

  const handleFormSuccess = async (submittedData) => {
    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(submittedData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      let res;

      if (mode === "add") {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/country`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          },
        );
      }

      if (mode === "edit" && selectedCountry) {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/country/${selectedCountry.slug}`,
          {
            method: "PUT",
            body: formData,
            credentials: "include",
          },
        );
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      // ✅ SUCCESS
      await fetchCountries();

      setMessageModal({
        open: true,
        type: "success",
        message:
          mode === "add"
            ? "Country added successfully!"
            : "Country updated successfully!",
      });

      setMode(null);
      setSelectedCountry(null);
    } catch (err) {
      // ❌ ERROR
      setMessageModal({
        open: true,
        type: "error",
        message: err.message || "Form submission failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.continent || "").toLowerCase().includes(search.toLowerCase()),
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
                      setMessageModal={setMessageModal}
                      submitting={submitting}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {messageModal.open && (
              <ConfirmationModal
                title={messageModal.type === "success" ? "Success" : "Error"}
                message={messageModal.message}
                confirmText="OK"
                confirmVariant={
                  messageModal.type === "success" ? "primary" : "danger"
                }
                onConfirm={() =>
                  setMessageModal({ open: false, type: "", message: "" })
                }
                onCancel={() =>
                  setMessageModal({ open: false, type: "", message: "" })
                }
              />
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
                {loading && (
                  <p className="text-center py-6 text-gray-500">
                    Loading countries...
                  </p>
                )}
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
                        key={country._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="w-12 h-8 rounded overflow-hidden border border-gray-200 shadow-sm">
                            <Image
                              src={country.flagImage?.url}
                              alt={`${country.name} flag`}
                              width={48}
                              height={32}
                              className="w-full h-full object-cover"
                              style={{ objectFit: "cover" }} // if needed
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/48x32?text=Flag")
                              }
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {country.heroImage ? (
                            <div className="w-16 h-10 rounded overflow-hidden border border-gray-200 shadow-sm">
                              <Image
                                src={country.heroImage?.url}
                                alt={`${country.name} preview`}
                                width={48}
                                height={32}
                                className="w-full h-full object-cover"
                                style={{ objectFit: "cover" }} // if needed
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
