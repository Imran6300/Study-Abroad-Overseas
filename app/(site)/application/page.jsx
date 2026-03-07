"use client";

import { useState, useEffect } from "react";
import Step1Personal from "@/components/applicationForm/Step1Personal";
import { useRouter } from "next/navigation";
import Step2Education from "@/components/applicationForm/Step2Education";
import Step3Tests from "@/components/applicationForm/Step3Tests";
import Step4Program from "@/components/applicationForm/Step4Program";
import Step5Experience from "@/components/applicationForm/Step5Experience";
import Step6Finance from "@/components/applicationForm/Step6Finance";
import Step7Documents from "@/components/applicationForm/Step7Documents";
import Step8Final from "@/components/applicationForm/Step8Final";

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const text = await res.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          if (data.redirect === "/login") {
            router.push("/login");
            return;
          }

          if (data.redirect === "/assessment") {
            router.push("/assessment");
            return;
          }
        }

        setCheckingAccess(false);
      } catch (error) {
        console.error(error);
        router.push("/login");
      }
    };

    checkAccess();
  }, [router]);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    mobile: "",
    whatsapp: "",
    email: "",
    address: "",
    fatherName: "",
    fatherOccupation: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    qualification: "",
    school: "",
    university: "",
    board: "",
    passingYear: "",
    cgpa: "",
    englishTest: "",
    testDate: "",
    score: "",
    studyLevel: "",
    field: "",
    intake: "",
    universities: "",
    budget: "",
    careerGoals: "",
    activities: "",
    extracurricular: "",
    experience: "",
    sponsor: "",
    sponsorIncome: "",
    funds: "",
    passport: null,
    photo: null,
    marksheet10: null,
    marksheet12: null,
    bachelorDocs: null,
    englishScorecard: null,
    resume: null,
    source: "",
    comments: "",
    agreed: false,
  });

  const updateForm = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submitApplication = () => {
    console.log("APPLICATION DATA", formData);
  };

  const steps = [
    { num: 1, title: "Personal" },
    { num: 2, title: "Education" },
    { num: 3, title: "Tests" },
    { num: 4, title: "Program" },
    { num: 5, title: "Experience" },
    { num: 6, title: "Finance" },
    { num: 7, title: "Documents" },
    { num: 8, title: "Review" },
  ];

  if (checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking access...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: "96px" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Student Application Form
          </h1>
          <p className="text-gray-600 mt-2">
            Complete your application in 8 easy steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`flex flex-col items-center ${
                  step >= s.num ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    step > s.num
                      ? "bg-blue-600 text-white"
                      : step === s.num
                        ? "bg-blue-600 text-white ring-4 ring-blue-200"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span className="hidden sm:block text-xs mt-1 font-medium">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          {step === 1 && (
            <Step1Personal
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
            />
          )}
          {step === 2 && (
            <Step2Education
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 3 && (
            <Step3Tests
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 4 && (
            <Step4Program
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 5 && (
            <Step5Experience
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 6 && (
            <Step6Finance
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 7 && (
            <Step7Documents
              data={formData}
              updateForm={updateForm}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          {step === 8 && (
            <Step8Final
              data={formData}
              updateForm={updateForm}
              prevStep={prevStep}
              submit={submitApplication}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Step {step} of 8 • All fields are required
        </div>
      </div>
    </div>
  );
}
