"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Step1 from "@/components/assessment/step1";
import Step2 from "@/components/assessment/step2";
import Step3 from "@/components/assessment/step3";
import Step4 from "@/components/assessment/step4";

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? "12%" : "-12%",
    opacity: 0,
    scale: 0.96,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 18,
      duration: 0.55,
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? "-12%" : "12%",
    opacity: 0,
    scale: 0.96,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 22,
      duration: 0.48,
    },
  }),
};

const TOTAL_STEPS = 4;

export default function FreeAssessmentPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLead, setHasLead] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    field: "",
    year: "",
    country: "",
    intake: "",
    budget: "",
    examStatus: "",
    experience: "",
  });
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/me`,
          {
            credentials: "include",
          },
        );

        const data = await res.json();

        if (res.ok && data.lead) {
          const lead = data.lead;

          setHasLead(true);

          setFormData({
            name: lead.name || "",
            email: lead.email || "",
            phone: lead.phone || "",
            education: lead.qualification || "",
            field: lead.field || "",
            year: lead.passingYear || "",
            country: lead.preferredCountry || "",
            intake: lead.preferredIntake || "",
            budget: lead.budget || "",
            examStatus: lead.examStatus || "",
            experience: lead.workExperience || "",
          });
        }
      } catch (err) {
        console.error("Failed to load assessment", err);
      }
    };

    fetchLead();
  }, []);

  // ✅ Step bounds protection
  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const updateForm = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const handleSubmit = async (captchaToken) => {
    if (loading) return;

    setLoading(true);
    setSubmitStatus("loading");

    try {
      const url = hasLead
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead/me`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lead`;

      const method = hasLead ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          qualification: formData.education,
          field: formData.field,
          passingYear: formData.year,
          preferredCountry: formData.country,
          preferredIntake: formData.intake,
          budget: formData.budget,
          examStatus: formData.examStatus,
          workExperience: formData.experience,
          captchaToken,
        }),
      });

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("BACKEND RESPONSE:", data);

      if (!res.ok) {
        setErrorMessage(data.message || "Something went wrong");
        setSubmitStatus("error");
        return;
      }

      setSubmitStatus("success");
      setHasLead(true);
    } catch (err) {
      console.log("FULL ERROR:", err);
      setErrorMessage("Network error. Please try again.");
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4 py-20">
      <div className="flex gap-6 items-start">
        <div className="w-full max-w-2xl bg-[#111827] rounded-2xl shadow-xl p-8 overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold text-white text-center">
              Free Study Abroad Assessment
            </h1>
            <p className="text-gray-400 text-center mt-2">
              Takes less than 2 minutes
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-indigo-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2 text-right">
              Step {step} of {TOTAL_STEPS}
            </p>
          </div>

          {/* Animated steps */}
          <div className="mt-8">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {step === 1 && (
                    <Step1
                      data={formData}
                      updateForm={updateForm}
                      nextStep={nextStep}
                    />
                  )}

                  {step === 2 && (
                    <Step2
                      data={formData}
                      updateForm={updateForm}
                      nextStep={nextStep}
                      prevStep={prevStep}
                    />
                  )}

                  {step === 3 && (
                    <Step3
                      data={formData}
                      updateForm={updateForm}
                      nextStep={nextStep}
                      prevStep={prevStep}
                    />
                  )}

                  {step === 4 && (
                    <Step4
                      prevStep={prevStep}
                      submit={handleSubmit}
                      loading={loading}
                      data={formData}
                      updateForm={updateForm}
                      submitStatus={submitStatus}
                      isEdit={hasLead}
                    />
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence>
          {(submitStatus === "success" || submitStatus === "error") && (
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-24 right-6 z-50 flex items-center gap-3 rounded-lg shadow-lg px-4 py-3
        ${
          submitStatus === "success"
            ? "bg-[#111827] border border-green-500"
            : "bg-[#111827] border border-red-500"
        }`}
            >
              {/* Message */}
              <span
                className={`text-sm font-medium ${
                  submitStatus === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {submitStatus === "success"
                  ? "✅ Assessment Submitted Successfully"
                  : `❌ ${errorMessage}`}
              </span>

              {/* Close Button */}
              <button
                onClick={() => setSubmitStatus("idle")}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
