// // app/admin/applications/page.jsx
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X } from "lucide-react";
// import { useDebounce } from "use-debounce";

// import AdminSidebar from "@/components/admindashboard/AdminSidebar";
// import DashboardHeader from "@/components/admindashboard/DashboardHeader";
// import ConfirmationModal from "@/components/adminform/confirmmsg";

// import AddApplicationForm from "@/components/adminform/addapplication";

// // import { useSelector } from "react-redux";

// // Animations (same as students page)
// import {
//   containerVariants,
//   itemVariants,
//   formVariants,
// } from "@/components/Animations/formanimations/animate";

// function ApplicationRow({ app, onView, onEdit, onDelete }) {
//   const stageStyles = {
//     "Documents Pending": "bg-yellow-100 text-yellow-800",
//     "Offer Received": "bg-green-100 text-green-800",
//     Approved: "bg-green-100 text-green-800",
//     Rejected: "bg-red-100 text-red-800",
//   };

//   const badgeClass = stageStyles[app.stage] || "bg-blue-100 text-blue-800";

//   return (
//     <tr className="hover:bg-gray-50 transition-colors duration-150">
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
//         {app.id}
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-900">
//         {app.studentName}
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
//         {app.university}
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
//         {app.course}
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
//         <span
//           className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badgeClass}`}
//         >
//           {app.stage}
//         </span>
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
//         {new Date(app.deadline).toLocaleDateString("en-IN", {
//           day: "numeric",
//           month: "short",
//           year: "numeric",
//         })}
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
//         {app.counselor}
//       </td>
//       <td className="px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium">
//         <div className="flex items-center gap-3 sm:gap-4">
//           <button
//             onClick={() => onView(app)}
//             className="text-sky-600 hover:text-sky-800"
//           >
//             View
//           </button>
//           <button
//             onClick={() => onEdit(app)}
//             className="text-amber-600 hover:text-amber-800"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(app)}
//             className="text-red-600 hover:text-red-800"
//           >
//             Delete
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// }

// export default function ApplicationsAdminPage() {
//   const { user } = useSelector((state) => state.auth);
//   const CounselorName = user?.name;
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch] = useDebounce(search, 300);

//   // ─── Modal & form states ───
//   const [mode, setMode] = useState(null); // null | "add" | "view" | "edit"
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false);
//   const [appToDelete, setAppToDelete] = useState(null);
//   const [justAdded, setJustAdded] = useState(false);

//   const isFormOpen = mode !== null;

//   useEffect(() => {
//     // Mock data — replace with real API later
//     const mockData = [
//       {
//         id: "APP-001",
//         studentName: "Ahmed Khan",
//         email: "ahmed@example.com",
//         university: "University of Toronto",
//         course: "Computer Science - MSc",
//         stage: "Documents Pending",
//         submittedDate: "2026-01-10",
//         deadline: "2026-02-15",
//         counselor: "Sara Ahmed",
//         documentsStatus: "Incomplete (4/7)",
//       },
//       {
//         id: "APP-002",
//         studentName: "Priya Sharma",
//         email: "priya.sharma@gmail.com",
//         university: "University of Melbourne",
//         course: "Master of Business Administration",
//         stage: "Offer Received",
//         submittedDate: "2025-12-05",
//         deadline: "2026-03-01",
//         counselor: "John Mathew",
//         documentsStatus: "Complete",
//       },
//     ];

//     setApplications(mockData);
//     setLoading(false);
//   }, []);

//   // ─── Handlers ───
//   const openAdd = () => {
//     setSelectedApplication(null);
//     setMode("add");
//   };

//   const openView = (app) => {
//     setSelectedApplication(app);
//     setMode("view");
//   };

//   const openEdit = (app) => {
//     setSelectedApplication(app);
//     setMode("edit");
//   };

//   const openDeleteConfirm = (app) => {
//     setAppToDelete(app);
//     setShowConfirmDelete(true);
//   };

//   const handleDeleteConfirmed = () => {
//     setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
//     setShowConfirmDelete(false);
//     setAppToDelete(null);
//   };

//   const handleFormSuccess = (formData) => {
//     if (mode === "add") {
//       const newApp = {
//         id: `APP-${String(Date.now()).slice(-4)}`,
//         studentName: formData.studentName || formData.fullName || "Unknown",
//         email: formData.email || "",
//         university: formData.university || "",
//         course: formData.course || "",
//         stage: formData.stage || "Documents Pending",
//         deadline: formData.deadline || "",
//         counselor: formData.counselor || "Unassigned",
//         // you can add more if needed
//       };
//       setApplications((prev) => [...prev, newApp]);
//       setJustAdded(true);
//       setTimeout(() => setJustAdded(false), 3000);
//     } else if (mode === "edit" && selectedApplication) {
//       setApplications((prev) =>
//         prev.map((a) =>
//           a.id === selectedApplication.id
//             ? {
//                 ...a,
//                 studentName: formData.studentName || a.studentName,
//                 email: formData.email || a.email,
//                 university: formData.university || a.university,
//                 course: formData.course || a.course,
//                 stage: formData.stage || a.stage, // ← this updates stage!
//                 deadline: formData.deadline || a.deadline,
//                 counselor: formData.counselor || a.counselor,
//               }
//             : a,
//         ),
//       );
//     }

//     setMode(null);
//     setSelectedApplication(null);
//   };

//   const filteredApplications = useMemo(() => {
//     if (!debouncedSearch?.trim()) return applications;
//     const term = debouncedSearch.toLowerCase();
//     return applications.filter((app) =>
//       [app.id, app.studentName, app.email, app.university, app.course].some(
//         (field) => field?.toLowerCase().includes(term),
//       ),
//     );
//   }, [applications, debouncedSearch]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50">
//         <p className="text-lg text-gray-600 animate-pulse">
//           Loading applications…
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-50 relative">
//       <AdminSidebar />

//       <div className="flex-1 flex flex-col">
//         <DashboardHeader
//           title={
//             mode === "add"
//               ? "Add New Application"
//               : mode === "edit"
//                 ? "Edit Application"
//                 : mode === "view"
//                   ? "View Application"
//                   : "Applications Management"
//           }
//           counselorName={CounselorName}
//           btnName={isFormOpen ? "Close" : "+ New Application"}
//           onButtonClick={isFormOpen ? () => setMode(null) : openAdd}
//         />

//         <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50 relative">
//           {/* Backdrop */}
//           <AnimatePresence>
//             {isFormOpen && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 pointer-events-none"
//               />
//             )}
//           </AnimatePresence>

//           {/* Form Modal */}
//           <AnimatePresence>
//             {isFormOpen && (
//               <motion.div
//                 variants={formVariants}
//                 initial="hidden"
//                 animate="visible"
//                 exit="exit"
//                 className="relative z-20 max-w-5xl mx-auto mb-12"
//               >
//                 <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
//                   <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-6 py-5 border-b flex justify-between items-center">
//                     <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
//                       {mode === "add"
//                         ? "Add New Application"
//                         : mode === "edit"
//                           ? "Edit Application"
//                           : "Application Details"}
//                     </h2>
//                     <button
//                       onClick={() => setMode(null)}
//                       className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
//                     >
//                       <X size={24} strokeWidth={2.5} />
//                     </button>
//                   </div>

//                   <div className="p-6 lg:p-10">
//                     <AddApplicationForm
//                       mode={mode}
//                       initialData={selectedApplication}
//                       onSuccess={handleFormSuccess}
//                       onCancel={() => setMode(null)}
//                     />
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Success message */}
//           <AnimatePresence>
//             {justAdded && (
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
//               >
//                 Application added successfully!
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* List + search */}
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="show"
//             className={`space-y-6 sm:space-y-8 transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
//           >
//             <motion.div variants={itemVariants} className="max-w-md">
//               <input
//                 type="search"
//                 placeholder="Search by name, email, university or ID…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
//               />
//             </motion.div>

//             <motion.div
//               variants={itemVariants}
//               className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
//             >
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
//                         ID
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px]">
//                         Student
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left ... hidden md:table-cell">
//                         University
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left ... hidden lg:table-cell">
//                         Course
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left ... min-w-[130px]">
//                         Stage
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left ... hidden sm:table-cell">
//                         Deadline
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left ... hidden md:table-cell">
//                         Counselor
//                       </th>
//                       <th className="px-4 py-3 sm:px-6 text-left ... whitespace-nowrap">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {filteredApplications.map((app) => (
//                       <ApplicationRow
//                         key={app.id}
//                         app={app}
//                         onView={openView}
//                         onEdit={openEdit}
//                         onDelete={openDeleteConfirm}
//                       />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </motion.div>

//             {filteredApplications.length === 0 && (
//               <motion.p
//                 variants={itemVariants}
//                 className="text-center py-12 text-gray-500"
//               >
//                 {debouncedSearch
//                   ? `No applications found matching “${debouncedSearch}”`
//                   : "No applications yet."}
//               </motion.p>
//             )}
//           </motion.div>

//           {/* Delete modal */}
//           <AnimatePresence>
//             {showConfirmDelete && (
//               <ConfirmationModal
//                 title="Delete Application"
//                 message={`Are you sure you want to delete application ${appToDelete?.id} (${appToDelete?.studentName})? This cannot be undone.`}
//                 confirmText="Delete"
//                 confirmVariant="danger"
//                 onConfirm={handleDeleteConfirmed}
//                 onCancel={() => setShowConfirmDelete(false)}
//               />
//             )}
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// }
