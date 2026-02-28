"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import { useSelector } from "react-redux";
import AddApplicationForm from "@/components/adminform/addapplication";
import VisaCaseForm from "@/components/adminform/addvisa";
import DeadlineForm from "@/components/adminform/adddeadline";
import NotesForm from "@/components/adminform/addnotes";

// ────────────────────────────────────────────────
// Mock data – replace with real API data later
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
  const { id } = useParams();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const counselorName = user?.name || "Counselor";

  const [activeTab, setActiveTab] = useState("applications");

  // Lists state
  const [applications, setApplications] = useState(mockApplications);
  const [visas, setVisas] = useState(mockVisas);
  const [deadlines, setDeadlines] = useState(mockDeadlines);
  const [notes, setNotes] = useState(mockNotes);

  // Editing state: null = adding new, object = editing existing
  const [editing, setEditing] = useState(null); // { type: string, item: object | null }

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

    // Close form if we were editing the deleted item
    if (editing?.item?.id === itemId) {
      setEditing(null);
    }
  };

  const startEdit = (type, item = null) => {
    setEditing({ type, item });
  };

  const handleFormSuccess = (type, updatedItem) => {
    if (editing?.item) {
      // Update existing
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
      // Add new
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

    setEditing(null); // close form
  };

  const handleFormCancel = () => {
    setEditing(null);
  };

  const tabs = [
    { key: "applications", label: "Applications" },
    { key: "visa", label: "Visa" },
    { key: "deadlines", label: "Deadlines" },
    { key: "notes", label: "Notes" },
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <DashboardHeader
          title="Student Profile"
          counselorName={counselorName}
          btnName="Back"
          onButtonClick={() => router.push("/admin/students")}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto space-y-8">
          {/* Student Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {student.name}
                  </h2>
                  <p className="text-gray-500">{student.email}</p>
                  <p className="text-gray-500">{student.phone}</p>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  {student.status}
                </span>
                <div className="text-sm text-gray-500">
                  Target:{" "}
                  <span className="font-medium text-gray-800">
                    {student.target}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex gap-8 px-8 pt-6 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setEditing(null); // close any open form when switching tabs
                  }}
                  className={`relative pb-4 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-sky-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-sky-600"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* ───── APPLICATIONS ───── */}
              {activeTab === "applications" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Applications</h3>
                    <button
                      onClick={() => startEdit("applications")}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition"
                    >
                      + Add Application
                    </button>
                  </div>

                  {applications.length === 0 ? (
                    <p className="text-gray-500 py-4">
                      No applications added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div
                          key={app.id}
                          className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {app.program}
                            </p>
                            <p className="text-sm text-gray-600">
                              {app.university}
                            </p>
                            <div className="mt-1 text-xs text-gray-500 space-x-3">
                              <span>Status: {app.status}</span>
                              <span>Date: {app.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => startEdit("applications", app)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDelete("applications", app.id)
                              }
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "applications" && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-medium text-lg mb-4">
                        {editing.item
                          ? "Edit Application"
                          : "Add New Application"}
                      </h4>
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

              {/* ───── VISA ───── */}
              {activeTab === "visa" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Visa Cases</h3>
                    <button
                      onClick={() => startEdit("visa")}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition"
                    >
                      + Add Visa Case
                    </button>
                  </div>

                  {visas.length === 0 ? (
                    <p className="text-gray-500 py-4">
                      No visa cases added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {visas.map((visa) => (
                        <div
                          key={visa.id}
                          className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {visa.type}
                            </p>
                            <p className="text-sm text-gray-600">
                              Status: {visa.status}
                            </p>
                            <div className="mt-1 text-xs text-gray-500 space-x-3">
                              <span>Applied: {visa.appliedDate}</span>
                              <span>Decision: {visa.decisionDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => startEdit("visa", visa)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete("visa", visa.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "visa" && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-medium text-lg mb-4">
                        {editing.item ? "Edit Visa Case" : "Add New Visa Case"}
                      </h4>
                      <VisaCaseForm
                        initialData={editing.item}
                        onSuccess={(data) => handleFormSuccess("visa", data)}
                        onCancel={handleFormCancel}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ───── DEADLINES ───── */}
              {activeTab === "deadlines" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Deadlines</h3>
                    <button
                      onClick={() => startEdit("deadlines")}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition"
                    >
                      + Add Deadline
                    </button>
                  </div>

                  {deadlines.length === 0 ? (
                    <p className="text-gray-500 py-4">
                      No deadlines added yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {deadlines.map((dl) => (
                        <div
                          key={dl.id}
                          className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {dl.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {dl.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Due: {dl.date}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => startEdit("deadlines", dl)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete("deadlines", dl.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "deadlines" && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-medium text-lg mb-4">
                        {editing.item ? "Edit Deadline" : "Add New Deadline"}
                      </h4>
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

              {/* ───── NOTES ───── */}
              {activeTab === "notes" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Notes</h3>
                    <button
                      onClick={() => startEdit("notes")}
                      className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 transition"
                    >
                      + Add Note
                    </button>
                  </div>

                  {notes.length === 0 ? (
                    <p className="text-gray-500 py-4">No notes added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {note.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {note.content}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                              Date: {note.date}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => startEdit("notes", note)}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete("notes", note.id)}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editing?.type === "notes" && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-medium text-lg mb-4">
                        {editing.item ? "Edit Note" : "Add New Note"}
                      </h4>
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
