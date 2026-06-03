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
        <h1
          className="text-3xl font-bold"
          style={{
            color: "var(--brand-accent)",
          }}
        >
          Visa Application
        </h1>

        <p
          className="mt-2"
          style={{
            color: "var(--brand-text-secondary)",
          }}
        >
          Track your visa process and complete required steps.
        </p>
      </div>

      {/* PROGRESS */}

      <div
        className="border rounded-xl p-6 mb-10"
        style={{
          backgroundColor: "var(--brand-card-bg)",
          borderColor: "var(--brand-primary)",
        }}
      >
        <div
          className="flex justify-between mb-3 text-sm"
          style={{
            color: "var(--brand-text-secondary)",
          }}
        >
          <span>Visa Progress</span>

          <span>
            {visaStages.filter((s) => s.status === "completed").length}/
            {visaStages.length} Completed
          </span>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--brand-primary)",
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
            className="
border
rounded-xl
p-5
flex
items-center
justify-between
"
            style={{
              backgroundColor: "var(--brand-card-bg)",
              borderColor: "var(--brand-primary)",
            }}
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
                <p
                  className="font-semibold"
                  style={{
                    color: "var(--brand-accent)",
                  }}
                >
                  {step.title}
                </p>

                <p
                  className="text-sm capitalize"
                  style={{
                    color: "var(--brand-text-secondary)",
                  }}
                >
                  {step.status}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleToggleStage(step)}
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--brand-accent)",
              }}
              className="
text-sm
px-4
py-2
rounded-lg
"
            >
              {step.status === "completed" ? "Undo" : "Mark Done"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
