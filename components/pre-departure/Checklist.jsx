"use client";
import { useState, useEffect } from "react";

const checklistData = [
  "Passport & Visa documents",
  "Offer letter & university documents",
  "Flight tickets & accommodation proof",
  "Forex card / international banking",
  "Travel & health insurance",
  "Medicines with prescriptions",
  "Emergency contacts list",
  "Airport immigration preparation",
  "Local SIM & internet plan",
  "First-week essentials",
];

export default function Checklist() {
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("preDepartureChecklist");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("preDepartureChecklist", JSON.stringify(checked));
  }, [checked]);

  const toggle = (item) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const progress = Math.round((checked.length / checklistData.length) * 100);

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center">
        Pre-Departure Checklist
      </h2>

      {/* Progress */}
      <div className="mt-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4169E1] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-10 space-y-4">
        {checklistData.map((item) => (
          <label
            key={item}
            className="flex items-center gap-4 bg-[#0f172a] p-4 rounded-xl border border-gray-800 cursor-pointer hover:border-[#32CD32]"
          >
            <input
              type="checkbox"
              checked={checked.includes(item)}
              onChange={() => toggle(item)}
              className="w-5 h-5 accent-[#32CD32]"
            />
            <span
              className={`${
                checked.includes(item)
                  ? "line-through text-gray-500"
                  : "text-gray-200"
              }`}
            >
              {item}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}
