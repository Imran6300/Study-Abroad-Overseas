"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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
  BarChart3,
  Kanban,
  List,
  Filter,
} from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig = {
  "Documents Reviewing": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
  },
  "University Applied": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  "Offer Received": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-400",
  },
  "Visa Processing": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-400",
  },
  Completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-400",
  },
  "Submitted to Khizar": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    dot: "bg-indigo-400",
  },
  "Visa Approved": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-400",
  },
};

const PIPELINE_STAGES = [
  "Submitted to Khizar",
  "Documents Reviewing",
  "University Applied",
  "Offer Received",
  "Visa Processing",
  "Visa Approved",
  "Completed",
];

// ─── Generate Application ID ──────────────────────────────────────────────────
let appCounter = 3;
const generateAppId = () => {
  appCounter++;
  return `KHZ-${new Date().getFullYear()}-${String(appCounter).padStart(4, "0")}`;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockApplications = [
  {
    id: 1,
    appId: "KHZ-2026-0001",
    student: "Rahul Sharma",
    university: "University of Toronto",
    country: "Canada",
    course: "Computer Science",
    intake: "Fall 2026",
    status: "Documents Reviewing",
    submittedAt: "2 days ago",
    avatar: "RS",
    avatarColor: "from-violet-500 to-purple-600",
    managedBy: "khizar",
    processor: "Khizar Team",
  },
  {
    id: 2,
    appId: "KHZ-2026-0002",
    student: "Ayesha Khan",
    university: "University of Melbourne",
    country: "Australia",
    course: "Business Analytics",
    intake: "Spring 2026",
    status: "Offer Received",
    submittedAt: "5 days ago",
    avatar: "AK",
    avatarColor: "from-emerald-400 to-teal-600",
    managedBy: "khizar",
    processor: "Khizar Team",
  },
  {
    id: 3,
    appId: "KHZ-2026-0003",
    student: "Mohammed Ali",
    university: "University of Manchester",
    country: "UK",
    course: "Cyber Security",
    intake: "Fall 2026",
    status: "Visa Processing",
    submittedAt: "1 week ago",
    avatar: "MA",
    avatarColor: "from-blue-500 to-indigo-600",
    managedBy: "khizar",
    processor: "Khizar Team",
  },
];

// ─── Mock existing students (from counselor's CRM) ────────────────────────────
const mockExistingStudents = [
  {
    leadId: "lead_001",
    id: "user_001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98765 43210",
    nationality: "Indian",
    target: "Canada",
    status: "applied",
    qualification: "Bachelor's Degree",
    cgpa: "7.8",
    ielts: "7.0",
    notes: "Strong profile, needs SOP help.",
  },
  {
    leadId: "lead_002",
    id: "user_002",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    phone: "+91 87654 32109",
    nationality: "Indian",
    target: "Australia",
    status: "qualified",
    qualification: "Master's Degree",
    cgpa: "8.2",
    pte: "65",
    notes: "Excellent academic background.",
  },
  {
    leadId: "lead_003",
    id: "user_003",
    name: "Mohammed Ali",
    email: "mali@example.com",
    phone: "+91 76543 21098",
    nationality: "Indian",
    target: "UK",
    status: "contacted",
    qualification: "Bachelor's Degree",
    cgpa: "6.9",
    ielts: "6.5",
    notes: "Education gap of 1 year.",
  },
  {
    leadId: "lead_004",
    id: "user_004",
    name: "Priya Reddy",
    email: "priya@example.com",
    phone: "+91 65432 10987",
    nationality: "Indian",
    target: "Germany",
    status: "lead",
    qualification: "Bachelor's Degree",
    cgpa: "8.5",
    notes: "Interested in STEM programs.",
  },
  {
    leadId: "lead_005",
    id: "user_005",
    name: "Arjun Singh",
    email: "arjun@example.com",
    phone: "+91 54321 09876",
    nationality: "Indian",
    target: "USA",
    status: "applied",
    qualification: "Bachelor's Degree",
    cgpa: "7.2",
    gre: "318",
    notes: "Targeting top 50 universities.",
  },
];

// ─── Steps config ─────────────────────────────────────────────────────────────
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

// ─── Form field helpers ───────────────────────────────────────────────────────
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
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${value === o ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
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
  preferredUniversities: "",
  preferredCourse: "",
  preferredIntake: "",
  educationLevel: "",
  budgetRange: "",
  loanRequired: "",
  sponsorAvailable: "",
  serviceType: [],
  documents: {},
  counselorNotes: "",
  studentWeaknesses: "",
  visaHistory: "",
  remarks: "",
};

const DOCUMENT_SLOTS = [
  { key: "passport", label: "Passport Copy" },
  { key: "resume", label: "Resume / CV" },
  { key: "transcripts", label: "Academic Transcripts" },
  { key: "degree", label: "Degree Certificate" },
  { key: "sop", label: "Statement of Purpose (SOP)" },
  { key: "lor", label: "Letter of Recommendation (LOR)" },
  { key: "englishReport", label: "IELTS / PTE / TOEFL Report" },
  { key: "financial", label: "Financial Documents" },
  { key: "experience", label: "Experience Letters" },
];

// ─── Step components ──────────────────────────────────────────────────────────
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
          required
        />
        <InputField
          label="Current / Previous Institution"
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
      <div className="border-t border-slate-100 pt-6">
        <SectionTitle
          icon={Star}
          label="English & Entrance Test Scores"
          color="from-cyan-500 to-teal-500"
        />
        <p className="text-xs text-slate-400 mb-4 -mt-2">
          Fill only what the student has. All fields optional.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { key: "ielts", label: "IELTS", ph: "e.g. 7.0" },
            { key: "toefl", label: "TOEFL", ph: "e.g. 100" },
            { key: "pte", label: "PTE", ph: "e.g. 65" },
            { key: "duolingo", label: "Duolingo", ph: "e.g. 115" },
            { key: "gre", label: "GRE", ph: "e.g. 320" },
            { key: "gmat", label: "GMAT", ph: "e.g. 650" },
          ].map((f) => (
            <InputField
              key={f.key}
              label={f.label}
              placeholder={f.ph}
              value={form[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
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
          required
        />
        <SelectField
          label="Education Level"
          icon={GraduationCap}
          options={[
            "Bachelor's",
            "Master's",
            "Diploma / PG Diploma",
            "PhD",
            "Foundation",
          ]}
          value={form.educationLevel}
          onChange={(e) => set("educationLevel", e.target.value)}
          required
        />
        <InputField
          label="Preferred Course / Program"
          icon={BookOpen}
          placeholder="e.g. Data Science, MBA"
          value={form.preferredCourse}
          onChange={(e) => set("preferredCourse", e.target.value)}
          required
          className="sm:col-span-2"
        />
        <InputField
          label="Preferred Universities"
          icon={Building2}
          placeholder="e.g. UoT, UBC, McGill (comma separated)"
          value={form.preferredUniversities}
          onChange={(e) => set("preferredUniversities", e.target.value)}
          className="sm:col-span-2"
        />
        <SelectField
          label="Preferred Intake"
          icon={Calendar}
          options={[
            "Fall 2025",
            "Spring 2026",
            "Fall 2026",
            "Spring 2027",
            "Fall 2027",
          ]}
          value={form.preferredIntake}
          onChange={(e) => set("preferredIntake", e.target.value)}
          required
        />
        <SelectField
          label="Budget Range (Annual Tuition)"
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
          label="Sponsor / Guarantor Available?"
          options={["Yes", "No"]}
          value={form.sponsorAvailable}
          onChange={(v) => set("sponsorAvailable", v)}
        />
      </div>
      <div className="border-t border-slate-100 pt-6">
        <SectionTitle
          icon={Zap}
          label="Application Service Type"
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

function Step4({ form, set }) {
  const fileRefs = useRef({});
  const handleFile = (key, file) => {
    if (!file) return;
    set("documents", { ...form.documents, [key]: file.name });
  };
  const removeFile = (key) => {
    const updated = { ...form.documents };
    delete updated[key];
    set("documents", updated);
  };
  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Upload}
        label="Document Uploads"
        color="from-emerald-500 to-green-500"
      />
      <p className="text-xs text-slate-400 -mt-3">
        All documents optional at this stage — upload what's available.
      </p>
      <div className="space-y-2.5">
        {DOCUMENT_SLOTS.map(({ key, label }) => {
          const uploaded = form.documents[key];
          return (
            <div
              key={key}
              className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${uploaded ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200 hover:border-indigo-300"}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${uploaded ? "bg-emerald-100" : "bg-white border border-slate-200"}`}
                >
                  {uploaded ? (
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  ) : (
                    <Paperclip size={14} className="text-slate-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {label}
                  </p>
                  {uploaded && (
                    <p className="text-[10px] text-emerald-600 truncate">
                      {uploaded}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {uploaded ? (
                  <button
                    type="button"
                    onClick={() => removeFile(key)}
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
                      onChange={(e) => handleFile(key, e.target.files[0])}
                    />
                    <button
                      type="button"
                      onClick={() => fileRefs.current[key]?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-600 text-[11px] font-semibold hover:bg-indigo-50 transition-all flex items-center gap-1.5"
                    >
                      <Upload size={11} /> Upload
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 pt-6">
        <SectionTitle
          icon={StickyNote}
          label="Counselor Notes"
          color="from-violet-500 to-purple-500"
        />
        <div className="space-y-4">
          <div>
            <Label>Special Instructions / Remarks</Label>
            <textarea
              rows={3}
              placeholder="Any specific instructions for the Khizar processing team..."
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
                placeholder="Low CGPA, education gap, backlog history..."
                value={form.studentWeaknesses}
                onChange={(e) => set("studentWeaknesses", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <Label>Visa History</Label>
              <textarea
                rows={2}
                placeholder="Previous visa rejections, travel history..."
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
  const uploadedDocs = Object.entries(form.documents || {});
  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Eye}
        label="Review & Confirm"
        color="from-violet-500 to-purple-500"
      />
      <p className="text-xs text-slate-400 -mt-3">
        Please verify all details before submitting to Khizar Overseas.
      </p>
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest mb-3">
          Student Information
        </p>
        <ReviewRow label="Full Name" value={form.studentName} />
        <ReviewRow label="Email" value={form.email} />
        <ReviewRow label="Phone" value={form.phone} />
        <ReviewRow label="Nationality" value={form.nationality} />
        <ReviewRow label="Passport No" value={form.passportNo} />
        <ReviewRow label="Location" value={form.currentCity} />
      </div>
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-3">
          Academic Details
        </p>
        <ReviewRow label="Qualification" value={form.qualification} />
        <ReviewRow label="Institution" value={form.institution} />
        <ReviewRow label="CGPA / %" value={form.cgpa} />
        <ReviewRow label="IELTS" value={form.ielts} />
        <ReviewRow label="PTE" value={form.pte} />
        <ReviewRow label="GRE" value={form.gre} />
      </div>
      <div className="bg-slate-50 rounded-2xl p-4">
        <p className="text-[10px] font-extrabold text-teal-500 uppercase tracking-widest mb-3">
          Study Preferences
        </p>
        <ReviewRow label="Country" value={form.preferredCountry} />
        <ReviewRow label="Level" value={form.educationLevel} />
        <ReviewRow label="Course" value={form.preferredCourse} />
        <ReviewRow label="Universities" value={form.preferredUniversities} />
        <ReviewRow label="Intake" value={form.preferredIntake} />
        <ReviewRow label="Budget" value={form.budgetRange} />
        <ReviewRow label="Services" value={form.serviceType} />
      </div>
      {uploadedDocs.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-3">
            Uploaded Documents ({uploadedDocs.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {uploadedDocs.map(([, name]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium"
              >
                <CheckCircle2 size={11} />
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
      {form.counselorNotes && (
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest mb-2">
            Counselor Notes
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            {form.counselorNotes}
          </p>
        </div>
      )}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          By submitting, this application will be sent to the{" "}
          <strong>Khizar Overseas processing team</strong> with status{" "}
          <strong>"Submitted to Khizar"</strong>. Status updates will be managed
          exclusively by the Khizar team.
        </p>
      </div>
    </div>
  );
}

// ─── Student Selector Modal ────────────────────────────────────────────────────
function StudentSelectorModal({ onClose, onSelect, onCreateNew }) {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(mockExistingStudents);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search),
  );

  return (
    <>
      <motion.div
        key="sel-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="sel-modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-slate-900/20 flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
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
                className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
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
                placeholder="Search by name, email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/15 transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
                <Loader2 size={16} className="animate-spin" /> Loading students…
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                No students found.
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((student) => (
                  <button
                    key={student.leadId}
                    type="button"
                    onClick={() =>
                      setSelected(
                        selected?.leadId === student.leadId ? null : student,
                      )
                    }
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected?.leadId === student.leadId ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-200 hover:border-indigo-200 hover:bg-slate-100"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {student.name
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
                          {selected?.leadId === student.leadId && (
                            <Check
                              size={13}
                              className="text-indigo-600 shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {student.email} · {student.phone}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400">
                            Target:{" "}
                            <span className="font-semibold text-slate-600">
                              {student.target}
                            </span>
                          </span>
                          {student.ielts && (
                            <span className="text-[10px] text-slate-400">
                              IELTS:{" "}
                              <span className="font-semibold text-slate-600">
                                {student.ielts}
                              </span>
                            </span>
                          )}
                          {student.pte && (
                            <span className="text-[10px] text-slate-400">
                              PTE:{" "}
                              <span className="font-semibold text-slate-600">
                                {student.pte}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
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
              disabled={!selected}
              onClick={() => selected && onSelect(selected)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${selected ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-indigo-200 shadow-sm" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            >
              {selected
                ? `Select ${selected.name.split(" ")[0]}`
                : "Select Student"}{" "}
              {selected && <ArrowRight size={13} className="inline ml-1" />}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── "How to Continue?" choice modal ─────────────────────────────────────────
function HowToContinueModal({ onClose, onSelectExisting, onCreateNew }) {
  return (
    <>
      <motion.div
        key="how-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="how-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white w-full max-w-sm rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-5">
            <div className="flex items-center justify-between">
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
          </div>
          <div className="p-4 space-y-3">
            <button
              type="button"
              onClick={onSelectExisting}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-all">
                  <Users size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Select Existing Student
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose from your current student list
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-500 ml-auto transition-all"
                />
              </div>
            </button>
            <button
              type="button"
              onClick={onCreateNew}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-all">
                  <Plus size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Create New Student
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add a new student profile from scratch
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-400 group-hover:text-emerald-500 ml-auto transition-all"
                />
              </div>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Multi-step Application Modal ────────────────────────────────────────────
function ApplicationModal({ onClose, onSuccess, prefillData }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(
    prefillData
      ? {
          ...emptyForm,
          studentName: prefillData.name || "",
          email: prefillData.email || "",
          phone: prefillData.phone || "",
          nationality: prefillData.nationality || "",
          qualification: prefillData.qualification || "",
          cgpa: prefillData.cgpa || "",
          ielts: prefillData.ielts || "",
          pte: prefillData.pte || "",
          gre: prefillData.gre || "",
          counselorNotes: prefillData.notes || "",
          preferredCountry: prefillData.target || "",
        }
      : emptyForm,
  );
  const [loading, setLoading] = useState(false);
  const isAutoFilled = !!prefillData;

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const canNext = () => {
    if (step === 1)
      return form.studentName && form.email && form.phone && form.nationality;
    if (step === 2) return form.qualification;
    if (step === 3)
      return (
        form.preferredCountry &&
        form.preferredCourse &&
        form.preferredIntake &&
        form.educationLevel
      );
    return true;
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(form);
    }, 2000);
  };

  const TOTAL = STEPS.length;
  const progress = ((step - 1) / (TOTAL - 1)) * 100;

  return (
    <>
      <motion.div
        key="app-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="app-modal"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
      >
        <div className="pointer-events-auto bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-slate-900/20 flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
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
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
            >
              <X size={15} />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-tight leading-none">
                  New Managed Application
                </h2>
                <p className="text-indigo-300 text-[11px] mt-0.5">
                  Khizar Overseas · Processing Request
                  {isAutoFilled && " · Auto-filled"}
                </p>
              </div>
            </div>
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
                        className={`w-3 h-px rounded-full transition-all ${done ? "bg-white/50" : "bg-white/15"}`}
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
              Step {step} of {TOTAL}
            </p>
          </div>

          {/* Body */}
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
                  <Step1 form={form} set={set} isAutoFilled={isAutoFilled} />
                )}
                {step === 2 && <Step2 form={form} set={set} />}
                {step === 3 && <Step3 form={form} set={set} />}
                {step === 4 && <Step4 form={form} set={set} />}
                {step === 5 && <Step5 form={form} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
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
            {step < TOTAL ? (
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
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all disabled:opacity-70"
              >
                {loading ? (
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

// ─── Pipeline Board View ──────────────────────────────────────────────────────
function PipelineBoard({ applications }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {PIPELINE_STAGES.map((stage) => {
          const stageApps = applications.filter((a) => a.status === stage);
          const sc = statusConfig[stage] || statusConfig["Submitted to Khizar"];
          return (
            <div key={stage} className="w-64 shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 border ${sc.bg} ${sc.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                <span className={`text-xs font-bold ${sc.text}`}>{stage}</span>
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
                  stageApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${app.avatarColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                        >
                          {app.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {app.student}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {app.appId}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {app.university}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {app.course} · {app.intake}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const avatarColors = [
  "from-rose-400 to-pink-600",
  "from-cyan-400 to-blue-600",
  "from-orange-400 to-red-500",
  "from-lime-400 to-green-600",
  "from-fuchsia-400 to-purple-600",
];

export default function KhizarApplicationsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "pipeline"
  const [flowState, setFlowState] = useState(null); // null | "how" | "selector" | "form"
  const [prefillData, setPrefillData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [applications, setApplications] = useState(mockApplications);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = applications.filter((app) => {
    const matchSearch =
      app.student.toLowerCase().includes(search.toLowerCase()) ||
      app.appId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleNewApplication = () => setFlowState("how");

  const handleSelectExisting = () => setFlowState("selector");

  const handleCreateNew = () => {
    setPrefillData(null);
    setFlowState("form");
  };

  const handleStudentSelected = (student) => {
    setPrefillData(student);
    setFlowState("form");
  };

  const handleCloseAll = () => {
    setFlowState(null);
    setPrefillData(null);
  };

  const handleSuccess = (form) => {
    const initials = form.studentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const newApp = {
      id: Date.now(),
      appId: generateAppId(),
      student: form.studentName,
      university: form.preferredUniversities?.split(",")[0]?.trim() || "TBD",
      country: form.preferredCountry || "TBD",
      course: form.preferredCourse || "TBD",
      intake: form.preferredIntake || "TBD",
      status: "Submitted to Khizar",
      submittedAt: "Just now",
      avatar: initials || "??",
      avatarColor:
        avatarColors[Math.floor(Math.random() * avatarColors.length)],
      managedBy: "khizar",
      processor: "Khizar Team",
    };
    setApplications((prev) => [newApp, ...prev]);
    setNewStudentName(form.studentName);
    setFlowState(null);
    setPrefillData(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
          <div>
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
              Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Managed Applications
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Applications handled directly by Khizar Overseas
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNewApplication}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-3 rounded-2xl shadow-lg shadow-indigo-200 font-bold text-sm transition-all self-start sm:self-auto whitespace-nowrap"
          >
            <Plus size={16} /> New Managed Application
          </motion.button>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-4 text-sm font-medium shadow-sm"
            >
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span>
                Application for <strong>{newStudentName}</strong> submitted
                successfully to Khizar Overseas!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Applications",
              value: applications.length,
              color: "text-slate-800",
              bg: "bg-blue-50",
              icon: FileText,
              iconColor: "text-blue-500",
            },
            {
              label: "Offers Received",
              value: applications.filter((a) => a.status === "Offer Received")
                .length,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              icon: CheckCircle2,
              iconColor: "text-emerald-500",
            },
            {
              label: "Visa Processing",
              value: applications.filter((a) => a.status === "Visa Processing")
                .length,
              color: "text-violet-600",
              bg: "bg-violet-50",
              icon: Clock3,
              iconColor: "text-violet-500",
            },
            {
              label: "Universities",
              value: [...new Set(applications.map((a) => a.university))].length,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
              icon: Building2,
              iconColor: "text-indigo-500",
            },
          ].map((stat, i) => (
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
                  <p
                    className={`text-2xl sm:text-3xl font-extrabold mt-1.5 ${stat.color}`}
                  >
                    {stat.value}
                  </p>
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
              placeholder="Search by student or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
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

          {/* View toggle */}
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

        {/* Pipeline board */}
        {viewMode === "pipeline" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <PipelineBoard applications={filteredApplications} />
          </motion.div>
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredApplications.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-slate-400 text-sm"
                >
                  No applications found.
                </motion.div>
              )}
              {filteredApplications.map((app, index) => {
                const s =
                  statusConfig[app.status] ||
                  statusConfig["Documents Reviewing"];
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                    }}
                    className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${app.avatarColor} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm`}
                        >
                          {app.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                              {app.student}
                            </h2>
                            <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-lg">
                              {app.appId}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                              />
                              {app.status}
                            </span>
                            {/* Status Lock indicator */}
                            {app.managedBy === "khizar" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                                <Lock size={9} />
                                Managed by Khizar
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            Submitted {app.submittedAt}
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-4">
                            {[
                              { label: "University", value: app.university },
                              { label: "Country", value: app.country },
                              { label: "Course", value: app.course },
                              { label: "Intake", value: app.intake },
                            ].map((d) => (
                              <div key={d.label}>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  {d.label}
                                </p>
                                <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">
                                  {d.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            router.push(
                              `/dashboard/counselor-dashboard/khizar-applications/${app.id}`,
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Eye size={13} /> View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Flow Modals */}
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
            onClose={handleCloseAll}
            onSelect={handleStudentSelected}
            onCreateNew={handleCreateNew}
          />
        )}
        {flowState === "form" && (
          <ApplicationModal
            onClose={handleCloseAll}
            onSuccess={handleSuccess}
            prefillData={prefillData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
