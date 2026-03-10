"use client";

import DeadlinesCard from "@/components/userdashboard/DeadlinesCard";

export default function DeadlinesPage() {
  const upcomingDeadlines = [
    { id: 1, title: "Visa Submission", date: "Mar 10", daysLeft: 6 },
  ];

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      <h1 className="text-3xl font-bold text-white mb-6">Deadlines</h1>

      <DeadlinesCard upcomingDeadlines={upcomingDeadlines} />
    </div>
  );
}
