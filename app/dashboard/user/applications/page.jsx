"use client";

import { useRouter } from "next/navigation";
import ApplicationsCard from "@/components/userdashboard/ApplicationsCard";

export default function ApplicationsPage() {
  const router = useRouter();

  const applications = [];

  const handleWithdraw = (id) => {
    console.log("withdraw", id);
  };

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <ApplicationsCard
        applications={applications}
        handleWithdraw={handleWithdraw}
        router={router}
      />
    </div>
  );
}
