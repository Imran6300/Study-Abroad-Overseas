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
import { fetchStudentProfile } from "@/store/profileSlice";
import { fetchStudentApplications } from "@/store/applicationSlice";
import { fetchStudentDeadlines } from "@/store/deadlineSlice";

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

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockApplicationDetail = {
  id: 1,
  _id: "mock-application-id",
  appId: "KHZ-2026-0001",
  student: {
    _id: "mock-student-id",
    userId: "69b5b944b6d9180a3aad9cf9",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    nationality: "Indian",
    passportNo: "A1234567",
    currentCity: "Hyderabad, India",
  },
  university: "University of Toronto",
  country: "Canada",
  course: "Computer Science (MSc)",
  intake: "Fall 2026",
  status: "Documents Reviewing",
  managedBy: "khizar",
  processor: "Khizar Processing Team",
  createdAt: "2026-05-10",
  updatedAt: "2026-05-12",
  avatar: "RS",
  avatarColor: "from-violet-500 to-purple-600",
  documents: [],
  offerLetters: [],
  visaFiles: [],
  counselorNotes:
    "Student has a strong academic background. Education gap of 6 months due to family reasons. IELTS score of 7.0. Needs strong SOP to compensate for education gap.",
  processorNotes:
    "Initial documents reviewed. SOP needs revision. Will contact counselor for updated version.",
  activityLog: [
    {
      id: "act1",
      type: "submitted",
      message: "Application submitted to Khizar Overseas",
      by: "Counselor",
      timestamp: "2026-05-10 10:30 AM",
    },
    {
      id: "act2",
      type: "assigned",
      message: "Processor assigned: Khizar Processing Team",
      by: "System",
      timestamp: "2026-05-10 10:35 AM",
    },
    {
      id: "act3",
      type: "documents",
      message: "Passport and Transcripts uploaded",
      by: "Counselor",
      timestamp: "2026-05-10 11:00 AM",
    },
    {
      id: "act4",
      type: "status",
      message: "Status updated to Documents Reviewing",
      by: "Processor",
      timestamp: "2026-05-12 09:00 AM",
    },
    {
      id: "act5",
      type: "documents",
      message: "IELTS Report and SOP uploaded",
      by: "Counselor",
      timestamp: "2026-05-11 02:00 PM",
    },
  ],
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KhizarApplicationDetailPage() {
  const dispatch = useDispatch();

  const { profile, loading: profileLoading } = useSelector(
    (state) => state.profile,
  );
  const { applications, loading: applicationsLoading } = useSelector(
    (state) => state.applications,
  );

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

  useEffect(() => {
    setTimeout(async () => {
      setApplication(mockApplicationDetail);

      // FETCH PROFILE
      dispatch(fetchStudentProfile(mockApplicationDetail.student.userId));
      dispatch(fetchStudentApplications(mockApplicationDetail.student.userId));

      dispatch(fetchStudentDeadlines(mockApplicationDetail.student.userId));

      fetchNotes();

      setLoading(false);
    }, 600);
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
        />
      </main>
    </div>
  );
}
