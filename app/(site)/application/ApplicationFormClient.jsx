"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

import Step1Personal from "@/components/applicationForm/Step1Personal";
import Step2Education from "@/components/applicationForm/Step2Education";
import Step3Tests from "@/components/applicationForm/Step3Tests";
import Step4Program from "@/components/applicationForm/Step4Program";
import Step5Experience from "@/components/applicationForm/Step5Experience";
import Step6Finance from "@/components/applicationForm/Step6Finance";
import Step7Documents from "@/components/applicationForm/Step7Documents";
import Step8Final from "@/components/applicationForm/Step8Final";
import MessageBox from "@/components/ui/MessageBox";

const initialFormData = {
  fullName: "",
  dob: "",
  gender: "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  address: "",
  mobile: "",
  whatsapp: "",
  email: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",

  qualification: "",
  school: "",
  board: "",
  passingYear: "",
  cgpa: "",
  backlogs: "",
  backlogsExplanation: "",

  englishTest: "",
  testDate: "",
  score: "",
  listening: "",
  reading: "",
  writing: "",
  speaking: "",

  studyLevel: "",
  field: "",
  intake: "",
  budget: "",
  appliedUniversity: null,

  careerGoals: "",
  activities: "",
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
};

export default function ApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const universitySlug = searchParams.get("university");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [clientSecret, setClientSecret] = useState(null);

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const saveTimeoutRef = useRef(null);

  // Check access
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

        if (!res.ok) {
          const data = await res.json();
          if (data.redirect) {
            setMessage(
              data.redirect === "/login"
                ? "Please login to access the application."
                : "Please complete the assessment first.",
            );
            setStatus("error");
            setTimeout(() => router.push(data.redirect), 1800);
            return;
          }
          throw new Error("Access check failed");
        }

        setCheckingAccess(false);
      } catch (err) {
        console.error("Access check failed", err);
        setStatus("error");
        setMessage("Unable to verify access. Please login again.");
        setTimeout(() => router.push("/login"), 2000);
      }
    };

    checkAccess();
  }, [router]);

  // Load university info
  useEffect(() => {
    if (checkingAccess || !universitySlug) return;

    const fetchUniversity = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${universitySlug}`,
        );
        const data = await res.json();

        if (!data.success || !data.university) {
          setStatus("error");
          setMessage("University not found.");
          setTimeout(() => router.push("/universities"), 1800);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          appliedUniversity: data.university,
        }));
      } catch (err) {
        console.error("Failed to load university", err);
      }
    };

    fetchUniversity();
  }, [checkingAccess, universitySlug, router]);

  // Determine which step to show based on draft
  const determineStepFromDraft = (draft) => {
    if (!draft) return 1;

    if (draft.personalInfo?.fullName) {
      if (draft.finance?.funds) return 7;
      if (draft.experience?.careerGoals) return 6;
      if (draft.programPreference?.studyLevel) return 5;
      if (draft.tests?.englishTest) return 4;
      if (draft.education?.qualification) return 3;
      return 2;
    }
    return 1;
  };

  // Load draft
  useEffect(() => {
    if (checkingAccess) return;

    const loadDraft = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/draft`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const { success, draft } = await res.json();
        if (!success || !draft) return;

        setFormData((prev) => ({
          ...prev,
          fullName: draft.personalInfo?.fullName || "",
          dob: draft.personalInfo?.dob || "",
          gender: draft.personalInfo?.gender || "",
          nationality: draft.personalInfo?.nationality || "",
          passportNumber: draft.personalInfo?.passportNumber || "",
          passportExpiry: draft.personalInfo?.passportExpiry || "",
          address: draft.personalInfo?.address || "",
          mobile: draft.personalInfo?.mobile || "",
          whatsapp: draft.personalInfo?.whatsapp || "",
          email: draft.personalInfo?.email || "",
          emergencyName: draft.personalInfo?.emergencyContact?.name || "",
          emergencyRelation:
            draft.personalInfo?.emergencyContact?.relation || "",
          emergencyPhone: draft.personalInfo?.emergencyContact?.phone || "",

          ...draft.education,
          ...draft.tests,

          studyLevel: draft.programPreference?.studyLevel || "",
          field: draft.programPreference?.field || "",
          intake: draft.programPreference?.intake || "",
          budget: draft.programPreference?.budget || "",

          careerGoals: draft.experience?.careerGoals || "",
          activities: draft.experience?.activities || "",
          experience: draft.experience?.workExperience || "",

          ...draft.finance,
        }));

        const nextStep = determineStepFromDraft(draft);
        setStep(nextStep);

        setStatus("success");
        setMessage("Draft restored successfully");
      } catch (err) {
        console.error("Failed to load draft", err);
      }
    };

    loadDraft();
  }, [checkingAccess]);

  // Debounced auto-save draft
  const saveDraft = useCallback(async () => {
    if (
      !formData.fullName.trim() &&
      !formData.email.trim() &&
      !formData.mobile.trim()
    ) {
      return;
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/draft`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personalInfo: {
              fullName: formData.fullName,
              dob: formData.dob,
              gender: formData.gender,
              nationality: formData.nationality,
              passportNumber: formData.passportNumber,
              passportExpiry: formData.passportExpiry,
              address: formData.address,
              mobile: formData.mobile,
              whatsapp: formData.whatsapp,
              email: formData.email,
              emergencyContact: {
                name: formData.emergencyName,
                relation: formData.emergencyRelation,
                phone: formData.emergencyPhone,
              },
            },
            education: {
              qualification: formData.qualification,
              school: formData.school,
              board: formData.board,
              passingYear: formData.passingYear,
              cgpa: formData.cgpa,
              backlogs: formData.backlogs,
              backlogsExplanation: formData.backlogsExplanation,
            },
            tests: {
              englishTest: formData.englishTest,
              testDate: formData.testDate,
              score: formData.score,
              listening: formData.listening,
              reading: formData.reading,
              writing: formData.writing,
              speaking: formData.speaking,
            },
            programPreference: {
              universitySlug,
              studyLevel: formData.studyLevel,
              field: formData.field,
              intake: formData.intake,
              budget: formData.budget,
            },
            experience: {
              careerGoals: formData.careerGoals,
              activities: formData.activities,
              workExperience: formData.experience,
            },
            finance: {
              sponsor: formData.sponsor,
              sponsorIncome: formData.sponsorIncome,
              funds: formData.funds,
            },
          }),
        },
      );
    } catch (err) {
      console.warn("Draft save failed", err);
    }
  }, [formData, universitySlug]);

  useEffect(() => {
    if (checkingAccess) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 4000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [formData, checkingAccess, saveDraft]);

  // Create payment intent when reaching step 8
  useEffect(() => {
    if (step !== 8 || clientSecret) return;

    const createIntent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create-payment-intent`,
          { method: "POST", credentials: "include" },
        );
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error("Failed to create payment intent", err);
      }
    };

    createIntent();
  }, [step, clientSecret]);

  const updateForm = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(async () => {
    await saveDraft();
    setStep((prev) => Math.min(prev + 1, 8));
  }, [saveDraft]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const submitApplication = async (paymentId) => {
    try {
      const payload = new FormData();

      // Append all non-file, non-null fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          typeof value !== "object"
        ) {
          payload.append(key, value);
        }
      });

      payload.append("universitySlug", universitySlug || "");
      payload.append("paymentId", paymentId);

      // Files
      if (formData.passport) payload.append("passport", formData.passport);
      if (formData.photo) payload.append("photo", formData.photo);
      if (formData.marksheet10)
        payload.append("marksheet10", formData.marksheet10);
      if (formData.marksheet12)
        payload.append("marksheet12", formData.marksheet12);
      if (formData.bachelorDocs)
        payload.append("bachelorDocs", formData.bachelorDocs);
      if (formData.resume) payload.append("resume", formData.resume);
      if (formData.englishScorecard)
        payload.append("englishScorecard", formData.englishScorecard);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        },
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Submission failed");
      }

      setStatus("success");
      setMessage("Application submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      setStatus("error");
      setMessage(err.message || "Failed to submit application");
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking access...
      </div>
    );
  }

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

          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Student Application Form
            </h1>
            <p className="text-gray-600 mt-2">
              Complete your application in 8 easy steps
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className={`flex flex-col items-center ${step >= s.num ? "text-blue-600" : "text-gray-400"}`}
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

          <div className="text-center mt-6 text-gray-500 text-sm">
            Step {step} of 8 • All fields are required
          </div>
        </div>
      </div>
    </>
  );
}
