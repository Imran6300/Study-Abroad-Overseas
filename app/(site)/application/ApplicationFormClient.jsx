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
import MessageBox from "@/components/ui/MessageBox";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

import { useSearchParams } from "next/navigation";

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const universitySlug = searchParams.get("university");
  const [clientSecret, setClientSecret] = useState(null);
  useEffect(() => {
    if (!universitySlug && !checkingAccess) {
      setStatus("error");
      setMessage("Please apply from a university page.");
      setTimeout(() => router.push("/universities"), 1500);
    }
  }, [universitySlug, checkingAccess]);
  useEffect(() => {
    if (!universitySlug || checkingAccess) return;

    const fetchUniversity = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/university/${universitySlug}`,
        );

        const data = await res.json();

        if (!data.success || !data.university) {
          setStatus("error");
          setMessage("University not found.");
          setTimeout(() => router.push("/universities"), 1500);
          return;
        }

        updateForm({
          appliedUniversity: data.university,
        });
      } catch (err) {
        console.error("Failed to fetch university", err);
      }
    };

    fetchUniversity();
  }, [universitySlug, checkingAccess]);
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/check-access`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          if (data.redirect === "/login") {
            setStatus("error");
            setMessage("Please login to access the application.");
            setTimeout(() => router.push("/login"), 1500);
            return;
          }

          if (data.redirect === "/assessment") {
            setStatus("error");
            setMessage("Please complete the assessment first.");
            setTimeout(() => router.push("/assessment"), 1500);
            return;
          }
        }

        setCheckingAccess(false);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Unable to verify your access.");
        setTimeout(() => router.push("/login"), 1500);
      }
    };

    checkAccess();
  }, [router]);
  useEffect(() => {
    if (step !== 8) return;

    const createIntent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-payment-intent`,
          { method: "POST" },
        );

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Payment intent error", err);
      }
    };

    createIntent();
  }, [step]);
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
    board: "",
    passingYear: "",
    cgpa: "",
    englishTest: "",
    testDate: "",
    score: "",
    studyLevel: "",
    field: "",
    intake: "",
    appliedUniversity: null,
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

  const submitApplication = async (paymentId) => {
    try {
      const form = new FormData();

      // TEXT FIELDS
      form.append("fullName", formData.fullName);
      form.append("dob", formData.dob);
      form.append("gender", formData.gender);
      form.append("nationality", formData.nationality);
      form.append("passportNumber", formData.passportNumber);
      form.append("passportExpiry", formData.passportExpiry);
      form.append("mobile", formData.mobile);
      form.append("whatsapp", formData.whatsapp);
      form.append("email", formData.email);
      form.append("address", formData.address);

      form.append("paymentId", paymentId);

      form.append("qualification", formData.qualification);
      form.append("school", formData.school);
      form.append("board", formData.board);
      form.append("passingYear", formData.passingYear);
      form.append("cgpa", formData.cgpa);

      form.append("englishTest", formData.englishTest);
      form.append("testDate", formData.testDate);
      form.append("score", formData.score);

      form.append("studyLevel", formData.studyLevel);
      form.append("field", formData.field);
      form.append("intake", formData.intake);
      form.append("budget", formData.budget);

      form.append("careerGoals", formData.careerGoals);
      form.append("activities", formData.activities);
      form.append("experience", formData.experience);

      form.append("sponsor", formData.sponsor);
      form.append("sponsorIncome", formData.sponsorIncome);
      form.append("funds", formData.funds);

      form.append("source", formData.source);
      form.append("comments", formData.comments);

      form.append("university", formData.appliedUniversity?._id);

      // FILES
      if (formData.passport) form.append("passport", formData.passport);
      if (formData.photo) form.append("photo", formData.photo);
      if (formData.marksheet10)
        form.append("marksheet10", formData.marksheet10);
      if (formData.marksheet12)
        form.append("marksheet12", formData.marksheet12);
      if (formData.resume) form.append("resume", formData.resume);
      if (formData.bachelorDocs)
        form.append("bachelorDocs", formData.bachelorDocs);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`,
        {
          method: "POST",
          credentials: "include",
          body: form,
        },
      );

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setMessage("Application submitted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Failed to submit application.");
    }
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
    <>
      <MessageBox
        status={status}
        message={message}
        onClose={() => setStatus(null)}
      />
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "96px" }}
      >
        <div className="max-w-3xl mx-auto">
          {formData.appliedUniversity && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Applying to</p>

              <h3 className="font-semibold text-lg text-gray-800">
                {formData.appliedUniversity.name}
              </h3>

              <p className="text-sm text-gray-600">
                {formData.appliedUniversity.city},{" "}
                {formData.appliedUniversity.country}
              </p>
            </div>
          )}
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
            {step === 8 && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <Step8Final
                  data={formData}
                  updateForm={updateForm}
                  prevStep={prevStep}
                  submit={submitApplication}
                />
              </Elements>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-gray-500 text-sm">
            Step {step} of 8 • All fields are required
          </div>
        </div>
      </div>
    </>
  );
}
