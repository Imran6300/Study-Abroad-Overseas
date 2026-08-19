"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import AddStudentForm from "@/components/adminform/addstudents";
import ConfirmationModal from "@/components/adminform/confirmmsg";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  containerVariants,
  itemVariants,
  formVariants,
} from "@/components/Animations/formanimations/animate";

const STATUS_OPTIONS = ["Lead", "Applied", "Enrolled", "Closed"];
const CONTACTED_STAGES = ["contacted", "qualified", "applied", "enrolled"];

// NEW: human-readable labels + colors for every form a lead can come from.
// Keep this in sync with the `leadSource` enum in models/assessment.js and
// the `source` values passed to syncLeadFromForm() across controllers.
const SOURCE_LABELS = {
  homepage: {
    label: "Country Interest",
    className: "bg-cyan-100 text-cyan-700",
  },
  assessment: {
    label: "Assessment",
    className: "bg-indigo-100 text-indigo-700",
  },
  scholarship: {
    label: "Scholarship",
    className: "bg-amber-100 text-amber-700",
  },
  khizar_application: {
    label: "Application",
    className: "bg-emerald-100 text-emerald-700",
  },
  partner: { label: "Partner", className: "bg-fuchsia-100 text-fuchsia-700" },
  referral: { label: "Referral", className: "bg-teal-100 text-teal-700" },
  manual: { label: "Manual", className: "bg-gray-100 text-gray-700" },
  profile_completion: {
    label: "Profile Completed",
    className: "bg-sky-100 text-sky-700",
  },
};

function sourceBadge(sourceKey) {
  return (
    SOURCE_LABELS[sourceKey] || {
      label: sourceKey || "Unknown",
      className: "bg-gray-100 text-gray-700",
    }
  );
}

// NEW: tells the super_admin at a glance whether a student is:
//  - an org lead (belongs to a White-Label org/agency)      → 🏢 org name
//  - an independent counselor's lead                        → 👤 counselor name
//  - a direct/organic khizaroverseas.in lead (neither)       → no badge
function ownerBadge(student) {
  if (student.orgName) {
    return {
      icon: "🏢",
      label: student.orgName,
      className: "bg-purple-100 text-purple-700",
    };
  }

  if (student.counselorName) {
    return {
      icon: "👤",
      label: student.counselorName,
      className: "bg-blue-100 text-blue-700",
    };
  }

  return null;
}

export default function StudentsAdminPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const CounselorName = user?.name;
  const [deleting, setDeleting] = useState(false);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  // NEW: counselor assignment (super_admin only) — list of independent
  // counselors to assign a student to, and which row is currently saving.
  const [counselors, setCounselors] = useState([]);
  const [assigningLeadId, setAssigningLeadId] = useState(null);
  const [assignMessage, setAssignMessage] = useState("");
  const isSuperAdmin = user?.role === "super_admin";

  const [mode, setMode] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const isFormOpen = mode !== null;

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // The backend paginates this endpoint (default 10 per page, hard
        // ceiling of 100 — see paginationParams in leadController.js) and
        // returns { leads, total, page, pages }. This page was calling
        // `/api/lead` with no query params at all, so it silently only
        // ever got page 1 (10 leads) no matter how many leads actually
        // exist. Loop through every page at the max page size (100) and
        // accumulate the full list — the search box below already filters
        // client-side over the whole `students` array, so it expects the
        // complete set to be in memory, not just one page of it.
        const allLeads = [];
        let page = 1;
        let totalPages = 1;

        do {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead?page=${page}&limit=100`,
            { credentials: "include" },
          );

          const data = await res.json();

          // SAFE CHECK
          const leadsArray = Array.isArray(data?.leads)
            ? data.leads
            : Array.isArray(data)
              ? data
              : [];

          allLeads.push(...leadsArray);

          totalPages = Number.isFinite(data?.pages) ? data.pages : 1;
          page += 1;
        } while (page <= totalPages);

        const formatted = allLeads.map((lead) => {
          // NEW: collect every distinct form this person has submitted
          // (sourceForms is populated by services/leadSync/syncLeadFromForm
          // on the backend). Falls back to the single leadSource for older
          // leads created before sourceForms existed, so nothing on screen
          // regresses for pre-existing data.
          const formTypes =
            Array.isArray(lead.sourceForms) && lead.sourceForms.length
              ? [...new Set(lead.sourceForms.map((f) => f.type))]
              : lead.leadSource
                ? [lead.leadSource]
                : [];

          return {
            id: lead.user || null,
            leadId: lead._id,

            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            target: lead.preferredCountry,
            status: lead.counselorStage,
            counselor: lead.assignedCounselor?.name || "Unassigned",
            // NEW: orgName comes pre-resolved from the backend (Organization
            // lookup by adminId). counselorName only applies when the lead
            // has an assignedCounselor but no org — an independent counselor.
            orgName: lead.orgName || null,
            counselorName: !lead.orgName
              ? lead.assignedCounselor?.name || null
              : null,
            // NEW: raw id, used to pre-select and update the assign dropdown
            assignedCounselorId: lead.assignedCounselor?._id || null,
            created: new Date(lead.createdAt).toISOString().split("T")[0],
            sources: formTypes,
            // NEW: detected server-side from the submitter's IP address at
            // submission time — not a form field, never shown to the person.
            submissionCountry: lead.submissionCountry || null,
            submissionCountryCode: lead.submissionCountryCode || null,
            submissionCountryGuess: lead.submissionCountryGuess || null,
          };
        });

        setStudents(formatted);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // NEW: super_admin-only — load independent counselors (no adminId, i.e.
  // not tied to a White-Label org) to populate the assign dropdown. Reuses
  // the existing /host/admin-users endpoint instead of adding a new one.
  // (adminRoutes.js is mounted at app.use("/host", adminRouter) in app.js,
  // not "/api" — unlike leadRouter, which is mounted at "/api".)
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchCounselors = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/admin-users`,
          { credentials: "include" },
        );
        const data = await res.json();
        const independentCounselors = (data?.users || []).filter(
          (u) => u.role === "counselor" && !u.adminId,
        );
        setCounselors(independentCounselors);
      } catch (err) {
        console.error("Failed to fetch counselors:", err);
      }
    };

    fetchCounselors();
  }, [isSuperAdmin]);

  // NEW: assign / reassign / unassign a student's counselor.
  const assignCounselor = async (leadId, counselorId) => {
    try {
      setAssigningLeadId(leadId);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${leadId}/assign-counselor`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ counselorId: counselorId || null }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to assign counselor");
        return;
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.leadId === leadId
            ? {
                ...s,
                assignedCounselorId: data.assignedCounselor?._id || null,
                counselor: data.assignedCounselor?.name || "Unassigned",
                counselorName: data.assignedCounselor?.name || null,
              }
            : s,
        ),
      );

      setAssignMessage(
        data.khizarApplicationCreated
          ? `${data.message} — a Khizar-managed application was started for them.`
          : data.message || "Counselor updated",
      );
      setTimeout(() => setAssignMessage(""), 4000);
    } catch (error) {
      console.error("Assign counselor error:", error);
      alert("Something went wrong while assigning the counselor");
    } finally {
      setAssigningLeadId(null);
    }
  };

  const deleteStudent = async (leadId) => {
    try {
      setDeleting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${leadId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete student");
        return false;
      }

      setStudents((prev) => prev.filter((s) => s.leadId !== leadId));
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;

    return (
      (s.name || "").toLowerCase().includes(term) ||
      (s.email || "").toLowerCase().includes(term) ||
      (s.phone || "").toLowerCase().includes(term) ||
      (s.status || "").toLowerCase().includes(term) ||
      (s.orgName || "").toLowerCase().includes(term) ||
      (s.counselorName || "").toLowerCase().includes(term) ||
      (s.submissionCountry || "").toLowerCase().includes(term)
    );
  });

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ counselorStage: newStatus }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to update status");
        return;
      }

      setStudents((prev) =>
        prev.map((s) => (s.leadId === id ? { ...s, status: newStatus } : s)),
      );
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleFormSuccess = (formData) => {
    if (mode === "add") {
      const newStudent = {
        id: formData.leadId,
        name: formData.fullName || "Unknown",
        email: formData.email || "",
        phone: formData.mobile || "",
        origin: "India",
        target: formData.preferredCountries?.[0] || "Not specified",
        status: formData.currentStatus || "Lead",
        counselor: formData.assignedCounselor || "Unassigned",
        created: new Date().toISOString().split("T")[0],
      };
      setStudents((prev) => [...prev, newStudent]);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    }
    setMode(null);
    setSelectedStudent(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={
            mode === "add"
              ? "Add New Student"
              : mode === "edit"
                ? "Edit Student"
                : mode === "view"
                  ? "View Student"
                  : "Student Management"
          }
          counselorName={CounselorName}
          onButtonClick={
            isFormOpen ? () => setMode(null) : () => setMode("add")
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50">
          {/* Backdrop */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
              />
            )}
          </AnimatePresence>

          {/* Form Modal */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-20 max-w-5xl mx-auto mb-10 sm:mb-12"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/70 overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 px-5 sm:px-6 py-4 sm:py-5 border-b flex justify-between items-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                      {mode === "add"
                        ? "Add New Student"
                        : mode === "edit"
                          ? "Edit Student"
                          : "Student Details"}
                    </h2>
                    <button
                      onClick={() => setMode(null)}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={24} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="p-5 sm:p-6 lg:p-10">
                    <AddStudentForm
                      mode={mode}
                      initialData={selectedStudent}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setMode(null)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success toast */}
          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 mx-2 sm:mx-0 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                Student added successfully!
              </motion.div>
            )}
          </AnimatePresence>

          {/* NEW: Counselor assignment toast */}
          <AnimatePresence>
            {assignMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 mx-2 sm:mx-0 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-center font-medium shadow-sm"
              >
                {assignMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={`transition-opacity duration-500 ${isFormOpen ? "opacity-70 pointer-events-none" : "opacity-100"}`}
          >
            {/* Search */}
            <motion.div variants={itemVariants} className="mb-6 px-1 sm:px-0">
              <input
                type="text"
                placeholder="Search by name, email, phone or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-lg px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* Table wrapper */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mx-1 sm:mx-0"
              variants={itemVariants}
            >
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-gray-600 min-h-[300px] flex items-center justify-center">
                    Loading students...
                  </div>
                ) : students.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 text-lg">
                    No students found.
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 text-lg">
                    No students match your search.
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Name
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden sm:table-cell">
                          Email
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Phone
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell">
                          Target Country
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden lg:table-cell">
                          Submitted Forms
                        </th>
                        <th
                          className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell"
                          title="Detected from the submitter's IP address, not a form field"
                        >
                          Submitted From
                        </th>
                        {isSuperAdmin && (
                          <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                            Counselor
                          </th>
                        )}
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Actions
                        </th>
                        <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Contacted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredStudents.map((student) => (
                        <motion.tr
                          key={student.leadId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium text-gray-900">
                            <div className="flex flex-col gap-1">
                              <span>{student.name}</span>
                              {(() => {
                                const badge = ownerBadge(student);
                                return badge ? (
                                  <span
                                    className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${badge.className}`}
                                    title={
                                      student.orgName
                                        ? "Belongs to organization"
                                        : "Belongs to counselor"
                                    }
                                  >
                                    <span>{badge.icon}</span>
                                    <span>{badge.label}</span>
                                  </span>
                                ) : null;
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 hidden sm:table-cell">
                            {student.email}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600">
                            {student.phone}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 hidden md:table-cell">
                            {student.target}
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {student.sources.length === 0 ? (
                                <span className="text-xs text-gray-400">—</span>
                              ) : (
                                student.sources.map((src) => {
                                  const badge = sourceBadge(src);
                                  return (
                                    <span
                                      key={src}
                                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${badge.className}`}
                                    >
                                      {badge.label}
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">
                            {student.submissionCountry ? (
                              <span title={student.submissionCountryCode || ""}>
                                {student.submissionCountry}
                              </span>
                            ) : student.submissionCountryGuess ? (
                              <span
                                className="text-gray-400 italic"
                                title="Guessed from phone number's calling code — not confirmed"
                              >
                                {student.submissionCountryGuess}?
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Unknown
                              </span>
                            )}
                          </td>
                          {isSuperAdmin && (
                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-gray-600 whitespace-nowrap">
                              {student.orgName ? (
                                <span className="text-xs text-gray-400">
                                  Org-managed
                                </span>
                              ) : (
                                <div className="relative w-full min-w-[140px] max-w-[180px]">
                                  <select
                                    value={student.assignedCounselorId || ""}
                                    disabled={
                                      assigningLeadId === student.leadId
                                    }
                                    onChange={(e) =>
                                      assignCounselor(
                                        student.leadId,
                                        e.target.value || null,
                                      )
                                    }
                                    className="w-full appearance-none px-3 py-2 pr-8 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white text-gray-700 truncate cursor-pointer transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
                                  >
                                    <option value="">Unassigned</option>
                                    {counselors.map((c) => (
                                      <option key={c._id} value={c._id}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown
                                    size={14}
                                    strokeWidth={2.5}
                                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                  />
                                  {assigningLeadId === student.leadId && (
                                    <span className="absolute -bottom-4 left-0 text-[10px] text-sky-600 whitespace-nowrap">
                                      Saving...
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3 sm:px-6 sm:py-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                                student.status === "enrolled"
                                  ? "bg-green-100 text-green-700"
                                  : student.status === "applied"
                                    ? "bg-blue-100 text-blue-700"
                                    : student.status === "qualified"
                                      ? "bg-purple-100 text-purple-700"
                                      : student.status === "contacted"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : student.status === "lost"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {capitalize(student.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium whitespace-nowrap">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              {student.id && (
                                <button
                                  onClick={() =>
                                    router.push(`/admin/students/${student.id}`)
                                  }
                                  className="text-sky-600 hover:text-sky-800 text-sm"
                                >
                                  View
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setStudentToDelete(student);
                                  setShowConfirmDelete(true);
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                            <label className="inline-flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={CONTACTED_STAGES.includes(
                                  student.status,
                                )}
                                disabled={[
                                  "qualified",
                                  "applied",
                                  "enrolled",
                                  "lost",
                                ].includes(student.status)}
                                onChange={() => {
                                  if (student.status === "lead") {
                                    updateStatus(student.leadId, "contacted");
                                    return;
                                  }

                                  if (student.status === "contacted") {
                                    updateStatus(student.leadId, "lead");
                                    return;
                                  }
                                }}
                              />
                              <div
                                className={`
                                  relative w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 
                                  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-100 
                                  rounded-full peer transition-colors
                                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                                  after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all 
                                  peer-checked:bg-emerald-500
                                  group-hover:bg-gray-300 peer-checked:group-hover:bg-emerald-600
                                `}
                              />
                            </label>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {showConfirmDelete && (
              <ConfirmationModal
                title="Delete Student"
                message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={async () => {
                  if (!studentToDelete) return;

                  const success = await deleteStudent(studentToDelete.leadId);

                  if (success) {
                    setShowConfirmDelete(false);
                    setStudentToDelete(null);
                  }
                }}
                onCancel={() => setShowConfirmDelete(false)}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
