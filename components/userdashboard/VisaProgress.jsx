"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function VisaPage() {
  const [visaStages, setVisaStages] = useState([
    { stage: "Receive Offer Letter", done: true },
    { stage: "Accept Offer", done: true },
    { stage: "Pay Tuition Deposit", done: false },
    { stage: "Receive Visa Document (I-20 / CAS)", done: false },
    { stage: "Prepare Visa Documents", done: false },
    { stage: "Book Visa Appointment", done: false },
    { stage: "Biometrics / Interview", done: false },
    { stage: "Visa Decision", done: false },
  ]);

  const toggleStage = (index) => {
    const updated = [...visaStages];
    updated[index].done = !updated[index].done;
    setVisaStages(updated);
  };

  const progress =
    (visaStages.filter((stage) => stage.done).length / visaStages.length) * 100;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Visa Application</h1>
        <p className="text-gray-400 mt-2">
          Track your visa process and complete the required steps.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <div className="flex justify-between mb-3 text-sm text-gray-300">
          <span>Visa Progress</span>
          <span>
            {visaStages.filter((s) => s.done).length}/{visaStages.length}{" "}
            Completed
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-[#4169E1] h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {visaStages.map((stage, index) => (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  stage.done
                    ? "bg-green-400 text-black"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {index + 1}
              </div>

              <div>
                <p className="text-white font-semibold">{stage.stage}</p>
                <p className="text-sm text-gray-400">
                  {stage.done ? "Completed" : "Pending"}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleStage(index)}
              className="text-sm bg-[#4169E1] px-4 py-2 rounded-lg text-white hover:bg-[#3555c8]"
            >
              {stage.done ? "Undo" : "Mark Done"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Embassy Info */}
      <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          Embassy Information
        </h2>

        <p className="text-gray-400 text-sm mb-2">
          Check your country's embassy website for visa instructions and
          updates.
        </p>

        <button className="text-[#4169E1] font-semibold hover:underline">
          Visit Embassy Website →
        </button>
      </div>
    </div>
  );
}
