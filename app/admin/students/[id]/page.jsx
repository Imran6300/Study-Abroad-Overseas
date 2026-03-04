"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  Clock,
  FileSignature,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Send,
} from "lucide-react";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { useSelector } from "react-redux";
import AddApplicationForm from "@/components/adminform/addapplication";
import VisaCaseForm from "@/components/adminform/addvisa";
import DeadlineForm from "@/components/adminform/adddeadline";
import NotesForm from "@/components/adminform/addnotes";

// ────────────────────────────────────────────────
// Mock data – replace with real API later
// ────────────────────────────────────────────────
const mockApplications = [
  {
    id: "app1",
    program: "Computer Science - BSc",
    university: "University of Toronto",
    status: "Submitted",
    date: "2025-11-15",
  },
  {
    id: "app2",
    program: "Data Science - MSc",
    university: "McGill University",
    status: "Offer Received",
    date: "2025-12-02",
  },
];

const mockVisas = [
  {
    id: "visa1",
    type: "Study Permit",
    status: "Applied",
    appliedDate: "2025-12-10",
    decisionDate: "Pending",
  },
  {
    id: "visa2",
    type: "Study Permit Extension",
    status: "Approved",
    appliedDate: "2025-10-05",
    decisionDate: "2025-11-20",
  },
];

const mockDeadlines = [
  {
    id: "dl1",
    title: "Application Deadline",
    date: "2026-01-15",
    description: "UofT CS program",
  },
  {
    id: "dl2",
    title: "Visa Biometrics",
    date: "2026-02-05",
    description: "VFS Global appointment",
  },
];

const mockNotes = [
  {
    id: "note1",
    title: "Follow-up call",
    date: "2025-12-20",
    content: "Student needs help with SOP and LOR",
  },
  {
    id: "note2",
    title: "IELTS score received",
    date: "2025-11-28",
    content: "Overall 7.5 – good enough for most programs",
  },
];

// ────────────────────────────────────────────────

export default function StudentProfilePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const counselorName = user?.name || "Counselor";

  const [activeTab, setActiveTab] = useState("applications");
  const [editing, setEditing] = useState(null);

  const [applications, setApplications] = useState(mockApplications);
  const [visas, setVisas] = useState(mockVisas);
  const [deadlines, setDeadlines] = useState(mockDeadlines);
  const [notes, setNotes] = useState(mockNotes);
  const [documents] = useState([]);

  const [activities] = useState([
    {
      id: "a1",
      type: "application",
      message: "Application submitted to University of Toronto",
      date: "2026-02-10",
    },
    {
      id: "a2",
      type: "document",
      message: "IELTS score uploaded",
      date: "2026-01-22",
    },
    {
      id: "a3",
      type: "visa",
      message: "Visa case created",
      date: "2026-03-02",
    },
  ]);

  const handleDelete = (type, itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    if (type === "applications") {
      setApplications((prev) => prev.filter((item) => item.id !== itemId));
    } else if (type === "visa") {
      setVisas((prev) => prev.filter((item) => item.id !== itemId));
    } else if (type === "deadlines") {
      setDeadlines((prev) => prev.filter((item) => item.id !== itemId));
    } else if (type === "notes") {
      setNotes((prev) => prev.filter((item) => item.id !== itemId));
    }

    if (editing?.item?.id === itemId) {
      setEditing(null);
    }
  };

  const startEdit = (type, item = null) => {
    setEditing({ type, item });
  };

  const handleFormSuccess = (type, updatedItem) => {
    if (editing?.item) {
      // update
      if (type === "applications") {
        setApplications((prev) =>
          prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
        );
      } else if (type === "visa") {
        setVisas((prev) =>
          prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
        );
      } else if (type === "deadlines") {
        setDeadlines((prev) =>
          prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
        );
      } else if (type === "notes") {
        setNotes((prev) =>
          prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)),
        );
      }
    } else {
      // add new
      if (type === "applications") {
        setApplications((prev) => [...prev, updatedItem]);
      } else if (type === "visa") {
        setVisas((prev) => [...prev, updatedItem]);
      } else if (type === "deadlines") {
        setDeadlines((prev) => [...prev, updatedItem]);
      } else if (type === "notes") {
        setNotes((prev) => [...prev, updatedItem]);
      }
    }

    setEditing(null);
  };

  const handleFormCancel = () => {
    setEditing(null);
  };

  const tabs = [
    { key: "applications", label: "Applications", icon: FileSignature },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "visa", label: "Visa", icon: Send },
    { key: "deadlines", label: "Deadlines", icon: Clock },
    { key: "activity", label: "Activity", icon: CheckCircle2 },
    { key: "notes", label: "Notes", icon: FileText },
  ];

  const student = {
    id,
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    phone: "+91 98765 43210",
    country: "India",
    target: "Canada",
    status: "Active",
  };

  const getStatusColor = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("offer") || s === "approved")
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (s.includes("submitted") || s === "applied")
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (s.includes("pending"))
      return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Student Profile"
          counselorName={counselorName}
          btnName="Back to Students"
          onButtonClick={() => router.push("/admin/students")}
        />

        <main className="flex-1 p-5 sm:p-6 lg:p-8 overflow-auto space-y-8">
          {/* Student Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200/70 p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-md ring-2 ring-white/80">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {student.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{student.email}</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {student.phone} • {student.country}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-3">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}
                >
                  {student.status}
                </span>
                <div className="text-sm">
                  Target country:{" "}
                  <span className="font-semibold text-gray-900">
                    {student.target}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Journey Progress
                <span className="text-sm font-normal text-gray-500">
                  (~60% complete)
                </span>
              </h3>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-3 text-xs font-medium text-gray-600">
                <span>Profile</span>
                <span>Applications</span>
                <span>Offers</span>
                <span className="text-gray-400">Visa</span>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/70 overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex flex-wrap px-4 sm:px-8 pt-5 gap-x-2 sm:gap-x-10 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setEditing(null);
                      }}
                      className={`group relative pb-4 px-2 sm:px-3 flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          isActive
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }
                      />
                      {tab.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* APPLICATIONS */}
              {activeTab === "applications" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Applications
                    </h2>
                    <button
                      onClick={() => startEdit("applications")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                    >
                      <Plus size={16} /> Add Application
                    </button>
                  </div>

                  {applications.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed">
                      No applications added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-5 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {app.program}
                              </p>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {app.university}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                                <span>
                                  Status:{" "}
                                  <span
                                    className={`font-medium ${getStatusColor(app.status).split(" ")[1]}`}
                                  >
                                    {app.status}
                                  </span>
                                </span>
                                <span>Date: {app.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit("applications", app)}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete("applications", app.id)
                                }
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "applications" && (
                    <div className="mt-10 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-semibold mb-5">
                        {editing.item
                          ? "Edit Application"
                          : "Add New Application"}
                      </h3>
                      <AddApplicationForm
                        initialData={editing.item}
                        onSuccess={(data) =>
                          handleFormSuccess("applications", data)
                        }
                        onCancel={handleFormCancel}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* VISA */}
              {activeTab === "visa" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Visa Cases
                    </h2>
                    <button
                      onClick={() => startEdit("visa")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                    >
                      <Plus size={16} /> Add Visa Case
                    </button>
                  </div>

                  {visas.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed">
                      No visa cases added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {visas.map((visa) => (
                        <div
                          key={visa.id}
                          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-5 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {visa.type}
                              </p>
                              <div className="mt-1 text-sm text-gray-600">
                                Status: {visa.status}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-x-5 text-xs text-gray-500">
                                <span>Applied: {visa.appliedDate}</span>
                                <span>Decision: {visa.decisionDate}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit("visa", visa)}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete("visa", visa.id)}
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "visa" && (
                    <div className="mt-10 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-semibold mb-5">
                        {editing.item ? "Edit Visa Case" : "Add New Visa Case"}
                      </h3>
                      <VisaCaseForm
                        initialData={editing.item}
                        onSuccess={(data) => handleFormSuccess("visa", data)}
                        onCancel={handleFormCancel}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Documents
                    </h2>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm">
                      <Plus size={16} /> Upload Document
                    </button>
                  </div>

                  {documents.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed border-gray-300">
                      No documents uploaded yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* render documents here when you implement upload */}
                    </div>
                  )}
                </div>
              )}

              {/* DEADLINES */}
              {activeTab === "deadlines" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Deadlines
                    </h2>
                    <button
                      onClick={() => startEdit("deadlines")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                    >
                      <Plus size={16} /> Add Deadline
                    </button>
                  </div>

                  {deadlines.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed">
                      No deadlines added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deadlines.map((dl) => (
                        <div
                          key={dl.id}
                          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-5 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {dl.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {dl.description}
                              </p>
                              <p className="mt-2 text-sm text-red-600 font-medium">
                                Due: {dl.date}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit("deadlines", dl)}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete("deadlines", dl.id)}
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "deadlines" && (
                    <div className="mt-10 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-semibold mb-5">
                        {editing.item ? "Edit Deadline" : "Add New Deadline"}
                      </h3>
                      <DeadlineForm
                        initialData={editing.item}
                        onSuccess={(data) =>
                          handleFormSuccess("deadlines", data)
                        }
                        onCancel={handleFormCancel}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVITY */}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Activity Timeline
                  </h2>

                  {activities.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                      No activity recorded yet
                    </div>
                  ) : (
                    <div className="space-y-8 relative pl-8 before:absolute before:left-3.5 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-200">
                      {activities.map((act) => (
                        <div key={act.id} className="relative flex gap-4">
                          <div
                            className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                              act.type === "application"
                                ? "bg-green-100 text-green-600"
                                : act.type === "visa"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <CheckCircle2 size={16} />
                          </div>
                          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <p className="font-medium text-gray-900">
                              {act.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-1.5">
                              {act.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Notes
                    </h2>
                    <button
                      onClick={() => startEdit("notes")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
                    >
                      <Plus size={16} /> Add Note
                    </button>
                  </div>

                  {notes.length === 0 ? (
                    <div className="py-12 text-center text-gray-500 bg-gray-50/50 rounded-xl border border-dashed">
                      No notes added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-5 transition"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {note.title}
                              </p>
                              <p className="text-gray-700 mt-2 whitespace-pre-line">
                                {note.content}
                              </p>
                              <p className="mt-3 text-xs text-gray-500">
                                Added: {note.date}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => startEdit("notes", note)}
                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete("notes", note.id)}
                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "notes" && (
                    <div className="mt-10 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-semibold mb-5">
                        {editing.item ? "Edit Note" : "Add New Note"}
                      </h3>
                      <NotesForm
                        initialData={editing.item}
                        onSuccess={(data) => handleFormSuccess("notes", data)}
                        onCancel={handleFormCancel}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
