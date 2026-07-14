"use client";

/**
 * app/dashboard/counselor-dashboard/khizar-applications/page.jsx
 * PRODUCTION-COMPLETE v2
 *
 * Changes over v1:
 *  - All API calls go through Redux thunks (no mock data anywhere)
 *  - slotKey passed correctly to uploadKhizarDocument
 *  - Server-side search via ?search= param
 *  - Pagination fully wired
 *  - Empty state with CTA
 *  - Error state with retry
 *  - Loading skeleton on list
 *  - Stats refresh after create
 *  - handleModalClose refreshes list + stats
 *  - universityName derived from preferredUniversities first entry OR user types it
 *  - New "University Name" field added to Step 3 (required by backend)
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { counselorApi } from "@/lib/counselorApi";

import {
  fetchKhizarStats,
  fetchKhizarStudents,
  fetchKhizarApplications,
  createKhizarApplication,
  uploadKhizarDocument,
  clearCreateSuccess,
  resetAllDocumentUploads,
  resetDocumentUpload,
  selectKhizarStats,
  selectKhizarStatsLoading,
  selectKhizarStudents,
  selectKhizarStudentsLoading,
  selectKhizarApplications,
  selectKhizarPagination,
  selectKhizarListLoading,
  selectKhizarListError,
  selectKhizarCreateLoading,
  selectKhizarCreateError,
  selectKhizarCreateSuccess,
  selectKhizarLastCreated,
  selectDocumentUploads,
} from "@/store/KhizarApplicationslice";

import {
  Send,
  Search,
  Plus,
  Building2,
  Clock3,
  CheckCircle2,
  FileText,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  User,
  BookOpen,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Loader2,
  Sparkles,
  GraduationCap,
  DollarSign,
  Shield,
  Upload,
  StickyNote,
  Check,
  AlertCircle,
  Star,
  Zap,
  Eye,
  Paperclip,
  Trash2,
  Users,
  ArrowRight,
  Lock,
  Kanban,
  List,
  Filter,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Award,
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

const PIPELINE_STAGES = Object.keys(statusConfig);

const DOCUMENT_SLOTS = [
  { key: "passport", label: "Passport Copy", type: "passport" },
  { key: "resume", label: "Resume / CV", type: "resume" },
  { key: "transcripts", label: "Academic Transcripts", type: "transcripts" },
  { key: "degree", label: "Degree Certificate", type: "degree" },
  { key: "sop", label: "Statement of Purpose (SOP)", type: "sop" },
  { key: "lor", label: "Letter of Recommendation", type: "lor" },
  {
    key: "englishReport",
    label: "IELTS / PTE / TOEFL Report",
    type: "englishReport",
  },
  { key: "financial", label: "Financial Documents", type: "financial" },
  { key: "experience", label: "Experience Letters", type: "experience" },
];

const STEPS = [
  {
    id: 1,
    title: "Student Info",
    icon: User,
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 2,
    title: "Academic",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Preferences",
    icon: Globe,
    color: "from-cyan-500 to-teal-500",
  },
  {
    id: 4,
    title: "Documents",
    icon: Upload,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 5,
    title: "Review & Submit",
    icon: Check,
    color: "from-violet-500 to-purple-500",
  },
];

const emptyForm = {
  studentName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  nationality: "",
  passportNo: "",
  currentCity: "",
  qualification: "",
  institution: "",
  graduationYear: "",
  cgpa: "",
  backlogs: "",
  educationGap: "",
  ielts: "",
  toefl: "",
  pte: "",
  duolingo: "",
  gre: "",
  gmat: "",
  preferredCountry: "",
  universityName: "",
  preferredUniversities: "",
  preferredCourse: "",
  preferredIntake: "",
  educationLevel: "",
  budgetRange: "",
  loanRequired: "",
  sponsorAvailable: "",
  serviceType: [],
  counselorNotes: "",
  studentWeaknesses: "",
  visaHistory: "",
  remarks: "",
};

// ─── Auto-fill mapping (Select Existing Student) ──────────────────────────────
/**
 * The form's dropdowns use fixed option lists that don't always match the
 * free-text / enum values stored on the Lead, Profile, or Application
 * records. These lookups are kept in sync with the option arrays used by
 * Step1–Step3 below and are only used to *normalize* source data into a
 * value the relevant <select> actually recognizes. If nothing matches, the
 * field is simply left blank so the counselor picks it manually — we never
 * guess a value into a dropdown that could silently misrepresent the
 * student.
 */
const QUALIFICATION_OPTIONS = [
  "High School / O-levels",
  "Intermediate / A-levels",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Diploma",
];
const EDUCATION_LEVEL_OPTIONS = [
  "Bachelor's",
  "Master's",
  "Diploma / PG Diploma",
  "PhD",
  "Foundation",
];
const COUNTRY_OPTIONS = [
  "Canada",
  "Australia",
  "UK",
  "USA",
  "Germany",
  "New Zealand",
  "Ireland",
  "Netherlands",
  "France",
  "Dubai / UAE",
];
const INTAKE_OPTIONS = [
  "Fall 2025",
  "Spring 2026",
  "Fall 2026",
  "Spring 2027",
  "Fall 2027",
];
const BUDGET_OPTIONS = [
  "Under $10,000",
  "$10,000–$20,000",
  "$20,000–$35,000",
  "$35,000–$50,000",
  "$50,000+",
];
const BACKLOG_OPTIONS = ["None", "1–2", "3–5", "5+"];

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

/** yyyy-mm-dd for <input type="date">. Returns "" for anything invalid. */
function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

/** Exact (case/space-insensitive) match against a fixed option list. */
function matchOption(value, options) {
  if (!value) return "";
  const norm = String(value).trim().toLowerCase();
  const hit = options.find((o) => o.toLowerCase() === norm);
  return hit || "";
}

/** Keyword-based normalization for qualification-style free text. */
function normalizeQualification(value, options) {
  if (!value) return "";
  const exact = matchOption(value, options);
  if (exact) return exact;
  const v = String(value).toLowerCase();
  if (v.includes("phd") || v.includes("doctor")) return options.find((o) => /phd/i.test(o)) || "";
  if (v.includes("master")) return options.find((o) => /master/i.test(o)) || "";
  if (v.includes("bachelor") || v.includes("b.tech") || v.includes("b.sc") || v.includes("b.a"))
    return options.find((o) => /bachelor/i.test(o)) || "";
  if (v.includes("diploma")) return options.find((o) => /diploma/i.test(o)) || "";
  if (v.includes("intermediate") || v.includes("a-level") || v.includes("a level"))
    return options.find((o) => /intermediate/i.test(o)) || "";
  if (v.includes("high school") || v.includes("o-level") || v.includes("o level") || v.includes("secondary"))
    return options.find((o) => /high school/i.test(o)) || "";
  return "";
}

const COUNTRY_SYNONYMS = {
  "united states": "USA",
  "united states of america": "USA",
  us: "USA",
  "u.s.a": "USA",
  "u.s.": "USA",
  "united kingdom": "UK",
  england: "UK",
  britain: "UK",
  "great britain": "UK",
  "united arab emirates": "Dubai / UAE",
  uae: "Dubai / UAE",
  dubai: "Dubai / UAE",
};

function normalizeCountry(value) {
  if (!value) return "";
  const exact = matchOption(value, COUNTRY_OPTIONS);
  if (exact) return exact;
  const v = String(value).trim().toLowerCase();
  if (COUNTRY_SYNONYMS[v]) return COUNTRY_SYNONYMS[v];
  const hit = COUNTRY_OPTIONS.find(
    (o) => v.includes(o.toLowerCase()) || o.toLowerCase().includes(v),
  );
  return hit || "";
}

function normalizeIntake(value) {
  if (!value) return "";
  const exact = matchOption(value, INTAKE_OPTIONS);
  if (exact) return exact;
  // Season-only values (e.g. profile.intendedIntake = "Fall") — pick the
  // nearest upcoming option with a matching season rather than guessing a year.
  const v = String(value).toLowerCase();
  const season = ["fall", "spring", "summer", "winter"].find((s) =>
    v.includes(s),
  );
  if (!season) return "";
  const hit = INTAKE_OPTIONS.find((o) => o.toLowerCase().startsWith(season));
  return hit || "";
}

function normalizeBudget(value) {
  return matchOption(value, BUDGET_OPTIONS);
}

function normalizeBacklogs(value) {
  if (value === undefined || value === null || value === "") return "";
  const v = String(value).trim().toLowerCase();
  if (["none", "0", "no", "nil"].includes(v)) return "None";
  const num = parseInt(v, 10);
  if (!Number.isNaN(num)) {
    if (num <= 0) return "None";
    if (num <= 2) return "1–2";
    if (num <= 5) return "3–5";
    return "5+";
  }
  return matchOption(value, BACKLOG_OPTIONS);
}

/** Best-effort slug -> readable title (e.g. "university-of-toronto" -> "University Of Toronto"). */
function slugToTitle(slug) {
  if (!slug) return "";
  return String(slug)
    .replace(/[-_]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Combines the counselor's own student record (Lead), the student's
 * self-completed profile (Profile — only exists once the student has
 * registered), and their most recent Application (if any) into one set of
 * form values — the same information shown on the student's detail page.
 * Later sources in the priority order only fill gaps left by earlier ones.
 */
function mapStudentDetailToForm({ lead, profile, application, fallback }) {
  const personal = application?.personalInfo || {};
  const education = application?.education || {};
  const tests = application?.tests || {};
  const program = application?.programPreference || {};
  const finance = application?.finance || {};

  const values = { ...emptyForm };

  // ── Student Info ──
  values.studentName =
    profile?.fullName || personal.fullName || lead?.name || fallback?.name || "";
  values.email =
    profile?.email || personal.email || lead?.email || fallback?.email || "";
  values.phone =
    profile?.phone || personal.mobile || lead?.phone || fallback?.phone || "";
  values.dob = toDateInputValue(profile?.dateOfBirth || personal.dob);
  values.gender = matchOption(profile?.gender || personal.gender, GENDER_OPTIONS);
  values.nationality = profile?.nationality || personal.nationality || "";
  values.passportNo = profile?.passportNumber || personal.passportNumber || "";
  values.currentCity = personal.address || "";

  // ── Academic ──
  values.qualification = normalizeQualification(
    profile?.qualification || education.qualification || lead?.qualification,
    QUALIFICATION_OPTIONS,
  );
  values.institution = education.school || "";
  values.graduationYear =
    profile?.graduationYear || education.passingYear || lead?.passingYear || "";
  values.cgpa = profile?.gpa || education.cgpa || "";
  values.backlogs = normalizeBacklogs(education.backlogs);

  // ── Test Scores ──
  const englishTest = String(tests.englishTest || "").toLowerCase();
  if (englishTest.includes("ielts")) values.ielts = tests.score || "";
  else if (englishTest.includes("toefl")) values.toefl = tests.score || "";
  else if (englishTest.includes("pte")) values.pte = tests.score || "";
  else if (englishTest.includes("duolingo")) values.duolingo = tests.score || "";

  // ── Preferences ──
  values.preferredCountry = normalizeCountry(
    profile?.preferredCountry || lead?.preferredCountry,
  );
  values.universityName = slugToTitle(program.universitySlug);
  values.preferredCourse = program.field || lead?.field || "";
  values.preferredIntake = normalizeIntake(
    program.intake || lead?.preferredIntake || profile?.intendedIntake,
  );
  values.educationLevel = normalizeQualification(
    program.studyLevel,
    EDUCATION_LEVEL_OPTIONS,
  );
  values.budgetRange = normalizeBudget(
    lead?.budget || program.budget || finance.funds,
  );
  values.sponsorAvailable = finance.sponsor ? "Yes" : "";

  return values;
}

// ─── Reusable field components ────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
    {children}{" "}
    {required && <span className="text-rose-400 normal-case">*</span>}
  </label>
);
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";
const iconInputCls =
  "w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

const InputField = ({
  label,
  icon: Icon,
  required,
  className = "",
  ...props
}) => (
  <div className={className}>
    <Label required={required}>{label}</Label>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      )}
      <input className={Icon ? iconInputCls : inputCls} {...props} />
    </div>
  </div>
);

const SelectField = ({
  label,
  icon: Icon,
  options,
  required,
  className = "",
  value,
  onChange,
}) => (
  <div className={className}>
    <Label required={required}>{label}</Label>
    <div className="relative">
      {Icon && (
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`${Icon ? iconInputCls : inputCls} appearance-none pr-9`}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  </div>
);

const RadioGroup = ({ label, options, value, onChange, className = "" }) => (
  <div className={className}>
    <Label>{label}</Label>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${value === o ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
        >
          {o}
        </button>
      ))}
    </div>
  </div>
);

const CheckboxGroup = ({
  label,
  options,
  value = [],
  onChange,
  className = "",
}) => (
  <div className={className}>
    <Label>{label}</Label>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() =>
              onChange(active ? value.filter((v) => v !== o) : [...value, o])
            }
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
          >
            {active && <Check size={11} />}
            {o}
          </button>
        );
      })}
    </div>
  </div>
);

const SectionTitle = ({ icon: Icon, label, color }) => (
  <div className="flex items-center gap-2.5 mb-5">
    <div
      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}
    >
      <Icon size={13} className="text-white" />
    </div>
    <span className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">
      {label}
    </span>
  </div>
);

// ─── Step Components ──────────────────────────────────────────────────────────
function Step1({ form, set, isAutoFilled }) {
  return (
    <div>
      {isAutoFilled && (
        <div className="mb-4 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm text-indigo-700 font-medium">
          <Sparkles size={14} className="text-indigo-500 shrink-0" />
          Auto-filled from existing student profile. Review and update if
          needed.
        </div>
      )}
      <SectionTitle
        icon={User}
        label="Student Information"
        color="from-indigo-500 to-blue-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          icon={User}
          placeholder="e.g. Rahul Sharma"
          value={form.studentName}
          onChange={(e) => set("studentName", e.target.value)}
          required
        />
        <InputField
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="student@email.com"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
        <InputField
          label="Phone Number"
          icon={Phone}
          placeholder="+91 98765 43210"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          required
        />
        <InputField
          label="Date of Birth"
          type="date"
          value={form.dob}
          onChange={(e) => set("dob", e.target.value)}
        />
        <SelectField
          label="Gender"
          options={["Male", "Female", "Other", "Prefer not to say"]}
          value={form.gender}
          onChange={(e) => set("gender", e.target.value)}
        />
        <InputField
          label="Nationality"
          icon={Globe}
          placeholder="e.g. Indian"
          value={form.nationality}
          onChange={(e) => set("nationality", e.target.value)}
          required
        />
        <InputField
          label="Passport Number"
          icon={Shield}
          placeholder="e.g. A1234567"
          value={form.passportNo}
          onChange={(e) => set("passportNo", e.target.value)}
        />
        <InputField
          label="Current City / Country"
          icon={MapPin}
          placeholder="e.g. Hyderabad, India"
          value={form.currentCity}
          onChange={(e) => set("currentCity", e.target.value)}
        />
      </div>
    </div>
  );
}

function Step2({ form, set }) {
  return (
    <div className="space-y-6">
      <SectionTitle
        icon={GraduationCap}
        label="Academic Details"
        color="from-blue-500 to-cyan-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Highest Qualification"
          icon={GraduationCap}
          required
          options={[
            "High School / O-levels",
            "Intermediate / A-levels",
            "Bachelor's Degree",
            "Master's Degree",
            "PhD",
            "Diploma",
          ]}
          value={form.qualification}
          onChange={(e) => set("qualification", e.target.value)}
        />
        <InputField
          label="Institution"
          icon={Building2}
          placeholder="e.g. JNTU Hyderabad"
          value={form.institution}
          onChange={(e) => set("institution", e.target.value)}
        />
        <InputField
          label="Graduation Year"
          placeholder="e.g. 2024"
          value={form.graduationYear}
          onChange={(e) => set("graduationYear", e.target.value)}
        />
        <InputField
          label="CGPA / Percentage"
          placeholder="e.g. 7.8 / 78%"
          value={form.cgpa}
          onChange={(e) => set("cgpa", e.target.value)}
        />
        <SelectField
          label="Backlogs"
          options={["None", "1–2", "3–5", "5+"]}
          value={form.backlogs}
          onChange={(e) => set("backlogs", e.target.value)}
        />
        <SelectField
          label="Education Gap"
          options={[
            "None",
            "Less than 1 year",
            "1–2 years",
            "2–3 years",
            "3+ years",
          ]}
          value={form.educationGap}
          onChange={(e) => set("educationGap", e.target.value)}
        />
      </div>
      <div className="border-t border-slate-100 pt-5">
        <SectionTitle
          icon={Star}
          label="Test Scores (optional)"
          color="from-cyan-500 to-teal-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { k: "ielts", ph: "7.0" },
            { k: "toefl", ph: "100" },
            { k: "pte", ph: "65" },
            { k: "duolingo", ph: "115" },
            { k: "gre", ph: "320" },
            { k: "gmat", ph: "650" },
          ].map((f) => (
            <InputField
              key={f.k}
              label={f.k.toUpperCase()}
              placeholder={`e.g. ${f.ph}`}
              value={form[f.k]}
              onChange={(e) => set(f.k, e.target.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ form, set }) {
  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Globe}
        label="Study Preferences"
        color="from-cyan-500 to-teal-500"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Preferred Country"
          icon={MapPin}
          required
          options={[
            "Canada",
            "Australia",
            "UK",
            "USA",
            "Germany",
            "New Zealand",
            "Ireland",
            "Netherlands",
            "France",
            "Dubai / UAE",
          ]}
          value={form.preferredCountry}
          onChange={(e) => set("preferredCountry", e.target.value)}
        />
        <SelectField
          label="Education Level"
          icon={GraduationCap}
          required
          options={[
            "Bachelor's",
            "Master's",
            "Diploma / PG Diploma",
            "PhD",
            "Foundation",
          ]}
          value={form.educationLevel}
          onChange={(e) => set("educationLevel", e.target.value)}
        />
        <InputField
          label="University Name (Primary)"
          icon={Building2}
          required
          placeholder="e.g. University of Toronto"
          value={form.universityName}
          onChange={(e) => set("universityName", e.target.value)}
        />
        <InputField
          label="Preferred Course / Program"
          icon={BookOpen}
          required
          placeholder="e.g. Data Science, MBA"
          value={form.preferredCourse}
          onChange={(e) => set("preferredCourse", e.target.value)}
        />
        <InputField
          label="Other Preferred Universities"
          icon={Building2}
          placeholder="e.g. UBC, McGill (comma separated)"
          value={form.preferredUniversities}
          onChange={(e) => set("preferredUniversities", e.target.value)}
          className="sm:col-span-2"
        />
        <SelectField
          label="Preferred Intake"
          icon={Calendar}
          required
          options={[
            "Fall 2025",
            "Spring 2026",
            "Fall 2026",
            "Spring 2027",
            "Fall 2027",
          ]}
          value={form.preferredIntake}
          onChange={(e) => set("preferredIntake", e.target.value)}
        />
        <SelectField
          label="Budget Range (Annual)"
          icon={DollarSign}
          options={[
            "Under $10,000",
            "$10,000–$20,000",
            "$20,000–$35,000",
            "$35,000–$50,000",
            "$50,000+",
          ]}
          value={form.budgetRange}
          onChange={(e) => set("budgetRange", e.target.value)}
        />
        <RadioGroup
          label="Education Loan Required?"
          options={["Yes", "No", "Unsure"]}
          value={form.loanRequired}
          onChange={(v) => set("loanRequired", v)}
        />
        <RadioGroup
          label="Sponsor Available?"
          options={["Yes", "No"]}
          value={form.sponsorAvailable}
          onChange={(v) => set("sponsorAvailable", v)}
        />
      </div>
      <div className="border-t border-slate-100 pt-5">
        <SectionTitle
          icon={Zap}
          label="Service Type"
          color="from-indigo-500 to-violet-500"
        />
        <CheckboxGroup
          options={[
            "Application Only",
            "Application + Visa",
            "Full End-to-End Processing",
            "Scholarship Assistance",
            "Priority Processing",
          ]}
          value={form.serviceType}
          onChange={(v) => set("serviceType", v)}
        />
      </div>
    </div>
  );
}

function Step4({ form, set, studentId }) {
  const dispatch = useDispatch();
  const documentUploads = useSelector(selectDocumentUploads);
  const fileRefs = useRef({});

  const handleFile = (slotKey, file) => {
    if (!file) return;
    dispatch(
      uploadKhizarDocument({
        file,
        folder: `khizar-docs/${studentId || "new"}`,
        slotKey, // FIX: correct slotKey passed
      }),
    );
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Upload}
        label="Document Uploads"
        color="from-emerald-500 to-green-500"
      />
      <p className="text-xs text-slate-400 -mt-3">
        All documents optional — upload what's available now.
      </p>
      <div className="space-y-2.5">
        {DOCUMENT_SLOTS.map(({ key, label }) => {
          const upload = documentUploads[key];
          const isUploading = upload?.loading;
          const isUploaded = !!upload?.supabasePath;
          const hasError = !isUploading && !!upload?.error;
          return (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${isUploaded ? "bg-emerald-50 border-emerald-200" : hasError ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200 hover:border-indigo-300"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isUploaded ? "bg-emerald-100" : hasError ? "bg-rose-100" : "bg-white border border-slate-200"}`}
                >
                  {isUploading ? (
                    <Loader2
                      size={14}
                      className="text-indigo-500 animate-spin"
                    />
                  ) : isUploaded ? (
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  ) : hasError ? (
                    <AlertTriangle size={14} className="text-rose-500" />
                  ) : (
                    <Paperclip size={14} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {label}
                  </p>
                  {isUploaded && (
                    <p className="text-[10px] text-emerald-600 truncate">
                      {upload.fileName}
                    </p>
                  )}
                  {hasError && (
                    <p className="text-[10px] text-rose-500 truncate">
                      {upload.error}
                    </p>
                  )}
                  {isUploading && (
                    <p className="text-[10px] text-indigo-500">Uploading…</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {isUploaded ? (
                  <button
                    type="button"
                    onClick={() => dispatch(resetDocumentUpload(key))}
                    className="w-7 h-7 rounded-lg bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-all"
                  >
                    <Trash2 size={12} className="text-rose-500" />
                  </button>
                ) : (
                  <>
                    <input
                      ref={(el) => (fileRefs.current[key] = el)}
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleFile(key, e.target.files[0])}
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileRefs.current[key]?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-600 text-[11px] font-semibold hover:bg-indigo-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Upload size={11} />
                      )}
                      {isUploading ? "Uploading" : "Upload"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 pt-5">
        <SectionTitle
          icon={StickyNote}
          label="Counselor Notes"
          color="from-violet-500 to-purple-500"
        />
        <div className="space-y-4">
          <div>
            <Label>Special Instructions</Label>
            <textarea
              rows={3}
              placeholder="Instructions for the Khizar processing team…"
              value={form.counselorNotes}
              onChange={(e) => set("counselorNotes", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Student Weaknesses</Label>
              <textarea
                rows={2}
                placeholder="Low CGPA, gaps, backlogs…"
                value={form.studentWeaknesses}
                onChange={(e) => set("studentWeaknesses", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <Label>Visa History</Label>
              <textarea
                rows={2}
                placeholder="Previous rejections, travel history…"
                value={form.visaHistory}
                onChange={(e) => set("visaHistory", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-700 font-medium">
        {Array.isArray(value) ? value.join(", ") : value}
      </span>
    </div>
  );
}

function Step5({ form }) {
  const documentUploads = useSelector(selectDocumentUploads);
  const uploadedDocs = DOCUMENT_SLOTS.filter(
    ({ key }) => documentUploads[key]?.supabasePath,
  );
  return (
    <div className="space-y-5">
      <SectionTitle
        icon={Eye}
        label="Review & Confirm"
        color="from-violet-500 to-purple-500"
      />
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-3">
          Student
        </p>
        <ReviewRow label="Full Name" value={form.studentName} />
        <ReviewRow label="Email" value={form.email} />
        <ReviewRow label="Phone" value={form.phone} />
        <ReviewRow label="Nationality" value={form.nationality} />
        <ReviewRow label="Passport" value={form.passportNo} />
      </div>
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-3">
          Academic
        </p>
        <ReviewRow label="Qualification" value={form.qualification} />
        <ReviewRow label="Institution" value={form.institution} />
        <ReviewRow label="CGPA" value={form.cgpa} />
        <ReviewRow label="IELTS" value={form.ielts} />
        <ReviewRow label="PTE" value={form.pte} />
      </div>
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-extrabold text-teal-500 uppercase tracking-widest mb-3">
          Preferences
        </p>
        <ReviewRow label="Country" value={form.preferredCountry} />
        <ReviewRow label="University" value={form.universityName} />
        <ReviewRow label="Level" value={form.educationLevel} />
        <ReviewRow label="Course" value={form.preferredCourse} />
        <ReviewRow label="Intake" value={form.preferredIntake} />
        <ReviewRow label="Services" value={form.serviceType} />
      </div>
      {uploadedDocs.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-3">
            Documents ({uploadedDocs.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {uploadedDocs.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium"
              >
                <CheckCircle2 size={11} />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          By submitting, this application will be sent to the{" "}
          <strong>Khizar Overseas processing team</strong>. Status will be set
          to <strong>"Documents Reviewing"</strong> and can only be updated by
          the Khizar team.
        </p>
      </div>
    </div>
  );
}

// ─── Student Selector Modal ────────────────────────────────────────────────────
function StudentSelectorModal({ students, loading, selectingId, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const isFetchingDetail = !!selectingId;

  const filtered = students.filter(
    (s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <motion.div
        key="so"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="sm"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
          <div className="shrink-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 pt-5 pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                  <Users size={14} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    Select Existing Student
                  </h2>
                  <p className="text-indigo-300 text-[10px]">
                    Choose from your student list
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all"
              >
                <X size={14} />
              </button>
            </div>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
              <input
                autoFocus
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
                <Loader2 size={16} className="animate-spin" /> Loading students…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                {students.length === 0
                  ? "No students found. Add a student from your dashboard first."
                  : "No students match your search."}
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((student) => (
                  <button
                    key={student._id}
                    type="button"
                    disabled={isFetchingDetail}
                    onClick={() =>
                      setSelected(
                        selected?._id === student._id ? null : student,
                      )
                    }
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected?._id === student._id ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-200 hover:border-indigo-200"} ${isFetchingDetail ? "opacity-60 cursor-wait" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {(student.name || "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {student.name}
                          </p>
                          {selectingId === student._id ? (
                            <Loader2
                              size={13}
                              className="text-indigo-500 animate-spin shrink-0"
                            />
                          ) : (
                            selected?._id === student._id && (
                              <Check
                                size={13}
                                className="text-indigo-600 shrink-0"
                              />
                            )
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="shrink-0 px-4 py-3 border-t border-slate-100 bg-white flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selected || isFetchingDetail}
              onClick={() => selected && onSelect(selected)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${selected && !isFetchingDetail ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            >
              {isFetchingDetail ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Loading
                  profile…
                </>
              ) : selected ? (
                <>
                  {`Select ${selected.name?.split(" ")[0]}`}
                  <ArrowRight size={13} />
                </>
              ) : (
                "Select Student"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── How to Continue Modal ────────────────────────────────────────────────────
function HowToContinueModal({ onClose, onSelectExisting, onCreateNew }) {
  return (
    <>
      <motion.div
        key="ho"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="hm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white">
                  New Managed Application
                </h2>
                <p className="text-indigo-300 text-[10px]">
                  How would you like to continue?
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-all"
            >
              <X size={14} />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {[
              {
                label: "Select Existing Student",
                sub: "Choose from your current student list",
                icon: Users,
                color: "indigo",
                onClick: onSelectExisting,
              },
              {
                label: "Create New Student Profile",
                sub: "Enter a new student's details from scratch",
                icon: Plus,
                color: "emerald",
                onClick: onCreateNew,
              },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={opt.onClick}
                className={`w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-${opt.color}-300 hover:bg-${opt.color}-50 transition-all group`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-${opt.color}-100 group-hover:bg-${opt.color}-200 flex items-center justify-center transition-all`}
                  >
                    <opt.icon size={18} className={`text-${opt.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.sub}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-slate-400 group-hover:text-${opt.color}-500 ml-auto transition-all`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Application Modal ────────────────────────────────────────────────────────
function ApplicationModal({ onClose, prefillStudent, prefillDetail, prefillLoading }) {
  const dispatch = useDispatch();
  const createLoading = useSelector(selectKhizarCreateLoading);
  const createError = useSelector(selectKhizarCreateError);
  const createSuccess = useSelector(selectKhizarCreateSuccess);
  const documentUploads = useSelector(selectDocumentUploads);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...emptyForm });

  useEffect(() => {
    if (!prefillStudent) return;

    if (prefillDetail) {
      // Full student detail (lead + profile + application) available —
      // auto-fill every field we can confidently map, exactly like the
      // student's detail page shows it.
      setForm((f) => ({
        ...f,
        ...mapStudentDetailToForm({ ...prefillDetail, fallback: prefillStudent }),
      }));
    } else {
      // Detail fetch hasn't resolved yet (or failed) — fall back to the
      // basic info already available from the student list so the modal
      // never opens fully empty.
      setForm((f) => ({
        ...f,
        studentName: prefillStudent.name || "",
        email: prefillStudent.email || "",
        phone: prefillStudent.phone || "",
      }));
    }
  }, [prefillStudent, prefillDetail]);

  useEffect(() => {
    if (createSuccess) onClose();
  }, [createSuccess]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const canNext = () => {
    if (step === 1)
      return form.studentName && form.email && form.phone && form.nationality;
    if (step === 2) return form.qualification;
    if (step === 3)
      return (
        form.preferredCountry &&
        form.universityName &&
        form.preferredCourse &&
        form.preferredIntake &&
        form.educationLevel
      );
    return true;
  };

  const handleSubmit = () => {
    const documents = DOCUMENT_SLOTS.filter(
      ({ key }) => documentUploads[key]?.supabasePath,
    ).map(({ key, type }) => ({
      type,
      fileName: documentUploads[key].fileName,
      supabasePath: documentUploads[key].supabasePath,
    }));

    dispatch(
      createKhizarApplication({
        ...(prefillStudent?._id
          ? { studentId: prefillStudent._id }
          : { studentEmail: form.email }),
        universityName: form.universityName,
        country: form.preferredCountry,
        course: form.preferredCourse,
        intake: form.preferredIntake,
        studyLevel: form.educationLevel,
        studentInfo: {
          studentName: form.studentName,
          email: form.email,
          phone: form.phone,
          dob: form.dob,
          gender: form.gender,
          nationality: form.nationality,
          passportNo: form.passportNo,
          currentCity: form.currentCity,
        },
        academicInfo: {
          qualification: form.qualification,
          institution: form.institution,
          graduationYear: form.graduationYear,
          cgpa: form.cgpa,
          backlogs: form.backlogs,
          educationGap: form.educationGap,
        },
        testScores: {
          ielts: form.ielts,
          toefl: form.toefl,
          pte: form.pte,
          duolingo: form.duolingo,
          gre: form.gre,
          gmat: form.gmat,
        },
        preferences: {
          preferredCountry: form.preferredCountry,
          preferredUniversities: form.preferredUniversities,
          preferredCourse: form.preferredCourse,
          preferredIntake: form.preferredIntake,
          educationLevel: form.educationLevel,
          budgetRange: form.budgetRange,
          loanRequired: form.loanRequired,
          sponsorAvailable: form.sponsorAvailable,
          serviceType: form.serviceType,
        },
        counselorData: {
          counselorNotes: form.counselorNotes,
          studentWeaknesses: form.studentWeaknesses,
          visaHistory: form.visaHistory,
          remarks: form.remarks,
        },
        documents,
      }),
    );
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <>
      <motion.div
        key="ao"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="am"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative shrink-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 pt-5 pb-4 overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 z-10 transition-all"
            >
              <X size={15} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-tight">
                  New Managed Application
                </h2>
                <p className="text-indigo-300 text-[11px] mt-0.5">
                  Khizar Overseas ·{" "}
                  {prefillStudent?.name ||
                    form.studentName ||
                    "New Application"}
                </p>
              </div>
            </div>
            {/* Step pills */}
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              {STEPS.map((s, i) => {
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${active ? "bg-white text-slate-900" : done ? "bg-white/20 text-white" : "bg-white/8 text-white/40"}`}
                    >
                      {done ? (
                        <Check size={10} className="text-emerald-400" />
                      ) : (
                        <s.icon size={10} />
                      )}
                      <span className="hidden sm:inline">{s.title}</span>
                      <span className="sm:hidden">{s.id}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`w-3 h-px rounded-full ${done ? "bg-white/50" : "bg-white/15"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full"
              />
            </div>
            <p className="text-[10px] text-white/40 mt-1.5">
              Step {step} of {STEPS.length}
            </p>
          </div>

          {createError && (
            <div className="mx-5 mt-4 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
              <AlertCircle size={14} className="shrink-0" /> {createError}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.18 }}
                className="p-5 sm:p-6"
              >
                {step === 1 && (
                  <Step1
                    form={form}
                    set={set}
                    isAutoFilled={!!prefillStudent}
                  />
                )}
                {step === 2 && <Step2 form={form} set={set} />}
                {step === 3 && <Step3 form={form} set={set} />}
                {step === 4 && (
                  <Step4
                    form={form}
                    set={set}
                    studentId={prefillStudent?._id}
                  />
                )}
                {step === 5 && <Step5 form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => (step > 1 ? setStep((s) => s - 1) : onClose())}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={15} />
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <div className="flex items-center gap-1.5">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all ${step === s.id ? "w-5 h-2 bg-indigo-500" : step > s.id ? "w-2 h-2 bg-emerald-400" : "w-2 h-2 bg-slate-200"}`}
                />
              ))}
            </div>
            {step < STEPS.length ? (
              <motion.button
                type="button"
                whileHover={{ scale: canNext() ? 1.02 : 1 }}
                whileTap={{ scale: canNext() ? 0.97 : 1 }}
                onClick={() => canNext() && setStep((s) => s + 1)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${canNext() ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-indigo-200" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              >
                Continue <ChevronRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={createLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 disabled:opacity-70 transition-all"
              >
                {createLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit to Khizar
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Pipeline Board ───────────────────────────────────────────────────────────
function PipelineBoard({ applications }) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {PIPELINE_STAGES.map((stage) => {
          const sc = statusConfig[stage];
          const stageApps = applications.filter((a) => a.status === stage);
          return (
            <div key={stage} className="w-64 shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 border ${sc.bg} ${sc.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                <span className={`text-xs font-bold ${sc.text}`}>
                  {sc.label}
                </span>
                <span className={`ml-auto text-xs font-bold ${sc.text}`}>
                  {stageApps.length}
                </span>
              </div>
              <div className="space-y-2">
                {stageApps.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 text-center text-xs text-slate-400">
                    No applications
                  </div>
                ) : (
                  stageApps.map((app) => {
                    const name =
                      app.student?.name || app.studentInfo?.studentName || "?";
                    const initials = name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <div
                        key={app._id}
                        onClick={() =>
                          router.push(
                            `/dashboard/counselor-dashboard/khizar-applications/${app._id}`,
                          )
                        }
                        className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {initials}
                          </div>
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {name}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {app.universityName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {app.course} · {app.intake}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const sc = statusConfig[status] || statusConfig.documents_reviewing;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.text} ${sc.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
      {sc.label}
    </span>
  );
};

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-600",
  "from-cyan-400 to-blue-600",
  "from-orange-400 to-red-500",
  "from-lime-400 to-green-600",
  "from-fuchsia-400 to-purple-600",
  "from-indigo-400 to-violet-600",
  "from-teal-400 to-emerald-600",
];
const getGradient = (id) =>
  AVATAR_GRADIENTS[(id?.charCodeAt?.(0) || 0) % AVATAR_GRADIENTS.length];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KhizarApplicationsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const stats = useSelector(selectKhizarStats);
  const statsLoading = useSelector(selectKhizarStatsLoading);
  const students = useSelector(selectKhizarStudents);
  const studentsLoading = useSelector(selectKhizarStudentsLoading);
  const applications = useSelector(selectKhizarApplications);
  const pagination = useSelector(selectKhizarPagination);
  const listLoading = useSelector(selectKhizarListLoading);
  const listError = useSelector(selectKhizarListError);
  const createSuccess = useSelector(selectKhizarCreateSuccess);
  const lastCreated = useSelector(selectKhizarLastCreated);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  const [flowState, setFlowState] = useState(null);
  const [prefillStudent, setPrefillStudent] = useState(null);
  const [prefillDetail, setPrefillDetail] = useState(null);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const [selectingStudentId, setSelectingStudentId] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Initial load
  useEffect(() => {
    dispatch(fetchKhizarStats());
    dispatch(fetchKhizarApplications({ page: 1, limit: 20 }));
  }, []);

  // Reload when filters change
  useEffect(() => {
    const params = { page: currentPage, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    if (debouncedSearch) params.search = debouncedSearch;
    dispatch(fetchKhizarApplications(params));
  }, [debouncedSearch, statusFilter, currentPage]);

  // Success toast
  useEffect(() => {
    if (createSuccess) {
      setShowToast(true);
      dispatch(fetchKhizarStats());
      const t = setTimeout(() => {
        setShowToast(false);
        dispatch(clearCreateSuccess());
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [createSuccess]);

  const handleRefresh = () => {
    dispatch(fetchKhizarStats());
    dispatch(
      fetchKhizarApplications({
        page: currentPage,
        limit: 20,
        ...(statusFilter && { status: statusFilter }),
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    );
  };

  const handleNewApplication = () => setFlowState("how");

  const handleSelectExisting = async () => {
    await dispatch(fetchKhizarStudents());
    setFlowState("selector");
  };

  const handleCreateNew = () => {
    setPrefillStudent(null);
    setPrefillDetail(null);
    setFlowState("form");
  };

  const handleStudentSelected = async (student) => {
    setPrefillStudent(student);
    setPrefillDetail(null);
    setSelectingStudentId(student._id);
    setPrefillLoading(true);
    try {
      // Same endpoint that powers the student's detail page — returns the
      // Lead record, their self-completed Profile (if registered), and
      // their most recent Application, so the "New Managed Application"
      // form can be filled from exactly the same data the counselor sees
      // on that page.
      const res = await counselorApi.getStudentDetail(student._id);
      setPrefillDetail({
        lead: res?.data?.lead || null,
        profile: res?.data?.profile || null,
        application: res?.data?.application || null,
      });
    } catch (err) {
      console.error("[KhizarApplications] getStudentDetail failed:", err);
      // Non-fatal — the modal still opens and falls back to the basic
      // name/email/phone already available from the student list.
    } finally {
      setPrefillLoading(false);
      setSelectingStudentId(null);
      setFlowState("form");
    }
  };

  const handleCloseAll = () => {
    setFlowState(null);
    setPrefillStudent(null);
    setPrefillDetail(null);
    setPrefillLoading(false);
    setSelectingStudentId(null);
    dispatch(resetAllDocumentUploads());
  };

  const handleModalClose = () => {
    handleCloseAll();
    handleRefresh();
  };

  const statsCards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: FileText,
      color: "text-slate-800",
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Offers Received",
      value: stats.offersReceived,
      icon: Award,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Visa Processing",
      value: stats.visaProcessing,
      icon: Clock3,
      color: "text-violet-600",
      bg: "bg-violet-50",
      iconColor: "text-violet-500",
    },
    {
      label: "Universities",
      value: stats.uniqueUniversities,
      icon: Building2,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
          <div>
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
              Counselor Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Managed Applications
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Applications processed directly by Khizar Overseas
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleRefresh}
              className="p-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
            >
              <RefreshCw
                size={16}
                className={listLoading ? "animate-spin" : ""}
              />
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNewApplication}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-3 rounded-2xl shadow-lg shadow-indigo-200 font-bold text-sm whitespace-nowrap transition-all"
            >
              <Plus size={16} /> New Managed Application
            </motion.button>
          </div>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-4 text-sm font-medium shadow-sm"
            >
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span>
                Application for{" "}
                <strong>
                  {lastCreated?.studentInfo?.studentName ||
                    lastCreated?.student?.name}
                </strong>{" "}
                submitted to Khizar Overseas team!
              </span>
              <button
                onClick={() => setShowToast(false)}
                className="ml-auto text-emerald-600 hover:text-emerald-800"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium leading-tight">
                    {stat.label}
                  </p>
                  {statsLoading ? (
                    <div className="h-8 w-12 bg-slate-100 rounded-lg animate-pulse mt-1.5" />
                  ) : (
                    <p
                      className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
                >
                  <stat.icon className={stat.iconColor} size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Search student or university…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
          <div className="ml-auto flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {[
              { mode: "list", icon: List, label: "List" },
              { mode: "pipeline", icon: Kanban, label: "Pipeline" },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === mode ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error state */}
        {listError && !listLoading && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 text-rose-700 text-sm">
              <AlertCircle size={16} className="shrink-0" /> {listError}
            </div>
            <button
              onClick={handleRefresh}
              className="text-rose-600 text-xs font-semibold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {listLoading && applications.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/4" />
                    <div className="h-3 bg-slate-100 rounded-lg w-1/2 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pipeline view */}
        {viewMode === "pipeline" && !listLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <PipelineBoard applications={applications} />
          </motion.div>
        )}

        {/* List view */}
        {viewMode === "list" && !listLoading && (
          <div className="space-y-4">
            <AnimatePresence>
              {applications.length === 0 && !listLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText size={28} className="text-indigo-400" />
                  </div>
                  <h3 className="text-slate-700 font-bold text-base">
                    No applications yet
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 mb-6">
                    Submit your first Khizar-managed application to get started
                  </p>
                  <button
                    onClick={handleNewApplication}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-indigo-200 shadow-md"
                  >
                    <Plus size={15} /> New Application
                  </button>
                </motion.div>
              )}
              {applications.map((app, idx) => {
                const name =
                  app.student?.name ||
                  app.studentInfo?.studentName ||
                  "Unknown";
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      delay: idx * 0.05,
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                    }}
                    className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${getGradient(app._id)} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm`}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                              {name}
                            </h2>
                            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-lg truncate max-w-[120px]">
                              …{app._id?.slice(-6)}
                            </span>
                            <StatusBadge status={app.status} />
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                              <Lock size={9} /> Managed by Khizar
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {app.student?.email || app.studentInfo?.email} ·{" "}
                            {new Date(app.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-4">
                            {[
                              {
                                label: "University",
                                value: app.universityName,
                              },
                              { label: "Country", value: app.country },
                              { label: "Course", value: app.course },
                              { label: "Intake", value: app.intake },
                            ].map((d) => (
                              <div key={d.label}>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {d.label}
                                </p>
                                <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                  {d.value || "—"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          router.push(
                            `/dashboard/counselor-dashboard/khizar-applications/${app._id}`,
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start lg:self-auto shrink-0"
                      >
                        <Eye size={13} /> View Details
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {!listLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}
                >
                  {page}
                </button>
              ))}
              {pagination.totalPages > 5 && (
                <span className="text-slate-400 px-1">…</span>
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={!pagination.hasNextPage}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-xs text-slate-400 ml-1">
              {currentPage}/{pagination.totalPages} · {pagination.total} total
            </span>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {flowState === "how" && (
          <HowToContinueModal
            onClose={handleCloseAll}
            onSelectExisting={handleSelectExisting}
            onCreateNew={handleCreateNew}
          />
        )}
        {flowState === "selector" && (
          <StudentSelectorModal
            students={students}
            loading={studentsLoading}
            selectingId={selectingStudentId}
            onClose={handleCloseAll}
            onSelect={handleStudentSelected}
          />
        )}
        {flowState === "form" && (
          <ApplicationModal
            onClose={handleModalClose}
            prefillStudent={prefillStudent}
            prefillDetail={prefillDetail}
            prefillLoading={prefillLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}