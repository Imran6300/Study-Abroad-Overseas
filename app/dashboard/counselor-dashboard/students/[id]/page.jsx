"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import {
  fetchApplicationById,
  clearSelectedApplication,
} from "@/store/counselorSlice";

//redux

import { useDispatch, useSelector } from "react-redux";
import { fetchStudentProfile, resetProfile } from "@/store/profileSlice";
import {
  fetchStudentApplications,
  createStudentApplication,
  updateStudentApplication,
  deleteStudentApplication,
  updateApplicationStatus,
  resetApplications,
} from "@/store/applicationSlice";
import { fetchStudentDeadlines, resetDeadlines } from "@/store/deadlineSlice";
import { counselorApi } from "@/lib/counselorApi";

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

  const { selectedApplication, loadingApplication } = useSelector(
    (state) => state.counselor,
  );

  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profile,
  );

  const {
    applications,
    loading: applicationsLoading,
    saving: savingApplication,
  } = useSelector((state) => state.applications);

  const { studentDeadlines } = useSelector((state) => state.deadline);
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id;

  const [application, setApplication] = useState(null);
  // Supports deep-linking straight into a tab (e.g. a "Document Requested"
  // notification links to `?tab=documents` so the counselor lands right on
  // the upload option instead of the Overview tab).
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview",
  );

  useEffect(() => {
    const requestedTab = searchParams.get("tab");
    if (requestedTab) setActiveTab(requestedTab);
    // Only react to the URL changing — activeTab itself is user-controlled
    // afterwards via the tab bar, so it's intentionally left out below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [visibleToStudent, setVisibleToStudent] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [deadlines, setDeadlines] = useState([]);

  const [activities, setActivities] = useState([]);

  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingDeadlines, setLoadingDeadlines] = useState(false);
  const [savingDeadline, setSavingDeadline] = useState(false);

  // ── Lead record (always resolvable via leadId, whether or not the
  // student has created an account) — used to gate the user-account-only
  // data fetches below and to power the "no account yet" experience.
  const [leadRecord, setLeadRecord] = useState(null);
  const [loadingLeadRecord, setLoadingLeadRecord] = useState(true);
  const isRegistered = !!leadRecord?.user;
  // Most recent Khizar-managed application for this student, if the
  // counselor has ever submitted one through Khizar Overseas. Drives the
  // "Managed by Khizar" badge and the Processor pill so they always agree
  // with each other instead of showing contradictory info.
  const [khizarApp, setKhizarApp] = useState(null);

  const fetchNotes = async () => {
    // Wait until application is loaded
    if (!application?._id) return;
    try {
      setLoadingNotes(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/notes/${application._id}`, // ← use application._id, not id
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

  const fetchActivities = async (applicationId) => {
    try {
      setLoadingActivities(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/activity/application/${applicationId}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        setActivities(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    } finally {
      setLoadingActivities(false);
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
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/notes/${noteId}`,
        {
          method: "DELETE",

          credentials: "include",
        },
      );

      await fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };
  const handleCreateApplication = async (payload) => {
    const studentId =
      application.student._id || application.student.userId || id;

    await dispatch(
      createStudentApplication({
        studentId,
        payload,
      }),
    );

    // Re-fetch the fully-enriched list so university name, country, etc.
    // are populated immediately without requiring a page refresh.
    await dispatch(fetchStudentApplications(studentId));
  };

  const handleDeleteApplication = async (applicationId) => {
    await dispatch(deleteStudentApplication(applicationId));
  };

  const handleUpdateApplicationStatus = (applicationId, status) => {
    let payload = {};

    switch (status) {
      case "offer_received":
        payload = {
          workflow: {
            offerReceived: true,
          },
        };
        break;

      case "visa_process":
        payload = {
          workflow: {
            visaApplied: true,
          },
        };
        break;

      case "enrolled":
        payload = {
          workflow: {
            visaApproved: true,
          },
        };
        break;

      case "lost":
        payload = {
          isRejected: true,
        };
        break;

      default:
        return;
    }

    dispatch(
      updateApplicationStatus({
        applicationId,
        payload,
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
      const currentDeadline = deadlines.find((d) => d._id === deadlineId);

      if (!currentDeadline) return;

      const newStatus =
        currentDeadline.status === "completed" ? "pending" : "completed";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/admin/deadline/${deadlineId}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date() : null,
          }),
        },
      );

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
    if (application?._id) {
      fetchNotes();
    }
  }, [application?._id]);

  useEffect(() => {
    if (studentDeadlines) {
      setDeadlines(studentDeadlines);
    }
  }, [studentDeadlines]);

  // AFTER (real API)
  useEffect(() => {
    dispatch(resetProfile());
    dispatch(resetApplications());
    dispatch(resetDeadlines());
    dispatch(clearSelectedApplication());

    setLeadRecord(null);
    setLoadingLeadRecord(true);
    setKhizarApp(null);

    let cancelled = false;

    (async () => {
      try {
        // `id` here is always the leadId — works whether or not the
        // student has registered, since this endpoint is keyed on the Lead.
        const res = await counselorApi.getStudentDetail(id);
        if (cancelled) return;

        const lead = res?.data?.lead || null;
        setLeadRecord(lead);
        setKhizarApp(res?.data?.khizarApplication || null);

        // Only registered students have a User account to fetch
        // applications / profile / deadlines against.
        if (lead?.user) {
          dispatch(fetchApplicationById(lead.user));
        }
      } catch (err) {
        console.error("[fetchLeadRecord]", err);
      } finally {
        if (!cancelled) setLoadingLeadRecord(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, dispatch]);

  useEffect(() => {
    // A Khizar-managed application always overrides the regular
    // self-service Application's status for these two fields — Khizar
    // Overseas' own processing team owns the application the moment it's
    // submitted through that flow, regardless of what (if anything) the
    // student has going on in the self-service Application model.
    const khizarStatus = khizarApp
      ? { managedBy: "khizar", processor: "Khizar Overseas Team" }
      : null;

    // Student hasn't created an account yet — build a lead-only view and
    // skip the user-scoped fetches below (there's no User to fetch against).
    if (leadRecord && !leadRecord.user) {
      setApplication({
        _id: id,
        appId: "N/A",
        student: {
          _id: null,
          userId: null,
          name: leadRecord.name || "",
          email: leadRecord.email || "",
        },
        status: "Submitted",
        managedBy: khizarStatus?.managedBy || "",
        processor: khizarStatus?.processor || "Not Assigned",
        offerLetters: [],
        activityLog: [],
        documents: [],
      });
      return;
    }

    if (!selectedApplication) return;

    const firstApp = selectedApplication.applications?.[0] || null;
    const userId = leadRecord?.user || firstApp?.user?._id || id;

    const appData = firstApp
      ? {
          _id: firstApp._id,
          appId: firstApp.appId || firstApp._id,

          student: {
            _id: firstApp.user?._id || userId,
            userId: firstApp.user?._id || userId,
            name: firstApp.personalInfo?.fullName || firstApp.user?.name || "",
            email: firstApp.personalInfo?.email || firstApp.user?.email || "",
          },

          status: firstApp.status || "Submitted",

          managedBy: khizarStatus?.managedBy || firstApp.managedBy || "",

          processor:
            khizarStatus?.processor || firstApp.processor || "Not Assigned",

          offerLetters: firstApp.offerLetters || [],

          documents: firstApp.documents || [],
        }
      : {
          _id: userId,
          appId: "N/A",

          student: {
            _id: userId,
            userId: userId,
          },

          status: "Submitted",

          managedBy: khizarStatus?.managedBy || "",

          processor: khizarStatus?.processor || "Not Assigned",

          offerLetters: [],

          activityLog: [],

          documents: [],
        };

    setApplication(appData);

    dispatch(fetchStudentProfile(userId));
    dispatch(fetchStudentApplications(userId));
    dispatch(fetchStudentDeadlines(userId));

    if (appData?._id) {
      fetchActivities(appData._id);
    }
  }, [selectedApplication, leadRecord, khizarApp, dispatch, id]);

  if (loadingLeadRecord) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading student…</span>
        </div>
      </div>
    );
  }

  if (!leadRecord) {
    return (
      <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">
            Student not found or not assigned to you.
          </p>
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

  if (isRegistered && loadingApplication) {
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
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm font-medium">Loading student…</span>
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
    { key: "finance", label: "Finance", icon: FileText },
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

          processor: khizarApp
            ? "Khizar Overseas Team"
            : applications[0]?.processor || "Not Assigned",
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

      createdByType: deadline.createdByType,
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

        {/* ── No-account notice ── */}
        {!isRegistered && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">
                This student hasn't created an account yet.
              </span>{" "}
              Applications, Visa progress, and student-driven deadlines will
              become available once they register. In the meantime you can still
              add notes and upload documents on their behalf from the{" "}
              <span className="font-semibold">Documents</span> tab.
            </p>
          </div>
        )}

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
          leadId={id}
          isRegistered={isRegistered}
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
          activities={activities}
          loadingActivities={loadingActivities}
        />
      </main>
    </div>
  );
}
