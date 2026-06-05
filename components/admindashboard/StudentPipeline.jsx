"use client";

import { useEffect, useState } from "react";

const STAGE_CONFIG = {
  lead: { label: "Leads", color: "bg-blue-600" },
  contacted: { label: "Contacted", color: "bg-blue-700" },
  qualified: { label: "Counseled", color: "bg-indigo-600" },
  application_started: { label: "App Started", color: "bg-indigo-700" },
  application_submitted: { label: "Applied", color: "bg-purple-600" },
  offer_received: { label: "Offers", color: "bg-purple-700" },
  visa_process: { label: "Visa Process", color: "bg-violet-600" },
  enrolled: { label: "Enrolled", color: "bg-green-600" },
};

const STAGE_ORDER = Object.keys(STAGE_CONFIG);

export default function StudentPipeline() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats/pipeline`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        const raw = data.data || {};
        const built = STAGE_ORDER.map((key) => ({
          stage: key,
          label: STAGE_CONFIG[key].label,
          color: STAGE_CONFIG[key].color,
          count: raw[key] ?? 0,
        }));
        setStages(built);
      })
      .catch(() => {
        setStages(
          STAGE_ORDER.map((key) => ({
            stage: key,
            label: STAGE_CONFIG[key].label,
            color: STAGE_CONFIG[key].color,
            count: 0,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Student Pipeline — All Time
      </h2>

      {loading ? (
        <div className="flex gap-3">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="flex-1 min-w-[120px] h-28 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 md:gap-3 items-stretch overflow-x-auto pb-2">
          {stages.map((item, idx) => (
            <div
              key={item.stage}
              className="flex-1 min-w-[140px] bg-gray-50 rounded-xl p-5 text-center border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-full ${item.color} flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm`}
              >
                {item.count}
              </div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              {idx < stages.length - 1 && (
                <div className="hidden md:block text-gray-300 text-2xl mt-4">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
