"use client";

/**
 * app/dashboard/org-admin/students/[id]/page.jsx
 *
 * Student detail view for the Org Admin.
 *
 * FIX: The previous version hijacked counselor/super-admin Redux slices
 * (fetchApplicationById → /api/admin/applications/:id,
 *  fetchStudentProfile  → /api/profile/:id)
 * which the org-admin JWT cannot access → 404 on every call → all N/A.
 *
 * This version calls the single org-admin endpoint:
 *   GET /api/org-admin/students/:id   (Lead._id, scoped by adminId)
 * which returns { student, profile, application, deadlines, recentActivity }.
 * Everything is sourced from that one response — no counselor slices touched.
 */

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import DocumentsTab from "@/components/counselorApplicationDetail/documents/DocumentsTab";
import NotesTab from "@/components/counselorApplicationDetail/notes/NotesTab";
import DeadlinesTab from "@/components/counselorApplicationDetail/deadlines/DeadlinesTab";
import ApplicationsTab from "@/components/counselorApplicationDetail/applications/ApplicationsTab";
import VisaTab from "@/components/counselorApplicationDetail/visa/VisaTab";
import ActivityTab from "@/components/counselorApplicationDetail/activity/ActivityTab";
import StatusTimeline from "@/components/counselorApplicationDetail/shared/StatusTimeline";
import PageHeader from "@/components/counselorApplicationDetail/shared/PageHeader";
import TabsBar from "@/components/counselorApplicationDetail/shared/TabsBar";

import {
  ArrowLeft,
  FileText,
  Lock,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Activity,
  AlertCircle,
  Eye,
  Loader2,
  Plane,
  ClipboardList,
  CalendarClock,
} from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrgAdminStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id; // Lead._id — set by the students list page

  // ── Local state (all data comes from one API call) ─────────────────────────
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // The three data buckets the backend returns
  const [student, setStudent] = useState(null); // Lead doc
  const [profile, setProfile] = useState(null); // UserProfile doc (may be null)
  const [application, setApplication] = useState(null); // Application doc (may be null)
  const [deadlines, setDeadlines] = useState([]);
  const [activities, setActivities] = useState([]);

  // Notes (fetched separately after we have a student)
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [visibleToStudent, setVisibleToStudent] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [savingDeadline, setSavingDeadline] = useState(false);
  const [savingApplication, setSavingApplication] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");

  // ── Fetch student detail from org-admin endpoint ───────────────────────────
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setNotFound(false);

    fetch(`${BASE}/api/org-admin/students/${id}`, { credentials: "include" })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (!data.success) {
          setNotFound(true);
          return;
        }

        const { student, profile, application, deadlines, recentActivity } =
          data.data;

        setStudent(student || null);
        setProfile(profile || null);
        setApplication(application || null);
        setDeadlines(deadlines || []);
        setActivities(recentActivity || []);
      })
      .catch((err) => {
        console.error("[OrgAdminStudentDetail] fetch error:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Notes (keyed off application._id) ─────────────────────────────────────
  const fetchNotes = useCallback(async () => {
    if (!application?._id) return;
    try {
      setLoadingNotes(true);
      const res = await fetch(`${BASE}/user/admin/notes/${application._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotes(false);
    }
  }, [application?._id]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ── Note handlers ──────────────────────────────────────────────────────────
  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !noteMessage.trim()) return;
    if (!application?._id) return;
    try {
      setSavingNote(true);
      const res = await fetch(`${BASE}/user/admin/notes`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student: student?.user || null,
          application: application._id,
          title: noteTitle,
          message: noteMessage,
          category: "application",
          isVisibleToStudent: visibleToStudent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNoteTitle("");
        setNoteMessage("");
        setVisibleToStudent(false);
        await fetchNotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteMessage(note.message);
    setVisibleToStudent(note.isVisibleToStudent);
  };

  const handleUpdateNote = async () => {
    try {
      setSavingNote(true);
      const res = await fetch(`${BASE}/user/admin/notes/${editingNote._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle,
          message: noteMessage,
          isVisibleToStudent: visibleToStudent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingNote(null);
        setNoteTitle("");
        setNoteMessage("");
        setVisibleToStudent(false);
        await fetchNotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(`${BASE}/user/admin/notes/${noteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      await fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Deadline handlers ──────────────────────────────────────────────────────
  const handleCreateDeadline = async (payload) => {
    if (!student?.user) return;
    try {
      setSavingDeadline(true);
      const res = await fetch(`${BASE}/user/admin/deadlines`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student: student.user, ...payload }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to create deadline");
        return;
      }
      setDeadlines((prev) => [...prev, data.deadline]);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingDeadline(false);
    }
  };

  const handleToggleDeadline = async (deadlineId) => {
    try {
      const current = deadlines.find((d) => d._id === deadlineId);
      if (!current) return;
      const newStatus =
        current.status === "completed" ? "pending" : "completed";
      const res = await fetch(`${BASE}/user/admin/deadline/${deadlineId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date() : null,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to update deadline");
        return;
      }
      setDeadlines((prev) =>
        prev.map((d) =>
          d._id === deadlineId
            ? {
                ...d,
                status: newStatus,
                completedAt: newStatus === "completed" ? new Date() : null,
              }
            : d,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDeadline = async (deadlineId) => {
    try {
      await fetch(`${BASE}/user/admin/deadline/${deadlineId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setDeadlines((prev) => prev.filter((d) => d._id !== deadlineId));
    } catch (err) {
      console.error(err);
    }
  };

  // ── Application handlers ───────────────────────────────────────────────────
  const handleCreateApplication = async (payload) => {
    if (!student?.user) return;
    try {
      setSavingApplication(true);
      const res = await fetch(`${BASE}/api/admin/applications`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, userId: student.user }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setApplication(data.application);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingApplication(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await fetch(`${BASE}/api/admin/applications/${applicationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setApplication(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateApplication = async (applicationId, payload) => {
    try {
      const res = await fetch(
        `${BASE}/api/admin/applications/${applicationId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (data.application) setApplication(data.application);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    let payload = {};
    switch (status) {
      case "offer_received":
        payload = { workflow: { offerReceived: true } };
        break;
      case "visa_process":
        payload = { workflow: { visaApplied: true } };
        break;
      case "enrolled":
        payload = { workflow: { visaApproved: true } };
        break;
      case "lost":
        payload = { isRejected: true };
        break;
      default:
        return;
    }
    await handleUpdateApplication(applicationId, payload);
  };

  // ── Derived values for UI components ──────────────────────────────────────
  // Build the "application" shape that PageHeader / StatusTimeline expect
  const appShell = {
    _id: application?._id || id,
    appId: application?._id || "N/A",
    status: student?.counselorStage || "lead",
    processor: "Not Assigned",
    managedBy: "",
    avatarColor: "from-indigo-500 to-purple-600",
    avatar: student?.name?.slice(0, 2)?.toUpperCase() || "??",
    student: {
      _id: student?.user || id,
      userId: student?.user || id,
      name: student?.name || "",
      email: student?.email || "",
    },
  };

  // "profile" shape that PageHeader expects (reads fullName, email, phone,
  // preferredCountry, intendedIntake, createdAt, updatedAt)
  // If a UserProfile doc exists use it; otherwise synthesise from Lead fields.
  const profileShape = profile
    ? profile
    : student
      ? {
          fullName: student.name || "",
          email: student.email || "",
          phone: student.phone || "",
          preferredCountry: student.preferredCountry || "",
          intendedIntake: student.preferredIntake || "",
          nationality: "",
          passportNumber: "",
          createdAt: student.createdAt,
          updatedAt: student.updatedAt,
        }
      : null;

  // "overviewApplication" shape that TabsBar/Overview tab expects.
  // The backend now returns application.university.{ name, country } via
  // aggregation — same shape as /api/admin/applications/:id.
  const overviewApplication = application
    ? {
        appId: application._id || "N/A",
        university: application.university?.name || "N/A",
        country: application.university?.country || "N/A",
        course: application.programPreference?.field || "N/A",
        intake: application.programPreference?.intake || "N/A",
        processor: "Not Assigned",
      }
    : null;

  // Document helpers (from deadlines with uploaded docs)
  const transformDeadlineDocs = (list = []) =>
    list.map((d) => ({
      id: d._id,
      name: d.uploadedDocument?.fileName || d.title,
      size: d.uploadedDocument?.size
        ? `${(d.uploadedDocument.size / 1024 / 1024).toFixed(1)} MB`
        : "N/A",
      uploadedAt: new Date(d.uploadedDocument?.uploadedAt).toLocaleDateString(),
      url: d.uploadedDocument?.url,
      type: d.requiredDocumentType,
      deadlineTitle: d.title,
      category: d.category,
      createdByType: d.createdByType,
    }));

  const withDoc = (cat) =>
    deadlines.filter((d) => d.category === cat && d.uploadedDocument?.url);

  const applicationDocuments = transformDeadlineDocs(withDoc("document"));
  const visaDocuments = transformDeadlineDocs(withDoc("visa"));
  const financialDocuments = transformDeadlineDocs(withDoc("financial"));

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "overview", label: "Overview", icon: Eye },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "deadlines", label: "Deadlines", icon: CalendarClock },
    { key: "applications", label: "Applications", icon: ClipboardList },
    { key: "visa", label: "Visa", icon: Plane },
    { key: "notes", label: "Notes", icon: MessageSquare },
    { key: "finance", label: "Finance", icon: FileText },
    { key: "activity", label: "Activity", icon: Activity },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading student details…</span>
        </div>
      </div>
    );
  }

  if (notFound || !student) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Student not found.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-indigo-600 text-sm font-semibold hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />{" "}
          Back to Students
        </button>

        {/* ── Header Card ── */}
        <PageHeader
          application={appShell}
          profile={profileShape}
          isKhizarManaged={false}
        />

        {/* ── Status Timeline Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-800">
              Application Timeline
            </h2>
          </div>
          <StatusTimeline currentStatus={appShell.status} />
        </motion.div>

        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          leadId={id}
          application={appShell}
          profile={profileShape}
          overviewApplication={overviewApplication}
          applicationDocuments={applicationDocuments}
          visaDocuments={visaDocuments}
          financialDocuments={financialDocuments}
          notes={notes}
          noteTitle={noteTitle}
          setNoteTitle={setNoteTitle}
          noteMessage={noteMessage}
          setNoteMessage={setNoteMessage}
          visibleToStudent={visibleToStudent}
          setVisibleToStudent={setVisibleToStudent}
          handleCreateNote={handleCreateNote}
          loadingNotes={loadingNotes}
          savingNote={savingNote}
          deadlines={deadlines}
          savingDeadline={savingDeadline}
          handleCreateDeadline={handleCreateDeadline}
          handleToggleDeadline={handleToggleDeadline}
          handleDeleteDeadline={handleDeleteDeadline}
          applications={application ? [application] : []}
          savingApplication={savingApplication}
          handleCreateApplication={handleCreateApplication}
          handleDeleteApplication={handleDeleteApplication}
          handleUpdateApplicationStatus={handleUpdateApplicationStatus}
          handleUpdateApplication={handleUpdateApplication}
          editingNote={editingNote}
          handleUpdateNote={handleUpdateNote}
          handleEditNote={handleEditNote}
          handleDeleteNote={handleDeleteNote}
          activities={activities}
          loadingActivities={false}
        />
      </main>
    </div>
  );
}
