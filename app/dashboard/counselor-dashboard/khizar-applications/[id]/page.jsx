"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchKhizarApplicationById,
  getDocumentUrl,
  clearSelectedApplication,
  selectKhizarSelectedApplication,
  selectKhizarDetailLoading,
  selectDocumentUrls,
} from "@/store/KhizarApplicationslice";
import {
  ArrowLeft,
  Building2,
  Globe,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Download,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  documents_reviewing: {
    label: "Documents Reviewing",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  applied: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  offer_received: {
    label: "Offer Received",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  visa_processing: {
    label: "Visa Processing",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-400",
  },
  visa_approved: {
    label: "Visa Approved",
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-400",
  },
  enrolled: {
    label: "Enrolled",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-400",
  },
  on_hold: {
    label: "On Hold",
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
  withdrawn: {
    label: "Withdrawn",
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const PIPELINE_ORDER = [
  "documents_reviewing",
  "applied",
  "offer_received",
  "visa_processing",
  "visa_approved",
  "enrolled",
];

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || {
    label: status,
    bg: "bg-gray-50",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-36 shrink-0 pt-0.5">
        {label}
      </p>
      <p className="text-sm text-slate-700 font-medium">{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Icon size={15} className="text-indigo-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-3 border-t border-slate-100 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KhizarApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const application = useSelector(selectKhizarSelectedApplication);
  const loading = useSelector(selectKhizarDetailLoading);
  const documentUrls = useSelector(selectDocumentUrls);

  const [loadingDocIdx, setLoadingDocIdx] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchKhizarApplicationById(id));
    }
    return () => {
      dispatch(clearSelectedApplication());
    };
  }, [id, dispatch]);

  const handleViewDocument = async (index) => {
    const cacheKey = `${id}-${index}`;
    if (documentUrls[cacheKey]) {
      window.open(documentUrls[cacheKey], "_blank");
      return;
    }
    setLoadingDocIdx(index);
    const result = await dispatch(
      getDocumentUrl({ applicationId: id, documentIndex: index }),
    );
    setLoadingDocIdx(null);
    if (result.payload?.url) {
      window.open(result.payload.url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-slate-400">Loading application…</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Application not found.</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    studentInfo,
    academicInfo,
    testScores,
    preferences,
    counselorData,
    documents,
    statusHistory,
  } = application;
  const studentName =
    application.student?.name || studentInfo?.studentName || "Unknown";

  // Determine pipeline progress
  const currentIdx = PIPELINE_ORDER.indexOf(application.status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Applications</span>
          </button>
          <div className="flex items-center gap-2">
            <StatusBadge status={application.status} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
              <Lock size={9} /> Managed by Khizar
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {studentName}
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {application.student?.email || studentInfo?.email} · App ID:{" "}
                <span className="font-mono">{application._id?.slice(-10)}</span>
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                  <Building2 size={12} /> {application.universityName}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                  <Globe size={12} /> {application.country}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                  <BookOpen size={12} /> {application.course}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                  <Calendar size={12} /> {application.intake}
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p>
                Submitted{" "}
                {new Date(application.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              {application.studyLevel && (
                <p className="mt-1 font-medium text-slate-600">
                  {application.studyLevel}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Pipeline Progress */}
        {currentIdx !== -1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Application Progress
            </h3>
            <div className="flex items-center gap-0 overflow-x-auto pb-1">
              {PIPELINE_ORDER.map((stage, idx) => {
                const cfg = statusConfig[stage];
                const isCompleted = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          isCompleted
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : isCurrent
                              ? "bg-indigo-100 border-indigo-500 text-indigo-700 ring-4 ring-indigo-100"
                              : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <span
                        className={`text-[9px] font-bold text-center leading-tight ${
                          isCurrent
                            ? "text-indigo-700"
                            : isCompleted
                              ? "text-indigo-500"
                              : "text-slate-400"
                        }`}
                      >
                        {cfg.label.replace(" ", "\n")}
                      </span>
                    </div>
                    {idx < PIPELINE_ORDER.length - 1 && (
                      <div
                        className={`h-0.5 w-8 mx-1 flex-shrink-0 rounded-full ${idx < currentIdx ? "bg-indigo-500" : "bg-slate-200"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Info sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Section title="Student Information" icon={User}>
            <InfoRow label="Full Name" value={studentInfo?.studentName} />
            <InfoRow label="Email" value={studentInfo?.email} />
            <InfoRow label="Phone" value={studentInfo?.phone} />
            <InfoRow label="Date of Birth" value={studentInfo?.dob} />
            <InfoRow label="Gender" value={studentInfo?.gender} />
            <InfoRow label="Nationality" value={studentInfo?.nationality} />
            <InfoRow label="Passport No." value={studentInfo?.passportNo} />
            <InfoRow label="Current City" value={studentInfo?.currentCity} />
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Section
            title="Academic Information"
            icon={GraduationCap}
            defaultOpen={false}
          >
            <InfoRow
              label="Qualification"
              value={academicInfo?.qualification}
            />
            <InfoRow label="Institution" value={academicInfo?.institution} />
            <InfoRow
              label="Graduation Year"
              value={academicInfo?.graduationYear}
            />
            <InfoRow label="CGPA / Grade" value={academicInfo?.cgpa} />
            <InfoRow label="Backlogs" value={academicInfo?.backlogs} />
            <InfoRow label="Education Gap" value={academicInfo?.educationGap} />
            {testScores && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Test Scores
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {["ielts", "toefl", "pte", "duolingo", "gre", "gmat"].map(
                    (t) =>
                      testScores[t] ? (
                        <div
                          key={t}
                          className="bg-slate-50 rounded-xl px-3 py-2 text-center"
                        >
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {t}
                          </p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">
                            {testScores[t]}
                          </p>
                        </div>
                      ) : null,
                  )}
                </div>
              </div>
            )}
          </Section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Section title="Preferences" icon={Globe} defaultOpen={false}>
            <InfoRow
              label="Preferred Country"
              value={preferences?.preferredCountry}
            />
            <InfoRow
              label="Preferred Course"
              value={preferences?.preferredCourse}
            />
            <InfoRow label="Study Level" value={preferences?.educationLevel} />
            <InfoRow label="Budget Range" value={preferences?.budgetRange} />
            <InfoRow label="Loan Required" value={preferences?.loanRequired} />
            <InfoRow
              label="Sponsor Available"
              value={preferences?.sponsorAvailable}
            />
            {preferences?.serviceType?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Services Requested
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {preferences.serviceType.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        </motion.div>

        {counselorData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Section
              title="Counselor Notes"
              icon={FileText}
              defaultOpen={false}
            >
              <InfoRow label="Notes" value={counselorData.counselorNotes} />
              <InfoRow
                label="Student Weaknesses"
                value={counselorData.studentWeaknesses}
              />
              <InfoRow label="Visa History" value={counselorData.visaHistory} />
              <InfoRow label="Remarks" value={counselorData.remarks} />
            </Section>
          </motion.div>
        )}

        {/* Documents */}
        {documents?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Section title={`Documents (${documents.length})`} icon={FileText}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <FileText size={14} className="text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {doc.fileName || doc.type || `Document ${idx + 1}`}
                        </p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {doc.type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDocument(idx)}
                      disabled={loadingDocIdx === idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 text-xs font-semibold transition-all disabled:opacity-50 shrink-0"
                    >
                      {loadingDocIdx === idx ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Download size={12} />
                      )}
                      View
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* Status History Timeline */}
        {statusHistory?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Section title="Status History" icon={Clock} defaultOpen={true}>
              <div className="space-y-4">
                {[...statusHistory].reverse().map((entry, idx) => {
                  const cfg = statusConfig[entry.status];
                  return (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${cfg?.dot || "bg-slate-400"}`}
                        />
                        {idx < statusHistory.length - 1 && (
                          <div className="w-px flex-1 bg-slate-200 mt-1.5" />
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <StatusBadge status={entry.status} />
                          <span className="text-xs text-slate-400">
                            {new Date(entry.updatedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-slate-600 mt-1">
                            {entry.note}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1 capitalize">
                          by {entry.updatedBy?.name || "Khizar Team"} ·{" "}
                          {entry.updatedByRole}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
