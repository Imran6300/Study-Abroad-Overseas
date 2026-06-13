"use client";

import { useState, useEffect } from "react";

import VisaProgress from "./VisaProgress";
import VisaChecklist from "./VisaChecklist";

export default function VisaTab({ application }) {
  const [visa, setVisa] = useState(null);
  const [loadingVisa, setLoadingVisa] = useState(true);

  useEffect(() => {
    if (application?.student?._id) {
      fetchVisa();
    }
  }, [application?.student?._id]);

  const fetchVisa = async () => {
    try {
      if (!application?.student?._id) {
        setLoadingVisa(false);
        return;
      }

      setLoadingVisa(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/visa/student/${application.student._id}`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        setVisa(data.visa);
      }
    } catch (error) {
      console.error("VisaTab fetchVisa error:", error);
    } finally {
      setLoadingVisa(false);
    }
  };

  const visaStepConfig = {
    pending: {
      label: "Not Started",
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    completed: {
      label: "Completed",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    on_hold: {
      label: "On Hold",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    rejected: {
      label: "Rejected",
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
    },
  };

  const completedCount =
    visa?.steps?.filter((s) => s.status === "completed").length || 0;

  const progressPct = visa?.progressPercentage || 0;

  const updateStepStatus = async (stepId, status) => {
    try {
      // ─────────────────────────────────────────────────────────────────
      // BUG FIXED: was `/user/${visa._id}/step/${stepId}`
      //            Missing the /visa/ segment — hit a non-existent route
      //            (Express would try to match it against /:userId or 404).
      //
      // Backend mounts visaprogressRouter at app.use('/user/visa', ...),
      // with the step-update handler at PATCH /:visaId/step/:stepId,
      // so the full URL must be: /user/visa/:visaId/step/:stepId
      // ─────────────────────────────────────────────────────────────────
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/visa/${visa._id}/step/${stepId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            updatedBy: application.student._id,
            updatedByRole: "Counselor",
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setVisa(data.visa);
      } else {
        console.error("updateStepStatus failed:", data.message);
      }
    } catch (error) {
      console.error("updateStepStatus error:", error);
    }
  };

  if (loadingVisa) {
    return (
      <div className="text-sm text-slate-400">Loading visa progress...</div>
    );
  }

  return (
    <div className="space-y-6">
      <VisaProgress
        completedCount={completedCount}
        totalSteps={visa?.steps?.length || 0}
        progressPct={progressPct}
      />

      <VisaChecklist
        steps={visa?.steps || []}
        updateStepStatus={updateStepStatus}
        visaStepConfig={visaStepConfig}
      />
    </div>
  );
}
