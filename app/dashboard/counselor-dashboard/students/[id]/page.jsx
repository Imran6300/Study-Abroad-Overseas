"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DocumentsTab from "@/components/counselorApplicationDetail/documents/DocumentsTab";
import NotesTab from "@/components/counselorApplicationDetail/notes/NotesTab";
import DeadlinesTab from "@/components/counselorApplicationDetail/deadlines/DeadlinesTab";
import ApplicationsTab from "@/components/counselorApplicationDetail/applications/ApplicationsTab";
import VisaTab from "@/components/counselorApplicationDetail/visa/VisaTab";
import ActivityTab from "@/components/counselorApplicationDetail/activity/ActivityTab";
import StatusTimeline from "@/components/counselorApplicationDetail/shared/StatusTimeline";
import PageHeader from "@/components/counselorApplicationDetail/shared/PageHeader";
import TabsBar from "@/components/counselorApplicationDetail/shared/TabsBar";

//redux

import { useDispatch, useSelector } from "react-redux";
import { fetchStudentProfile, resetProfile } from "@/store/profileSlice";
import {
  fetchStudentApplications,
  createStudentApplication,
  deleteStudentApplication,
  updateApplicationStatus,
  resetApplications,
} from "@/store/applicationSlice";
import { fetchStudentDeadlines, resetDeadlines } from "@/store/deadlineSlice";

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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KhizarApplicationDetailPage() {
  const dispatch = useDispatch();

  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profile,
  );

  const {
    applications,
    loading: applicationsLoading,
    saving: savingApplication,
    updateStudentApplication,
  } = useSelector((state) => state.applications);

  const { studentDeadlines } = useSelector((state) => state.deadline);
  console.log("studentDeadlines", studentDeadlines);
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [visibleToStudent, setVisibleToStudent] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [deadlines, setDeadlines] = useState([]);
  const [loadingDeadlines, setLoadingDeadlines] = useState(false);
  const [savingDeadline, setSavingDeadline] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/notes/${id}`,
        { credentials: "include" },
      );
      const data = await res.json();
      if (data.success) setNotes(data.notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleCreateNote = async () => {
    try {
      if (!noteTitle.trim() || !noteMessage.trim()) return;
      if (!application?.student?._id) return;
      setSavingNote(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/notes`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: application.student._id,
            application: application._id,
            title: noteTitle,
            message: noteMessage,
            category: "application",
            isVisibleToStudent: visibleToStudent,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setNoteTitle("");
        setNoteMessage("");
        setVisibleToStudent(false);
        fetchNotes();
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

  const handleCreateDeadline = async (payload) => {
    try {
      if (!application?.student?._id) return;
      setSavingDeadline(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/deadlines`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            student: application.student._id,
            ...payload,
          }),
        },
      );

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

  const handleUpdateNote = async () => {
    try {
      setSavingNote(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/notes/${editingNote._id}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: noteTitle,

            message: noteMessage,

            isVisibleToStudent: visibleToStudent,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setEditingNote(null);

        setNoteTitle("");

        setNoteMessage("");

        setVisibleToStudent(false);

        fetchNotes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/notes/${noteId}`,
        {
          method: "DELETE",

          credentials: "include",
        },
      );

      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };
  const handleCreateApplication = async (payload) => {
    await dispatch(
      createStudentApplication({
        studentId: application.student.userId,
        payload,
      }),
    );
  };

  const handleDeleteApplication = async (applicationId) => {
    await dispatch(deleteStudentApplication(applicationId));
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    await dispatch(
      updateApplicationStatus({
        applicationId,
        status,
      }),
    );
  };

  const handleUpdateApplication = async (applicationId, payload) => {
    await dispatch(
      updateStudentApplication({
        applicationId,
        payload,
      }),
    );
  };

  const handleToggleDeadline = async (deadlineId) => {
    try {
      const updated = deadlines.map((d) =>
        d._id === deadlineId ? { ...d, completed: !d.completed } : d,
      );

      setDeadlines(updated);

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/deadline/${deadlineId}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            completed: !deadlines.find((d) => d._id === deadlineId)?.completed,
          }),
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDeadline = async (deadlineId) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/deadline/${deadlineId}`,
        {
          method: "DELETE",

          credentials: "include",
        },
      );

      setDeadlines((prev) => prev.filter((d) => d._id !== deadlineId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (studentDeadlines) {
      setDeadlines(studentDeadlines);
    }
  }, [studentDeadlines]);

  // AFTER (real API)
  useEffect(() => {
    const loadApplication = async () => {
      try {
        setLoading(true);

        setApplication(null); // clear page state
        dispatch(resetProfile()); // clear old student profile
        dispatch(resetApplications()); // clear old applications list
        dispatch(resetDeadlines());
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/applications/${id}`,
          { credentials: "include" },
        );
        const data = await res.json();

        console.log("API response:", data);

        if (data.success) {
          // API returns { success: true, applications: [...] }
          // Use the first application for page-level data, or a fallback object
          const firstApp = data.applications?.[0] || null;

          // Build a safe application object whether or not array is empty
          const appData = firstApp
            ? {
                _id: firstApp._id,
                appId: firstApp.appId || firstApp._id,

                student:
                  typeof firstApp.student === "object"
                    ? firstApp.student
                    : {
                        _id: firstApp.student || id,
                        userId: firstApp.student || id,
                      },

                status: firstApp.status || "Submitted",
                managedBy: firstApp.managedBy || "",
                processor: firstApp.processor || "Not Assigned",
                offerLetters: firstApp.offerLetters || [],
                activityLog: firstApp.activityLog || [],
                documents: firstApp.documents || [],
              }
            : {
                // Safe empty shell — page renders, nothing crashes
                _id: id,
                appId: "N/A",
                student: { _id: id, userId: id },
                status: "Submitted",
                managedBy: "",
                processor: "Not Assigned",
                offerLetters: [],
                activityLog: [],
                documents: [],
              };

          setApplication(appData);

          const userId =
            firstApp?.student?.userId || firstApp?.student?._id || id; // fallback to url id

          dispatch(fetchStudentProfile(userId));
          dispatch(fetchStudentApplications(userId));
          dispatch(fetchStudentDeadlines(userId));
          fetchNotes();
        } else {
          setApplication(null);
        }
      } catch (err) {
        console.error("Failed to load application:", err);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading application…</span>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Application not found.</p>
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

  const isKhizarManaged = application.managedBy === "khizar";

  const tabs = [
    { key: "overview", label: "Overview", icon: Eye },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "deadlines", label: "Deadlines", icon: CalendarClock },
    { key: "applications", label: "Applications", icon: ClipboardList },
    { key: "visa", label: "Visa", icon: Plane },
    { key: "notes", label: "Notes", icon: MessageSquare },
    { key: "activity", label: "Activity", icon: Activity },
  ];

  const overviewApplication =
    applications?.length > 0
      ? {
          appId: applications[0]?._id || "N/A",

          university: applications[0]?.university?.name || "N/A",

          country: applications[0]?.university?.country || "N/A",

          course: applications[0]?.programPreference?.field || "N/A",

          intake: applications[0]?.programPreference?.intake || "N/A",

          processor: "Not Assigned",
        }
      : null;

  const transformDeadlineDocs = (deadlines = []) => {
    return deadlines.map((deadline) => ({
      id: deadline._id,

      name: deadline.uploadedDocument?.fileName || deadline.title,

      size: deadline.uploadedDocument?.size
        ? `${(deadline.uploadedDocument.size / 1024 / 1024).toFixed(1)} MB`
        : "N/A",

      uploadedAt: new Date(
        deadline.uploadedDocument?.uploadedAt,
      ).toLocaleDateString(),

      url: deadline.uploadedDocument?.url,

      type: deadline.requiredDocumentType,

      deadlineTitle: deadline.title,

      category: deadline.category,
    }));
  };

  const applicationDocuments = transformDeadlineDocs(
    studentDeadlines?.filter(
      (deadline) =>
        deadline.category === "document" && deadline.uploadedDocument?.url,
    ),
  );
  const visaDocuments = transformDeadlineDocs(
    studentDeadlines?.filter(
      (deadline) =>
        deadline.category === "visa" && deadline.uploadedDocument?.url,
    ),
  );
  const financialDocuments = transformDeadlineDocs(
    studentDeadlines?.filter(
      (deadline) =>
        deadline.category === "financial" && deadline.uploadedDocument?.url,
    ),
  );

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
          Back to Applications
        </button>

        {/* ── Header Card ── */}
        <PageHeader
          application={application}
          profile={profile}
          isKhizarManaged={isKhizarManaged}
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
            {isKhizarManaged && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                <Lock size={11} />
                Status locked — updated by Khizar team only
              </div>
            )}
          </div>
          <StatusTimeline currentStatus={application.status} />
        </motion.div>
        <TabsBar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          application={application}
          profile={profile}
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
          applications={applications}
          savingApplication={savingApplication}
          handleCreateApplication={handleCreateApplication}
          handleDeleteApplication={handleDeleteApplication}
          handleUpdateApplicationStatus={handleUpdateApplicationStatus}
          handleUpdateApplication={handleUpdateApplication}
          editingNote={editingNote}
          handleUpdateNote={handleUpdateNote}
          handleEditNote={handleEditNote}
          handleDeleteNote={handleDeleteNote}
        />
      </main>
    </div>
  );
}
