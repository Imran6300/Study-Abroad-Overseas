"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Unlock,
  Download,
  Upload,
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Hash,
  Building2,
  MapPin,
  MessageSquare,
  Activity,
  Shield,
  Send,
  Star,
  ChevronRight,
  AlertCircle,
  Eye,
  Loader2,
  GraduationCap,
  Briefcase,
  Bell,
  Pencil,
  Check,
  X,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockApplicationDetail = {
  id: 1,
  appId: "KHZ-2026-0001",
  student: {
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
  documents: [
    {
      id: "doc1",
      name: "Passport Copy",
      type: "passport",
      uploadedAt: "2026-05-10",
      size: "1.2 MB",
      status: "verified",
    },
    {
      id: "doc2",
      name: "Academic Transcripts",
      type: "transcripts",
      uploadedAt: "2026-05-10",
      size: "3.4 MB",
      status: "verified",
    },
    {
      id: "doc3",
      name: "IELTS Score Report",
      type: "englishReport",
      uploadedAt: "2026-05-11",
      size: "0.8 MB",
      status: "pending",
    },
    {
      id: "doc4",
      name: "Statement of Purpose",
      type: "sop",
      uploadedAt: "2026-05-11",
      size: "0.5 MB",
      status: "reviewing",
    },
  ],
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

const TIMELINE_STEPS = [
  { key: "Submitted to Khizar", label: "Submitted", icon: Send },
  { key: "Documents Reviewing", label: "Doc Reviewing", icon: FileText },
  { key: "University Applied", label: "Uni Applied", icon: Building2 },
  { key: "Offer Received", label: "Offer Received", icon: Star },
  { key: "Visa Processing", label: "Visa Processing", icon: Shield },
  { key: "Visa Approved", label: "Visa Approved", icon: CheckCircle2 },
  { key: "Completed", label: "Completed", icon: Check },
];

const statusOrder = TIMELINE_STEPS.map((s) => s.key);

const docStatusConfig = {
  verified: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    label: "Verified",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Pending",
  },
  reviewing: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Reviewing",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    label: "Rejected",
  },
};

const activityTypeConfig = {
  submitted: { bg: "bg-indigo-100", icon: Send, color: "text-indigo-600" },
  assigned: { bg: "bg-blue-100", icon: User, color: "text-blue-600" },
  documents: {
    bg: "bg-emerald-100",
    icon: FileText,
    color: "text-emerald-600",
  },
  status: { bg: "bg-violet-100", icon: Activity, color: "text-violet-600" },
  note: { bg: "bg-amber-100", icon: MessageSquare, color: "text-amber-600" },
  visa: { bg: "bg-teal-100", icon: Shield, color: "text-teal-600" },
};

// ─── Status Timeline ──────────────────────────────────────────────────────────
function StatusTimeline({ currentStatus }) {
  const currentIdx = statusOrder.indexOf(currentStatus);
  return (
    <div className="relative">
      {/* Desktop horizontal */}
      <div className="hidden md:flex items-center">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    active
                      ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200"
                      : done
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-white border-slate-200"
                  }`}
                >
                  <Icon
                    size={15}
                    className={done || active ? "text-white" : "text-slate-400"}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-bold text-center leading-tight whitespace-nowrap ${active ? "text-indigo-600" : done ? "text-emerald-600" : "text-slate-400"}`}
                >
                  {step.label}
                </span>
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mb-5 rounded-full transition-all ${i < currentIdx ? "bg-emerald-400" : "bg-slate-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile vertical */}
      <div className="md:hidden space-y-4 relative pl-8 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {TIMELINE_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative flex items-center gap-3">
              <div
                className={`absolute -left-8 w-8 h-8 rounded-full border-2 flex items-center justify-center ${active ? "bg-indigo-600 border-indigo-600" : done ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"}`}
              >
                <Icon
                  size={13}
                  className={done || active ? "text-white" : "text-slate-400"}
                />
              </div>
              <span
                className={`text-sm font-semibold ${active ? "text-indigo-600" : done ? "text-emerald-600" : "text-slate-400"}`}
              >
                {step.label}
              </span>
              {active && (
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────
function DocumentCard({ doc }) {
  const sc = docStatusConfig[doc.status] || docStatusConfig.pending;
  return (
    <div className="flex items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
          <FileText size={16} className="text-slate-500" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {doc.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {doc.uploadedAt} · {doc.size}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}
        >
          {sc.label}
        </span>
        <button
          className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center transition-all"
          title="Download"
        >
          <Download size={13} className="text-indigo-600" />
        </button>
      </div>
    </div>
  );
}

// ─── Activity item ────────────────────────────────────────────────────────────
function ActivityItem({ item }) {
  const cfg = activityTypeConfig[item.type] || activityTypeConfig.status;
  const Icon = cfg.icon;
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div
        className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center z-10 shrink-0`}
      >
        <Icon size={14} className={cfg.color} />
      </div>
      <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-800">{item.message}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-slate-400">{item.timestamp}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs font-semibold text-slate-500">
            {item.by}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KhizarApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [counselorNote, setCounselorNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    // In real app: fetch from API
    setTimeout(() => {
      setApplication(mockApplicationDetail);
      setCounselorNote(mockApplicationDetail.counselorNotes);
      setLoading(false);
    }, 600);
  }, [id]);

  const handleSaveNote = async () => {
    setSavingNote(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSavingNote(false);
    // TODO: API call to save note
  };

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
  const currentStepIdx = statusOrder.indexOf(application.status);

  const tabs = [
    { key: "overview", label: "Overview", icon: Eye },
    { key: "documents", label: "Documents", icon: FileText },
    { key: "notes", label: "Notes", icon: MessageSquare },
    { key: "activity", label: "Activity", icon: Activity },
  ];

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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${application.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0`}
              >
                {application.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {application.student.name}
                  </h1>
                  <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                    {application.appId}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail size={13} />
                    {application.student.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} />
                    {application.student.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {application.student.currentCity}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {application.status}
                  </span>
                  {isKhizarManaged && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Lock size={10} />
                      Managed by Khizar Overseas
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    <User size={10} />
                    Processor: {application.processor}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-slate-500 shrink-0">
              <p>
                Created:{" "}
                <span className="font-semibold text-slate-700">
                  {application.createdAt}
                </span>
              </p>
              <p className="mt-1">
                Updated:{" "}
                <span className="font-semibold text-slate-700">
                  {application.updatedAt}
                </span>
              </p>
              <p className="mt-1">
                University:{" "}
                <span className="font-semibold text-slate-700">
                  {application.university}
                </span>
              </p>
              <p className="mt-1">
                Intake:{" "}
                <span className="font-semibold text-slate-700">
                  {application.intake}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

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

        {/* ── Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="border-b border-slate-100">
            <div className="flex overflow-x-auto px-4 sm:px-6 pt-4 gap-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`group relative pb-4 px-3 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <Icon
                      size={15}
                      className={
                        isActive
                          ? "text-indigo-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="appTabIndicator"
                        className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4">
                    Student Details
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Full Name",
                        value: application.student.name,
                        icon: User,
                      },
                      {
                        label: "Email",
                        value: application.student.email,
                        icon: Mail,
                      },
                      {
                        label: "Phone",
                        value: application.student.phone,
                        icon: Phone,
                      },
                      {
                        label: "Nationality",
                        value: application.student.nationality,
                        icon: Globe,
                      },
                      {
                        label: "Passport No.",
                        value: application.student.passportNo,
                        icon: Shield,
                      },
                      {
                        label: "Location",
                        value: application.student.currentCity,
                        icon: MapPin,
                      },
                    ].map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 py-2.5 px-3 bg-slate-50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <Icon size={13} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4">
                    Application Details
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Application ID",
                        value: application.appId,
                        icon: Hash,
                      },
                      {
                        label: "University",
                        value: application.university,
                        icon: Building2,
                      },
                      {
                        label: "Country",
                        value: application.country,
                        icon: MapPin,
                      },
                      {
                        label: "Course",
                        value: application.course,
                        icon: GraduationCap,
                      },
                      {
                        label: "Intake",
                        value: application.intake,
                        icon: Calendar,
                      },
                      {
                        label: "Processor",
                        value: application.processor,
                        icon: Briefcase,
                      },
                    ].map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="flex items-center gap-3 py-2.5 px-3 bg-slate-50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <Icon size={13} className="text-slate-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-slate-700">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── DOCUMENTS ── */}
            {activeTab === "documents" && (
              <div className="space-y-8">
                {/* Application Documents */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <FileText size={15} className="text-indigo-500" />{" "}
                    Application Documents
                    <span className="text-xs text-slate-400 font-normal">
                      ({application.documents.length} files)
                    </span>
                  </h3>
                  {application.documents.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                      No documents uploaded yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {application.documents.map((doc) => (
                        <DocumentCard key={doc.id} doc={doc} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Offer Letters */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Star size={15} className="text-amber-500" /> Offer Letters
                    <span className="text-xs text-slate-400 font-normal">
                      ({application.offerLetters.length} files)
                    </span>
                  </h3>
                  <div className="py-10 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                    Offer letters will appear here when uploaded by Khizar team.
                  </div>
                </div>

                {/* Visa Files */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Shield size={15} className="text-teal-500" /> Visa
                    Documents
                    <span className="text-xs text-slate-400 font-normal">
                      ({application.visaFiles.length} files)
                    </span>
                  </h3>
                  <div className="py-10 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                    Visa documents will appear here once processing begins.
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTES ── */}
            {activeTab === "notes" && (
              <div className="space-y-6">
                {/* Counselor Notes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <MessageSquare size={15} className="text-indigo-500" />{" "}
                      Your Notes
                    </h3>
                  </div>
                  <textarea
                    rows={5}
                    value={counselorNote}
                    onChange={(e) => setCounselorNote(e.target.value)}
                    placeholder="Add notes about this student or application..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleSaveNote}
                      disabled={savingNote}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all disabled:opacity-70"
                    >
                      {savingNote ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          Save Notes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Processor Notes — read-only */}
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <MessageSquare size={15} className="text-violet-500" />{" "}
                    Processor Notes
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                      Read only
                    </span>
                  </h3>
                  <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                    {application.processorNotes ? (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {application.processorNotes}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        No processor notes yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── ACTIVITY ── */}
            {activeTab === "activity" && (
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <Activity size={15} className="text-indigo-500" /> Activity
                  Log
                </h3>
                {application.activityLog.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    No activity recorded yet.
                  </div>
                ) : (
                  <div className="relative pl-10 before:absolute before:left-4 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100">
                    {application.activityLog.map((item) => (
                      <ActivityItem key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
