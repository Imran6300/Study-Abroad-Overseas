"use client";

import { useState } from "react";
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

export default function FreeAssessmentPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

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

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const updateForm = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const handleSubmit = () => {
    console.log("Assessment Submitted:", formData);
    alert("Assessment submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4 py-20">
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
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-right">
            Step {step} of 4
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
                    data={formData}
                    updateForm={updateForm}
                    prevStep={prevStep}
                    submit={handleSubmit}
                  />
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
