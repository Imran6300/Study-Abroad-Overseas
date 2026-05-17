"use client";

import { motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";

import { updateVisaStepAction } from "@/store/actions/visaActions";

export default function VisaProgress({ visa }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const visaStages = visa.steps || [];

  const progress = visa.progressPercentage || 0;

  const handleToggleStage = async (step) => {
    const updatedStatus = step.status === "completed" ? "pending" : "completed";

    dispatch(
      updateVisaStepAction({
        visaId: visa._id,

        stepId: step._id,

        data: {
          status: updatedStatus,

          updatedBy: user?._id,

          updatedByRole: "User",
        },
      }),
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Visa Application</h1>

        <p className="text-gray-400 mt-2">
          Track your visa process and complete required steps.
        </p>
      </div>

      {/* PROGRESS */}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <div className="flex justify-between mb-3 text-sm text-gray-300">
          <span>Visa Progress</span>

          <span>
            {visaStages.filter((s) => s.status === "completed").length}/
            {visaStages.length} Completed
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-[#4169E1] h-3 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          ></div>
        </div>
      </div>

      {/* TIMELINE */}

      <div className="space-y-6">
        {visaStages.map((step, index) => (
          <motion.div
            key={step._id}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step.status === "completed"
                    ? "bg-green-400 text-black"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {index + 1}
              </div>

              <div>
                <p className="text-white font-semibold">{step.title}</p>

                <p className="text-sm text-gray-400 capitalize">
                  {step.status}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggleStage(step)}
              className="text-sm bg-[#4169E1] px-4 py-2 rounded-lg text-white hover:bg-[#3555c8]"
            >
              {step.status === "completed" ? "Undo" : "Mark Done"}
            </button>
          </motion.div>
        ))}
      </div>

      {/* EMBASSY */}

      <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          Embassy Information
        </h2>

        <p className="text-gray-400 text-sm mb-2">
          Check embassy website for visa instructions.
        </p>

        <a
          href={visa.embassyWebsite}
          target="_blank"
          className="text-[#4169E1] font-semibold hover:underline"
        >
          Visit Embassy Website →
        </a>
      </div>
    </div>
  );
}
