"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const COUNTRIES = ["USA", "UK", "Canada", "Australia", "Germany", "Ireland"];

export default function ProfileEvaluation() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    education: "",
    experience: "",
    testStatus: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Submitting profile data:", data);
    alert(
      "Thank you! Your free evaluation request has been submitted. We'll contact you within 24–48 hours."
    );
  };

  return (
    <section className="min-h-screen mt-10 bg-gradient-to-b from-[#f8faff] to-[#e6efff] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* LEFT – INFO */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Get Your <span className="text-blue-600">Free</span> Profile
            Evaluation
            <span className="block text-2xl md:text-3xl mt-4 text-gray-700 font-normal">
              in 24–48 Hours – Personalized Report
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-700 leading-relaxed">
            Our expert counsellors will review your academic & professional
            background and give you clear recommendations on the best countries,
            universities, courses, visa chances, and scholarships — 100% free,
            no obligation.
          </p>

          <ul className="mt-10 space-y-5 text-gray-800 text-lg">
            <li className="flex items-start">
              <span className="text-green-500 mr-4 text-2xl">🌍</span>
              <span>Country & course suitability</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-4 text-2xl">🏫</span>
              <span>University shortlisting guidance</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-4 text-2xl">🛂</span>
              <span>Visa feasibility check</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-4 text-2xl">💰</span>
              <span>Scholarship & budget insight</span>
            </li>
          </ul>

          {/* Social Proof */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <p className="mt-2 text-gray-700 font-medium">
                Students Evaluated
              </p>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-blue-600">98%</div>
              <p className="mt-2 text-gray-700 font-medium">
                Proceed to Next Steps
              </p>
            </div>
            <div className="text-center p-6 bg-white/70 rounded-xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-blue-600">Free</div>
              <p className="mt-2 text-gray-700 font-medium">
                No Hidden Charges
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-10 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <p className="text-gray-700 italic">
                "Got detailed feedback in 24 hours — helped me choose Canada
                over USA!"
              </p>
              <p className="mt-3 font-medium text-gray-800">
                — Ayesha K., Hyderabad (Going to Toronto)
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <p className="text-gray-700 italic">
                "Clear visa chances & scholarship options — very helpful!"
              </p>
              <p className="mt-3 font-medium text-gray-800">
                — Mohammed A., Secunderabad (Admitted to UK)
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/80 shadow-md border border-gray-100">
            <p className="font-semibold text-gray-800 mb-3 text-lg">
              Popular Study Destinations We Cover
            </p>
            <div className="flex flex-wrap gap-3">
              {COUNTRIES.map((c) => (
                <span
                  key={c}
                  className="px-5 py-2.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT – FORM */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 lg:p-12 border border-gray-100"
        >
          {/* Progress */}
          <div className="flex items-center justify-between mb-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1.5 mx-2 rounded-full transition-all ${
                  step >= s ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Basic Details
              </h3>

              <div className="space-y-6">
                <input
                  name="name"
                  placeholder="Full Name *"
                  value={data.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  value={data.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
                <input
                  name="phone"
                  placeholder="Phone / WhatsApp Number *"
                  value={data.phone}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-10 w-full btn-primary text-lg py-4"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Academic & Professional Background
              </h3>

              <div className="space-y-6">
                <select
                  name="country"
                  value={data.country}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Preferred Study Country (optional)</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <input
                  name="education"
                  placeholder="Highest Qualification (e.g., B.Tech CSE 2024)"
                  value={data.education}
                  onChange={handleChange}
                  className="input"
                />

                <select
                  name="experience"
                  value={data.experience}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Work Experience</option>
                  <option value="0-1">0–1 Years</option>
                  <option value="1-3">1–3 Years</option>
                  <option value="3+">3+ Years</option>
                </select>
              </div>

              <div className="flex justify-between items-center mt-10">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-800 font-medium transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="btn-primary px-10 py-4"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Test Status & Submit
              </h3>

              <select
                name="testStatus"
                value={data.testStatus}
                onChange={handleChange}
                className="input mb-8"
              >
                <option value="">English Test Status</option>
                <option value="completed">
                  IELTS / TOEFL / PTE / Duolingo Completed
                </option>
                <option value="planning">Planning to Take Soon</option>
                <option value="not-taken">Not Taken Yet</option>
              </select>

              <p className="text-gray-600 mb-6 leading-relaxed">
                <strong>What you'll get:</strong> Personalized report with
                country/university recommendations, visa feasibility,
                scholarship options, and next steps — delivered via
                email/WhatsApp within 24–48 hours.
              </p>

              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-5 px-8 rounded-xl shadow-xl transition duration-300 text-lg flex items-center justify-center gap-2"
              >
                Get My Free Evaluation Report →
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                🔒 Your information is 100% confidential and used only for your
                evaluation
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                We'll contact you via WhatsApp for fastest response (most
                students prefer this)
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
