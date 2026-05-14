"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useRef } from "react";
import {
  FaArrowRight,
  FaRobot,
  FaUserGraduate,
  FaUniversity,
  FaChartLine,
  FaGlobe,
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaBell,
  FaFileAlt,
  FaLayerGroup,
  FaBriefcase,
  FaMagic,
  FaCog,
  FaEnvelope,
  FaLink,
  FaChevronDown,
  FaPlay,
  FaQuoteLeft,
  FaStar,
  FaBuilding,
  FaRegLightbulb,
  FaIdCard,
  FaTimes,
  FaArrowLeft,
  FaPhone,
  FaWhatsapp,
  FaCheck,
  FaRocket,
  FaMapMarkerAlt,
  FaBriefcase as FaWork,
} from "react-icons/fa";

/* ─── CONSTANTS ─── */

const BLUE = "#4169E1";
const GREEN = "#32CD32";
const ORANGE = "#FF8C00";
const CREAM = "#FFFACD";

/* ─── FORM CONFIG ─── */

const FORM_STEPS = [
  {
    id: "basic",
    title: "Who Are You?",
    subtitle: "Tell us about yourself — this takes 60 seconds.",
    icon: <FaIdCard />,
    color: BLUE,
  },
  {
    id: "business",
    title: "Your Agency",
    subtitle: "Help us understand your business scale and structure.",
    icon: <FaBuilding />,
    color: GREEN,
  },
  {
    id: "operations",
    title: "How You Work",
    subtitle: "Tell us about your current workflow and services.",
    icon: <FaCog />,
    color: ORANGE,
  },
  {
    id: "branding",
    title: "Branding Goals",
    subtitle: "What white-label setup do you have in mind?",
    icon: <FaLayerGroup />,
    color: "#9b59b6",
  },
  {
    id: "intent",
    title: "Your Vision",
    subtitle: "What are you trying to build? Let us know.",
    icon: <FaRocket />,
    color: BLUE,
  },
];

const INITIAL_FORM = {
  // Basic
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
  country: "",
  city: "",
  // Business
  agencyName: "",
  website: "",
  yearsInBusiness: "",
  agencyType: "",
  studentsPerMonth: "",
  // Operations
  countries: [],
  services: [],
  currentSystem: "",
  teamSize: "",
  // Branding
  wantsBrandedPortal: "",
  brandingName: "",
  hasLogo: "",
  wantsCustomDomain: "",
  // Intent
  whyJoin: "",
  biggestChallenge: "",
  interestedFeatures: [],
  preferredDemoTime: "",
};

/* ─── PARTNER FORM MODAL ─── */

function PartnerFormModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = FORM_STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const currentStep = FORM_STEPS[step];

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const toggle = (key, value) =>
    setForm((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((v) => v !== value)
        : [...p[key], value],
    }));

  const handleNext = () => {
    if (step < totalSteps - 1) setStep((s) => s + 1);
    else setSubmitted(true);
  };
  const handleBack = () => setStep((s) => s - 1);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setSubmitted(false);
      setForm(INITIAL_FORM);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto bg-[#080d1c] border border-white/10 rounded-[32px] shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ambient glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 blur-[80px] rounded-full opacity-30 pointer-events-none transition-all duration-700"
                style={{ background: currentStep.color }}
              />

              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 z-10 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <FaTimes className="text-sm" />
              </button>

              {!submitted ? (
                <div className="relative">
                  {/* Header */}
                  <div className="px-8 pt-8 pb-6 border-b border-white/8">
                    {/* Step dots */}
                    <div className="flex gap-2 mb-6">
                      {FORM_STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <motion.div
                            animate={{
                              width: i === step ? 28 : 8,
                              background:
                                i < step
                                  ? GREEN
                                  : i === step
                                    ? currentStep.color
                                    : "rgba(255,255,255,0.15)",
                            }}
                            transition={{ duration: 0.4 }}
                            className="h-2 rounded-full"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Step badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-base"
                        style={{
                          background: `${currentStep.color}20`,
                          color: currentStep.color,
                        }}
                      >
                        {currentStep.icon}
                      </div>
                      <div>
                        <p className="text-xs text-white/40 font-semibold uppercase tracking-widest">
                          Step {step + 1} of {totalSteps}
                        </p>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black">{currentStep.title}</h2>
                    <p className="text-white/50 text-sm mt-1">
                      {currentStep.subtitle}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="px-8 py-7">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {step === 0 && (
                          <Step1Basic form={form} update={update} />
                        )}
                        {step === 1 && (
                          <Step2Business form={form} update={update} />
                        )}
                        {step === 2 && (
                          <Step3Operations
                            form={form}
                            update={update}
                            toggle={toggle}
                          />
                        )}
                        {step === 3 && (
                          <Step4Branding form={form} update={update} />
                        )}
                        {step === 4 && (
                          <Step5Intent
                            form={form}
                            update={update}
                            toggle={toggle}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="px-8 pb-8 flex items-center justify-between gap-4">
                    <button
                      onClick={handleBack}
                      disabled={step === 0}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                        step === 0
                          ? "opacity-0 pointer-events-none"
                          : "bg-white/8 hover:bg-white/15 text-white/70 hover:text-white border border-white/10"
                      }`}
                    >
                      <FaArrowLeft className="text-xs" />
                      Back
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      className="flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg"
                      style={{
                        background: currentStep.color,
                        boxShadow: `0 8px 32px ${currentStep.color}50`,
                      }}
                    >
                      {step === totalSteps - 1 ? (
                        <>
                          <FaRocket className="text-sm" />
                          Submit Application
                        </>
                      ) : (
                        <>
                          Continue
                          <FaArrowRight className="text-sm" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <SuccessScreen onClose={handleClose} form={form} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── FORM STEP COMPONENTS ─── */

function FormField({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-white/80">
        {label}
      </label>
      {hint && <p className="text-xs text-white/35">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-white/6 border border-white/10 hover:border-white/20 focus:border-[#4169E1]/60 focus:bg-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all";

const selectCls =
  "w-full bg-white/6 border border-white/10 hover:border-white/20 focus:border-[#4169E1]/60 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none";

function OptionPill({ label, selected, color = BLUE, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
      style={{
        background: selected ? `${color}20` : "rgba(255,255,255,0.04)",
        borderColor: selected ? color : "rgba(255,255,255,0.1)",
        color: selected ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {selected && <FaCheck className="text-xs" style={{ color }} />}
      {label}
    </button>
  );
}

function Step1Basic({ form, update }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormField label="Full Name *">
          <input
            className={inputCls}
            placeholder="John Smith"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </FormField>
      </div>
      <div className="col-span-2">
        <FormField label="Business Email *">
          <input
            className={inputCls}
            type="email"
            placeholder="you@youragency.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </FormField>
      </div>
      <FormField label="Phone Number *">
        <input
          className={inputCls}
          placeholder="+1 234 567 8900"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </FormField>
      <FormField label="WhatsApp Number">
        <input
          className={inputCls}
          placeholder="Same as phone?"
          value={form.whatsapp}
          onChange={(e) => update("whatsapp", e.target.value)}
        />
      </FormField>
      <FormField label="Country *">
        <select
          className={selectCls}
          value={form.country}
          onChange={(e) => update("country", e.target.value)}
        >
          <option value="" disabled>
            Select country
          </option>
          {[
            "India",
            "Pakistan",
            "Bangladesh",
            "Nigeria",
            "UAE",
            "Saudi Arabia",
            "UK",
            "USA",
            "Canada",
            "Australia",
            "Other",
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="City">
        <input
          className={inputCls}
          placeholder="Mumbai"
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
        />
      </FormField>
    </div>
  );
}

function Step2Business({ form, update }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormField label="Agency / Consultancy Name *">
            <input
              className={inputCls}
              placeholder="Global Overseas Consultancy"
              value={form.agencyName}
              onChange={(e) => update("agencyName", e.target.value)}
            />
          </FormField>
        </div>
        <div className="col-span-2">
          <FormField
            label="Website URL"
            hint="Optional — helps us verify your business"
          >
            <input
              className={inputCls}
              placeholder="https://youragency.com"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </FormField>
        </div>
      </div>

      <FormField label="Years In Business">
        <div className="flex flex-wrap gap-2">
          {["Just Started", "1–2 Years", "3–5 Years", "5+ Years"].map((y) => (
            <OptionPill
              key={y}
              label={y}
              selected={form.yearsInBusiness === y}
              color={GREEN}
              onClick={() => update("yearsInBusiness", y)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Agency Type *">
        <div className="flex flex-wrap gap-2">
          {[
            "Independent Counselor",
            "Small Agency",
            "Medium Consultancy",
            "Multi-Branch Agency",
          ].map((t) => (
            <OptionPill
              key={t}
              label={t}
              selected={form.agencyType === t}
              color={GREEN}
              onClick={() => update("agencyType", t)}
            />
          ))}
        </div>
      </FormField>

      <FormField
        label="Students Handled Per Month *"
        hint="This helps us understand your scale"
      >
        <div className="flex flex-wrap gap-2">
          {["1–10", "10–50", "50–100", "100+"].map((s) => (
            <OptionPill
              key={s}
              label={s}
              selected={form.studentsPerMonth === s}
              color={GREEN}
              onClick={() => update("studentsPerMonth", s)}
            />
          ))}
        </div>
      </FormField>
    </div>
  );
}

function Step3Operations({ form, update, toggle }) {
  return (
    <div className="space-y-6">
      <FormField label="Countries You Send Students To">
        <div className="flex flex-wrap gap-2">
          {[
            "USA",
            "UK",
            "Canada",
            "Australia",
            "Germany",
            "Europe",
            "Others",
          ].map((c) => (
            <OptionPill
              key={c}
              label={c}
              selected={form.countries.includes(c)}
              color={ORANGE}
              onClick={() => toggle("countries", c)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Services You Provide">
        <div className="flex flex-wrap gap-2">
          {[
            "University Admissions",
            "Visa Guidance",
            "SOP Assistance",
            "Scholarship Assistance",
            "Accommodation",
            "Test Preparation",
          ].map((s) => (
            <OptionPill
              key={s}
              label={s}
              selected={form.services.includes(s)}
              color={ORANGE}
              onClick={() => toggle("services", s)}
            />
          ))}
        </div>
      </FormField>

      <FormField
        label="Current System Used"
        hint="Be honest — this helps us tailor your onboarding"
      >
        <div className="flex flex-wrap gap-2">
          {[
            "Excel Sheets",
            "WhatsApp",
            "CRM Software",
            "Manual Process",
            "Other",
          ].map((s) => (
            <OptionPill
              key={s}
              label={s}
              selected={form.currentSystem === s}
              color={ORANGE}
              onClick={() => update("currentSystem", s)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Team Size">
        <div className="flex flex-wrap gap-2">
          {[
            "Solo Counselor",
            "2–5 Employees",
            "5–20 Employees",
            "20+ Employees",
          ].map((t) => (
            <OptionPill
              key={t}
              label={t}
              selected={form.teamSize === t}
              color={ORANGE}
              onClick={() => update("teamSize", t)}
            />
          ))}
        </div>
      </FormField>
    </div>
  );
}

function Step4Branding({ form, update }) {
  return (
    <div className="space-y-6">
      <FormField
        label="Do You Want Your Own Branded Portal?"
        hint="Your students will see only your brand — not ours"
      >
        <div className="flex flex-wrap gap-2">
          {["Yes, Absolutely", "Maybe Later", "Not Sure Yet"].map((o) => (
            <OptionPill
              key={o}
              label={o}
              selected={form.wantsBrandedPortal === o}
              color="#9b59b6"
              onClick={() => update("wantsBrandedPortal", o)}
            />
          ))}
        </div>
      </FormField>

      <FormField
        label="Preferred Branding Name"
        hint="How would you like your portal to be titled?"
      >
        <input
          className={inputCls}
          placeholder="ABC Overseas Education"
          value={form.brandingName}
          onChange={(e) => update("brandingName", e.target.value)}
        />
      </FormField>

      <FormField label="Do You Have a Logo?">
        <div className="flex gap-2">
          {["Yes", "No", "In Progress"].map((o) => (
            <OptionPill
              key={o}
              label={o}
              selected={form.hasLogo === o}
              color="#9b59b6"
              onClick={() => update("hasLogo", o)}
            />
          ))}
        </div>
      </FormField>

      <FormField
        label="Want Custom Domain Support?"
        hint="e.g. portal.youragency.com"
      >
        <div className="flex gap-2">
          {["Yes", "No", "Later"].map((o) => (
            <OptionPill
              key={o}
              label={o}
              selected={form.wantsCustomDomain === o}
              color="#9b59b6"
              onClick={() => update("wantsCustomDomain", o)}
            />
          ))}
        </div>
      </FormField>

      {form.wantsCustomDomain === "Yes" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FormField label="Preferred Domain" hint="We'll set this up for you">
            <input
              className={inputCls}
              placeholder="portal.youragency.com"
              value={form.preferredDomain || ""}
              onChange={(e) => update("preferredDomain", e.target.value)}
            />
          </FormField>
        </motion.div>
      )}
    </div>
  );
}

function Step5Intent({ form, update, toggle }) {
  return (
    <div className="space-y-5">
      <FormField
        label="Why Do You Want To Join?"
        hint="Be specific — this helps us prioritize your account"
      >
        <textarea
          className={`${inputCls} resize-none h-24`}
          placeholder="We're currently using spreadsheets and losing track of students. We want a professional system that makes us look bigger than we are..."
          value={form.whyJoin}
          onChange={(e) => update("whyJoin", e.target.value)}
        />
      </FormField>

      <FormField label="Biggest Operational Challenge">
        <div className="flex flex-wrap gap-2">
          {[
            "Managing students",
            "Application tracking",
            "Team coordination",
            "Communication",
            "Documents",
            "Scaling operations",
          ].map((c) => (
            <OptionPill
              key={c}
              label={c}
              selected={form.biggestChallenge === c}
              color={BLUE}
              onClick={() => update("biggestChallenge", c)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Features You're Most Excited About">
        <div className="flex flex-wrap gap-2">
          {[
            "White-label Dashboard",
            "Student CRM",
            "Team Management",
            "Analytics",
            "Workflow Automation",
            "University Management",
            "Document Management",
          ].map((f) => (
            <OptionPill
              key={f}
              label={f}
              selected={form.interestedFeatures.includes(f)}
              color={BLUE}
              onClick={() => toggle("interestedFeatures", f)}
            />
          ))}
        </div>
      </FormField>

      <FormField label="Preferred Demo Time">
        <select
          className={selectCls}
          value={form.preferredDemoTime}
          onChange={(e) => update("preferredDemoTime", e.target.value)}
        >
          <option value="" disabled>
            Select a slot
          </option>
          {[
            "Weekday Morning (9am–12pm)",
            "Weekday Afternoon (1pm–5pm)",
            "Weekday Evening (6pm–9pm)",
            "Weekend Morning",
            "Weekend Afternoon",
          ].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}

/* ─── SUCCESS SCREEN ─── */

function SuccessScreen({ onClose, form }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative px-8 py-16 text-center overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(50,205,50,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(65,105,225,0.1),transparent_60%)]" />

      {/* Animated checkmark */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            type: "spring",
            bounce: 0.5,
          }}
          className="w-24 h-24 rounded-full bg-[#32CD32]/20 border-2 border-[#32CD32]/50 flex items-center justify-center mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              type: "spring",
              bounce: 0.6,
            }}
          >
            <FaCheck className="text-[#32CD32] text-4xl" />
          </motion.div>
        </motion.div>

        {/* Ripples */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 1.5,
              delay: 0.3 + i * 0.2,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            className="absolute inset-0 rounded-full border border-[#32CD32]/30 mx-auto w-24 h-24"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-4xl font-black mb-3">
          Application <span className="text-[#32CD32]">Received!</span>
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-2">
          Hey{" "}
          <span className="text-white font-semibold">
            {form.fullName || "there"}
          </span>
          ! 🎉
        </p>
        <p className="text-white/50 leading-relaxed max-w-md mx-auto mb-10">
          We've received your partner application for{" "}
          <span className="text-white font-semibold">
            {form.agencyName || "your agency"}
          </span>
          . Our team will review it and reach out within 24 hours to schedule
          your demo.
        </p>

        {/* What's next */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8 max-w-sm mx-auto">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
            What Happens Next
          </p>
          <div className="space-y-3">
            {[
              {
                step: "1",
                text: "Our team reviews your application",
                color: BLUE,
              },
              {
                step: "2",
                text: "Demo call scheduled within 24h",
                color: GREEN,
              },
              {
                step: "3",
                text: "Your branded portal goes live",
                color: ORANGE,
              },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                  style={{ background: `${item.color}25`, color: item.color }}
                >
                  {item.step}
                </div>
                <p className="text-sm text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="bg-[#4169E1] hover:bg-[#3157cf] text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-[0_8px_32px_rgba(65,105,225,0.4)]"
        >
          Back to Homepage
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─── FEATURES DATA ─── */

const FEATURES_DETAILED = [
  {
    id: "whitelabel",
    icon: <FaLayerGroup />,
    color: BLUE,
    badge: "Most Requested",
    title: "White-Label Branding System",
    tagline: "Your brand. Our infrastructure.",
    description:
      "Your students never see our name. They interact entirely with your brand — your logo, your colors, your portal.",
    points: [
      "Custom domain — portal.youragency.com",
      "Branded student dashboard & emails",
      "Custom color themes & logo",
      "Branded notifications & SMS",
      "Subdomain or fully custom domain",
    ],
    preview: <WhiteLabelPreview />,
  },
  {
    id: "crm",
    icon: <FaUserGraduate />,
    color: GREEN,
    badge: "Core Feature",
    title: "Student CRM System",
    tagline: "Ditch spreadsheets forever.",
    description:
      "A full-featured student lifecycle manager — from first inquiry to university acceptance.",
    points: [
      "Lead tracking & qualification pipeline",
      "Document collection & management",
      "Full communication history",
      "Automated reminders & task management",
      "Notes, tags & progress tracking",
    ],
    preview: <CRMPreview />,
  },
  {
    id: "applications",
    icon: <FaUniversity />,
    color: ORANGE,
    badge: "Operations",
    title: "University & Application Hub",
    tagline: "Every application, perfectly organized.",
    description:
      "Manage university relationships, deadlines, visa workflows, and application statuses — all in one place.",
    points: [
      "Multi-university application tracking",
      "Deadline management & alerts",
      "Visa workflow automation",
      "Document submission tracking",
      "Real-time application status",
    ],
    preview: <ApplicationPreview />,
  },
  {
    id: "team",
    icon: <FaUsers />,
    color: "#9b59b6",
    badge: "Scale",
    title: "Multi-Counselor Team Management",
    tagline: "Grow your team without the chaos.",
    description:
      "Manage branches, counselors, permissions, and performance from a single admin panel.",
    points: [
      "Role-based access controls",
      "Branch & office management",
      "Counselor performance dashboards",
      "Internal collaboration tools",
      "Activity logs & audit trails",
    ],
    preview: <TeamPreview />,
  },
  {
    id: "analytics",
    icon: <FaChartLine />,
    color: BLUE,
    badge: "Insights",
    title: "Analytics & Reporting",
    tagline: "Know your numbers. Grow your business.",
    description:
      "Powerful dashboards that show you exactly what's working — and what needs attention.",
    points: [
      "Application conversion funnels",
      "Counselor performance metrics",
      "Revenue & commission insights",
      "Visa approval rate tracking",
      "Student pipeline analytics",
    ],
    preview: <AnalyticsPreview />,
  },
  {
    id: "automation",
    icon: <FaMagic />,
    color: GREEN,
    badge: "Efficiency",
    title: "Workflow Automation",
    tagline: "Scale without the operational chaos.",
    description:
      "Set it once, let it run. Automations handle the repetitive work so your team can focus on students.",
    points: [
      "Automatic email & SMS reminders",
      "Status-triggered workflows",
      "Document request automation",
      "Deadline alert sequences",
      "Task assignment triggers",
    ],
    preview: <AutomationPreview />,
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    icon: <FaGlobe />,
    title: "You Onboard in 24hrs",
    desc: "We set up your branded portal, custom domain, and team in under a day.",
    color: BLUE,
  },
  {
    step: "02",
    icon: <FaIdCard />,
    title: "Students See Your Brand",
    desc: "Students apply and interact through your fully branded ecosystem.",
    color: GREEN,
  },
  {
    step: "03",
    icon: <FaCog />,
    title: "You Manage Everything",
    desc: "Handle applications, documents, and teams from one command center.",
    color: ORANGE,
  },
  {
    step: "04",
    icon: <FaUniversity />,
    title: "Universities Receive",
    desc: "Organized, complete applications reach universities faster than ever.",
    color: "#9b59b6",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    agency: "EduPath Consultants, Mumbai",
    avatar: "PS",
    rating: 5,
    text: "Within 3 months of switching, we doubled our student capacity without hiring anyone new. The white-label portal made us look like a tech company overnight.",
  },
  {
    name: "Ahmed Al-Rashidi",
    agency: "Global Routes, Dubai",
    avatar: "AA",
    rating: 5,
    text: "Our students think we built this ourselves. That's exactly the kind of professional image we needed to compete with larger agencies.",
  },
  {
    name: "Lin Wei",
    agency: "BridgeStudy, Singapore",
    avatar: "LW",
    rating: 5,
    text: "The analytics alone changed how we run our business. We can now see which universities convert best and focus our efforts accordingly.",
  },
];

const COMPARISON_ROWS = [
  { label: "Student CRM", us: true, traditional: false, generic: false },
  { label: "White-label portal", us: true, traditional: false, generic: false },
  {
    label: "Visa workflow automation",
    us: true,
    traditional: false,
    generic: false,
  },
  { label: "Custom domain", us: true, traditional: false, generic: false },
  {
    label: "Team & branch management",
    us: true,
    traditional: false,
    generic: true,
  },
  { label: "Analytics dashboard", us: true, traditional: false, generic: true },
  {
    label: "Workflow automation",
    us: true,
    traditional: false,
    generic: false,
  },
  {
    label: "Branded emails & notifications",
    us: true,
    traditional: false,
    generic: false,
  },
];

/* ─── MINI PREVIEW COMPONENTS ─── */

function WhiteLabelPreview() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0a0f1e]">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-400/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
        <div className="w-3 h-3 rounded-full bg-green-400/70" />
        <div className="flex-1 mx-3 bg-white/10 rounded-md px-3 py-1 text-xs text-white/50 font-mono">
          portal.<span className="text-[#4169E1]">youragency</span>.com
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-[#4169E1] flex items-center justify-center font-black text-sm">
            YA
          </div>
          <div>
            <p className="font-bold text-sm">Your Agency</p>
            <p className="text-xs text-white/40">Student Portal</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            "My Applications",
            "Documents",
            "University Matches",
            "Messages",
          ].map((item) => (
            <div
              key={item}
              className="bg-white/5 border border-white/10 rounded-xl p-3"
            >
              <p className="text-xs text-white/50">{item}</p>
              <div className="w-8 h-1.5 mt-2 rounded-full bg-[#4169E1]/60" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CRMPreview() {
  const students = [
    { name: "Aisha M.", stage: "Documents", progress: 75, color: GREEN },
    { name: "James K.", stage: "Applied", progress: 55, color: BLUE },
    { name: "Fatima H.", stage: "Interview", progress: 90, color: ORANGE },
    { name: "Ravi S.", stage: "Lead", progress: 20, color: "#9b59b6" },
  ];
  return (
    <div className="rounded-2xl bg-[#0a0f1e] border border-white/10 p-5 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-sm">Student Pipeline</p>
        <span className="text-xs text-[#32CD32] bg-[#32CD32]/10 px-2 py-1 rounded-full">
          128 Active
        </span>
      </div>
      {students.map((s) => (
        <div key={s.name} className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: `${s.color}20`, color: s.color }}
          >
            {s.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-1">
              <p className="text-xs font-medium truncate">{s.name}</p>
              <p className="text-xs text-white/40 ml-2 shrink-0">{s.stage}</p>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${s.progress}%`, background: s.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationPreview() {
  const apps = [
    {
      uni: "University of Toronto",
      status: "Under Review",
      flag: "🇨🇦",
      color: BLUE,
    },
    {
      uni: "Monash University",
      status: "Offer Received",
      flag: "🇦🇺",
      color: GREEN,
    },
    {
      uni: "Univ. of Amsterdam",
      status: "Docs Required",
      flag: "🇳🇱",
      color: ORANGE,
    },
  ];
  return (
    <div className="rounded-2xl bg-[#0a0f1e] border border-white/10 p-5 space-y-3">
      <p className="font-semibold text-sm mb-2">Active Applications</p>
      {apps.map((a) => (
        <div
          key={a.uni}
          className="flex items-center gap-3 p-3 rounded-xl border"
          style={{ background: `${a.color}08`, borderColor: `${a.color}25` }}
        >
          <span className="text-xl">{a.flag}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{a.uni}</p>
            <p className="text-xs mt-0.5" style={{ color: a.color }}>
              {a.status}
            </p>
          </div>
          <FaArrowRight className="text-white/20 shrink-0 text-xs" />
        </div>
      ))}
    </div>
  );
}

function TeamPreview() {
  const members = [
    {
      name: "Sarah Lee",
      role: "Senior Counselor",
      students: 34,
      initials: "SL",
    },
    { name: "Omar K.", role: "Visa Specialist", students: 22, initials: "OK" },
    {
      name: "Priya N.",
      role: "Junior Counselor",
      students: 18,
      initials: "PN",
    },
  ];
  return (
    <div className="rounded-2xl bg-[#0a0f1e] border border-white/10 p-5 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-sm">Team Performance</p>
        <span className="text-xs text-[#9b59b6] bg-[#9b59b6]/10 px-2 py-1 rounded-full">
          3 Members
        </span>
      </div>
      {members.map((m) => (
        <div key={m.name} className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#9b59b6]/20 text-[#9b59b6] text-xs font-bold flex items-center justify-center shrink-0">
            {m.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{m.name}</p>
            <p className="text-xs text-white/40">{m.role}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-[#9b59b6]">{m.students}</p>
            <p className="text-xs text-white/30">students</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPreview() {
  const bars = [65, 80, 45, 90, 70, 55, 85];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="rounded-2xl bg-[#0a0f1e] border border-white/10 p-5">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-sm">Applications This Week</p>
        <span className="text-xs text-[#32CD32] font-bold">+23%</span>
      </div>
      <div className="flex items-end gap-2 h-20">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${h}%`,
                background: h === 90 ? BLUE : `${BLUE}40`,
              }}
            />
            <p className="text-[9px] text-white/30">{labels[i]}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <p className="text-lg font-black text-[#4169E1]">92%</p>
          <p className="text-[10px] text-white/40">Visa Rate</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#32CD32]">315</p>
          <p className="text-[10px] text-white/40">Matches</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#FF8C00]">$18k</p>
          <p className="text-[10px] text-white/40">Revenue</p>
        </div>
      </div>
    </div>
  );
}

function AutomationPreview() {
  const flows = [
    { label: "Student submits doc", color: BLUE, done: true },
    { label: "Auto-verify & notify counselor", color: GREEN, done: true },
    { label: "University deadline check", color: ORANGE, done: false },
    { label: "Send reminder if 3 days left", color: GREEN, done: false },
  ];
  return (
    <div className="rounded-2xl bg-[#0a0f1e] border border-white/10 p-5">
      <p className="font-semibold text-sm mb-4">Active Automation Flow</p>
      <div className="space-y-2">
        {flows.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: f.done ? `${f.color}25` : "rgba(255,255,255,0.05)",
                border: `1px solid ${f.done ? f.color : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {f.done ? (
                <FaCheckCircle style={{ color: f.color, fontSize: 10 }} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </div>
            <p
              className="text-xs"
              style={{
                color: f.done
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.3)",
              }}
            >
              {f.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */

export default function PartnersPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const featuresRef = useRef(null);

  const openForm = () => setFormOpen(true);

  const faqs = [
    {
      q: "Will my students know this is a third-party platform?",
      a: "Absolutely not. Students see only your brand — your logo, your domain, your colors. We operate entirely in the background.",
    },
    {
      q: "How long does it take to get set up?",
      a: "Most partners are fully live within 24 hours. We handle domain setup, branding configuration, and initial data migration for you.",
    },
    {
      q: "Can I manage multiple branch offices?",
      a: "Yes. Our platform supports unlimited branches with separate counselor teams, each with their own dashboards and access controls.",
    },
    {
      q: "Is my student data safe and private?",
      a: "Enterprise-grade encryption and access controls protect every piece of data. You own your student data completely — always.",
    },
    {
      q: "What happens as I scale from 50 to 5,000 students?",
      a: "Nothing changes on your end. Our infrastructure scales automatically. You just focus on growing your agency.",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      {/* Partner Form Modal */}
      <PartnerFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} />

      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#4169E1]/8 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#32CD32]/6 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-[#FF8C00]/5 blur-[100px] rounded-full" />
      </div>

      {/* ── HERO ── */}
      <section className="relative px-6 md:px-14 pt-36 pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-[#4169E1]/15 border border-[#4169E1]/30 rounded-full px-5 py-2.5 text-sm text-[#9bb2ff]">
              <div className="w-2 h-2 rounded-full bg-[#32CD32] animate-pulse" />
              The Operating System for Overseas Education Agencies
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-black leading-[1.02] tracking-tight">
              Run Your Entire
              <span className="block">
                <span className="text-[#4169E1]">Consultancy</span>{" "}
                <span className="text-[#dcdcdc]/50">From</span>
              </span>
              <span className="block text-[#FF8C00]">One Platform.</span>
            </h1>
            <p className="mt-8 text-xl text-[#dcdcdc]/70 leading-relaxed max-w-3xl mx-auto">
              White-label infrastructure that puts your brand front and center.
              Student CRM, university applications, visa workflows, team
              management — all powered by AI, all under your name.
            </p>
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openForm}
                className="group bg-[#4169E1] hover:bg-[#3157cf] px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_12px_48px_rgba(65,105,225,0.4)]"
              >
                <span className="flex items-center gap-3">
                  Become a Partner
                  <FaArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 border border-white/15 hover:border-[#32CD32]/50 hover:bg-[#32CD32]/8 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <FaPlay className="text-xs ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { number: "20+", label: "Partner Agencies", color: BLUE },
              { number: "500+", label: "Students Managed", color: GREEN },
              { number: "15+", label: "Countries", color: ORANGE },
              { number: "24h", label: "Setup Time", color: "#9b59b6" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-xl"
              >
                <h3 className="text-4xl font-black" style={{ color: s.color }}>
                  {s.number}
                </h3>
                <p className="text-sm text-[#dcdcdc]/60 mt-2">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-20 max-w-6xl mx-auto"
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </section>

      {/* ── POSITIONING STATEMENT ── */}
      <section className="px-6 md:px-14 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#4169E1]/15 via-white/5 to-[#32CD32]/10 border border-white/10 rounded-[36px] p-12 md:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4169E1]/20 blur-[80px] rounded-full" />
            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#32CD32] font-semibold uppercase tracking-[0.2em] text-sm mb-4">
                  Our Philosophy
                </p>
                <h2 className="text-4xl md:text-5xl font-black leading-tight">
                  You own the students{" "}
                  <span className="text-[#dcdcdc]/40">and the brand.</span>
                  <br />
                  <span className="text-[#4169E1]">We own the tech.</span>
                </h2>
                <p className="mt-6 text-[#dcdcdc]/70 leading-relaxed text-lg">
                  We're not a consultancy. We're the invisible technology layer
                  that powers your consultancy. Your students never see us —
                  they see you.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <FaLayerGroup />, text: "White-label everything" },
                  { icon: <FaShieldAlt />, text: "Your data, always" },
                  { icon: <FaGlobe />, text: "Custom domain & brand" },
                  { icon: <FaRegLightbulb />, text: "Zero learning curve" },
                  { icon: <FaUsers />, text: "Scale to any size" },
                  { icon: <FaCog />, text: "Setup in 24 hours" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4"
                  >
                    <span className="text-[#4169E1]">{item.icon}</span>
                    <p className="text-sm font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES DEEP DIVE ── */}
      <section ref={featuresRef} className="px-6 md:px-14 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#32CD32] font-semibold uppercase tracking-[0.2em] text-sm">
              Platform Features
            </p>
            <h2 className="text-5xl md:text-7xl font-black mt-5">
              Everything You<span className="text-[#FF8C00]"> Need.</span>
            </h2>
            <p className="mt-6 text-[#dcdcdc]/60 text-lg max-w-2xl mx-auto">
              Six complete systems, deeply integrated, beautifully branded.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {FEATURES_DETAILED.map((f, i) => (
              <button
                key={f.id}
                onClick={() => setActiveFeature(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  activeFeature === i
                    ? "border-[#4169E1] bg-[#4169E1]/20 text-white"
                    : "border-white/10 bg-white/5 text-[#dcdcdc]/60 hover:border-white/20 hover:text-white"
                }`}
              >
                <span
                  style={{ color: activeFeature === i ? f.color : undefined }}
                >
                  {f.icon}
                </span>
                {f.title.split(" ").slice(0, 2).join(" ")}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-[36px] overflow-hidden"
            >
              <div className="grid lg:grid-cols-2">
                <div className="p-10 md:p-14">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: `${FEATURES_DETAILED[activeFeature].color}20`,
                        color: FEATURES_DETAILED[activeFeature].color,
                      }}
                    >
                      {FEATURES_DETAILED[activeFeature].icon}
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{
                        background: `${FEATURES_DETAILED[activeFeature].color}20`,
                        color: FEATURES_DETAILED[activeFeature].color,
                      }}
                    >
                      {FEATURES_DETAILED[activeFeature].badge}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black leading-tight">
                    {FEATURES_DETAILED[activeFeature].title}
                  </h3>
                  <p
                    className="mt-2 text-lg font-semibold"
                    style={{ color: FEATURES_DETAILED[activeFeature].color }}
                  >
                    {FEATURES_DETAILED[activeFeature].tagline}
                  </p>
                  <p className="mt-5 text-[#dcdcdc]/70 leading-relaxed text-lg">
                    {FEATURES_DETAILED[activeFeature].description}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {FEATURES_DETAILED[activeFeature].points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheckCircle
                          className="mt-0.5 shrink-0"
                          style={{
                            color: FEATURES_DETAILED[activeFeature].color,
                          }}
                        />
                        <span className="text-[#dcdcdc]/80">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="flex items-center justify-center p-10 md:p-14"
                  style={{
                    background: `radial-gradient(ellipse at center, ${FEATURES_DETAILED[activeFeature].color}08, transparent 70%)`,
                    borderLeft: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="w-full max-w-sm">
                    {FEATURES_DETAILED[activeFeature].preview}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 md:px-14 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#4169E1] font-semibold uppercase tracking-[0.2em] text-sm">
              Simple Onboarding
            </p>
            <h2 className="text-5xl md:text-7xl font-black mt-5">
              Live In<span className="text-[#32CD32]"> 24 Hours.</span>
            </h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <div className="grid md:grid-cols-4 gap-8">
              {PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-2xl mx-auto md:mx-0 mb-6 relative z-10"
                    style={{
                      background: `${step.color}20`,
                      border: `1px solid ${step.color}30`,
                      color: step.color,
                    }}
                  >
                    {step.icon}
                    <div
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center md:text-left">
                    {step.title}
                  </h3>
                  <p className="text-[#dcdcdc]/60 leading-relaxed text-center md:text-left">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="px-6 md:px-14 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#FF8C00] font-semibold uppercase tracking-[0.2em] text-sm">
              Why Switch
            </p>
            <h2 className="text-5xl md:text-7xl font-black mt-5">
              See The<span className="text-[#FF8C00]"> Difference.</span>
            </h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
            <div className="grid grid-cols-4 bg-white/5 border-b border-white/10">
              <div className="p-5 text-sm font-semibold text-[#dcdcdc]/50">
                Feature
              </div>
              <div className="p-5 text-center">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#4169E1]/20 border border-[#4169E1]/40 px-3 py-1.5 rounded-xl">
                  <FaLayerGroup className="text-[#4169E1]" />
                  Our Platform
                </div>
              </div>
              <div className="p-5 text-center text-sm font-semibold text-[#dcdcdc]/50">
                Traditional Agency
              </div>
              <div className="p-5 text-center text-sm font-semibold text-[#dcdcdc]/50">
                Generic SaaS
              </div>
            </div>
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-4 border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <div className="p-5 text-sm text-[#dcdcdc]/80">{row.label}</div>
                <div className="p-5 flex justify-center">
                  <FaCheckCircle className="text-[#32CD32] text-lg" />
                </div>
                <div className="p-5 flex justify-center">
                  {row.traditional ? (
                    <FaCheckCircle className="text-[#32CD32]/50 text-lg" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-white/20 rounded-full" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex justify-center">
                  {row.generic ? (
                    <FaCheckCircle className="text-[#32CD32]/50 text-lg" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-white/20 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCALABILITY SECTION ── */}
      <section className="px-6 md:px-14 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0f1e] to-[#0d1428] border border-white/10 rounded-[40px] p-12 md:p-20">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#4169E1]/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#32CD32]/10 blur-[100px] rounded-full" />
            <div className="relative grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#4169E1]/15 border border-[#4169E1]/30 rounded-full px-4 py-2 text-sm text-[#9bb2ff] mb-8">
                  <FaChartLine />
                  Enterprise-Ready Infrastructure
                </div>
                <h2 className="text-4xl md:text-6xl font-black leading-tight">
                  From <span className="text-[#4169E1]">10 students</span>
                  <br />
                  to <span className="text-[#32CD32]">10,000 students</span>
                  <br />— one platform.
                </h2>
                <p className="mt-8 text-[#dcdcdc]/70 leading-relaxed text-lg">
                  Our infrastructure scales automatically as your agency grows.
                  Add counselors, branches, and students without ever worrying
                  about technical limits.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    { label: "Unlimited students", icon: <FaUserGraduate /> },
                    { label: "Unlimited counselors", icon: <FaUsers /> },
                    { label: "Multiple branches", icon: <FaBuilding /> },
                    { label: "99.9% uptime SLA", icon: <FaShieldAlt /> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[#32CD32] text-sm">
                        {item.icon}
                      </span>
                      <p className="text-sm text-[#dcdcdc]/80">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <ScalabilityVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 md:px-14 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#32CD32] font-semibold uppercase tracking-[0.2em] text-sm">
              Partner Stories
            </p>
            <h2 className="text-5xl md:text-7xl font-black mt-5">
              Agencies That<span className="text-[#4169E1]"> Scaled.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-[28px] p-8 hover:border-[#4169E1]/30 transition-all"
              >
                <FaQuoteLeft className="text-[#4169E1]/40 text-3xl mb-6" />
                <p className="text-[#dcdcdc]/80 leading-relaxed mb-8">
                  {t.text}
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-12 h-12 rounded-2xl bg-[#4169E1]/20 flex items-center justify-center font-black text-sm text-[#4169E1]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-[#dcdcdc]/50">{t.agency}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <FaStar key={i} className="text-[#FF8C00] text-xs" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-14 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black">
              Common<span className="text-[#FF8C00]"> Questions.</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <p className="font-semibold text-lg pr-6">{faq.q}</p>
                  <FaChevronDown
                    className={`shrink-0 text-[#4169E1] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[#dcdcdc]/70 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 md:px-14 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#4169E1]/25 via-[#0f172a] to-[#32CD32]/15 border border-white/10 rounded-[48px] px-8 py-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(65,105,225,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(50,205,50,0.15),transparent_60%)]" />

            <div className="absolute top-10 left-10 w-16 h-16 rounded-2xl bg-[#4169E1]/20 border border-[#4169E1]/30 flex items-center justify-center text-[#4169E1] text-xl hidden md:flex">
              <FaLayerGroup />
            </div>
            <div className="absolute top-10 right-10 w-16 h-16 rounded-2xl bg-[#32CD32]/20 border border-[#32CD32]/30 flex items-center justify-center text-[#32CD32] text-xl hidden md:flex">
              <FaChartLine />
            </div>
            <div className="absolute bottom-10 left-10 w-16 h-16 rounded-2xl bg-[#FF8C00]/20 border border-[#FF8C00]/30 flex items-center justify-center text-[#FF8C00] text-xl hidden md:flex">
              <FaUsers />
            </div>
            <div className="absolute bottom-10 right-10 w-16 h-16 rounded-2xl bg-[#9b59b6]/20 border border-[#9b59b6]/30 flex items-center justify-center text-[#9b59b6] text-xl hidden md:flex">
              <FaGlobe />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-sm mb-10">
                <div className="w-2 h-2 rounded-full bg-[#32CD32] animate-pulse" />
                Now accepting new partners
              </div>
              <h2 className="text-5xl md:text-7xl font-black leading-[1.05]">
                Ready To Power
                <span className="block text-[#FF8C00]">Your Agency?</span>
              </h2>
              <p className="mt-8 text-xl text-[#dcdcdc]/70 max-w-2xl mx-auto leading-relaxed">
                Join agencies already running their entire consultancy on our
                platform. Your brand, our infrastructure — live in 24 hours.
              </p>
              <div className="mt-12 flex flex-wrap gap-5 justify-center">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openForm}
                  className="bg-[#FF8C00] hover:bg-[#ff9f2f] text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all shadow-[0_12px_48px_rgba(255,140,0,0.4)]"
                >
                  Start Partner Journey
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openForm}
                  className="flex items-center gap-3 border border-white/20 hover:border-white/40 hover:bg-white/5 px-10 py-5 rounded-2xl text-xl font-bold transition-all"
                >
                  <FaEnvelope />
                  Talk to Sales
                </motion.button>
              </div>
              <p className="mt-8 text-sm text-[#dcdcdc]/40">
                No setup fees. Cancel anytime. White-glove onboarding included.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── HERO DASHBOARD ─── */

function HeroDashboard() {
  return (
    <div className="relative bg-[#080d1c] border border-white/10 rounded-[28px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between px-6 py-4 bg-white/3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="bg-white/8 rounded-lg px-4 py-1.5 text-xs text-white/40 font-mono ml-4">
            portal.<span className="text-[#4169E1]">youragency</span>
            .com/dashboard
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#4169E1] flex items-center justify-center text-xs font-black">
            YA
          </div>
          <p className="text-sm font-semibold hidden md:block">Your Agency</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-0">
        <div className="hidden md:block border-r border-white/8 p-5 space-y-2">
          {[
            { icon: <FaChartLine />, label: "Overview", active: true },
            { icon: <FaUserGraduate />, label: "Students", active: false },
            { icon: <FaUniversity />, label: "Applications", active: false },
            { icon: <FaFileAlt />, label: "Documents", active: false },
            { icon: <FaUsers />, label: "Team", active: false },
            { icon: <FaBell />, label: "Automations", active: false },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.active ? "bg-[#4169E1]/20 text-white border border-[#4169E1]/30" : "text-white/40"}`}
            >
              <span style={{ color: item.active ? BLUE : undefined }}>
                {item.icon}
              </span>
              {item.label}
            </div>
          ))}
        </div>
        <div className="md:col-span-2 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Active Students", value: "128", color: BLUE },
              { label: "Applications", value: "47", color: GREEN },
              { label: "Visas Pending", value: "12", color: ORANGE },
              { label: "Revenue", value: "$18k", color: "#9b59b6" },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-2xl p-4"
                style={{
                  background: `${card.color}12`,
                  border: `1px solid ${card.color}25`,
                }}
              >
                <p className="text-xs text-white/40">{card.label}</p>
                <p
                  className="text-2xl font-black mt-1"
                  style={{ color: card.color }}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-semibold">Application Pipeline</p>
              <span className="text-xs text-[#32CD32]">+18% this month</span>
            </div>
            <div className="flex items-end gap-2 h-16">
              {[40, 65, 55, 80, 70, 90, 75, 85, 60, 95, 80, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${h}%`,
                    background: h >= 90 ? BLUE : `${BLUE}35`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
            <p className="text-sm font-semibold mb-4">Recent Students</p>
            <div className="space-y-3">
              {[
                {
                  name: "Aisha Malik",
                  dest: "Canada",
                  status: "Offer Received",
                  c: GREEN,
                },
                {
                  name: "James Osei",
                  dest: "UK",
                  status: "Under Review",
                  c: BLUE,
                },
                {
                  name: "Sara Kim",
                  dest: "Australia",
                  status: "Docs Required",
                  c: ORANGE,
                },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: `${s.c}20`, color: s.c }}
                  >
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{s.name}</p>
                    <p className="text-xs text-white/40">{s.dest}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full shrink-0"
                    style={{ background: `${s.c}15`, color: s.c }}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SCALABILITY VISUAL ─── */

function ScalabilityVisual() {
  const tiers = [
    {
      label: "Startup",
      students: "10–50",
      icon: <FaUserGraduate />,
      color: BLUE,
      h: "40%",
    },
    {
      label: "Growing",
      students: "50–500",
      icon: <FaUsers />,
      color: GREEN,
      h: "60%",
    },
    {
      label: "Enterprise",
      students: "500–10k+",
      icon: <FaBuilding />,
      color: ORANGE,
      h: "100%",
    },
  ];
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
      <p className="text-sm font-semibold text-[#dcdcdc]/60 mb-6">
        Agency Growth Tiers
      </p>
      <div className="flex items-end gap-4 h-40 mb-4">
        {tiers.map((t, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <p className="text-xs text-white/40">{t.students}</p>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: t.h }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className="w-full rounded-t-xl flex items-start justify-center pt-3"
              style={{
                background: `${t.color}25`,
                border: `1px solid ${t.color}40`,
              }}
            >
              <span style={{ color: t.color }}>{t.icon}</span>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {tiers.map((t, i) => (
          <div key={i} className="flex-1 text-center">
            <p className="text-xs font-semibold" style={{ color: t.color }}>
              {t.label}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-[#4169E1]/10 border border-[#4169E1]/20 rounded-2xl text-center">
        <p className="text-sm text-[#dcdcdc]/70">
          Same platform. Same price structure.{" "}
          <span className="text-[#4169E1] font-bold">Infinite scale.</span>
        </p>
      </div>
    </div>
  );
}
