"use client";

import { useState } from "react";

import Step1 from "@/components/assessment/step1";
import Step2 from "@/components/assessment/step2";
import Step3 from "@/components/assessment/step3";
import Step4 from "@/components/assessment/step4";

export default function FreeAssessmentPage() {
  const [step, setStep] = useState(1);
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateForm = (data) => setFormData((prev) => ({ ...prev, ...data }));

  const handleSubmit = () => {
    console.log("Assessment Submitted:", formData);
    alert("Assessment submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl bg-[#111827] rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white text-center">
          Free Study Abroad Assessment
        </h1>
        <p className="text-gray-400 text-center mt-2">
          Takes less than 2 minutes
        </p>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-right">
            Step {step} of 4
          </p>
        </div>

        {/* Steps */}
        <div className="mt-8">
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
        </div>
      </div>
    </div>
  );
}
