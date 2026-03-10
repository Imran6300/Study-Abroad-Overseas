"use client";

import VisaProgress from "@/components/userdashboard/VisaProgress";

export default function VisaPage() {
  const visaStages = [];

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">Visa Progress</h1>

      <VisaProgress visaStages={visaStages} />
    </div>
  );
}
