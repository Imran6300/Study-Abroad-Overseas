"use client";

import CounselorKpiCards from "@/components/counselordashboard/CounselorKpiCards";
import CounselorPipeline from "@/components/counselordashboard/CounselorPipeline";
import CounselorDeadlines from "@/components/counselordashboard/CounselorDeadlines";
import CounselorRecentActivity from "@/components/counselordashboard/CounselorRecentActivity";
import CounselorTasks from "@/components/counselordashboard/CounselorTasks";
import CounselorStudentsTable from "@/components/counselordashboard/CounselorStudentsTable";
import CounselorAnalytics from "@/components/counselordashboard/CounselorAnalytics";
import ApplicationPipelineBoard from "@/components/counselordashboard/Applicationpipelineboard";

export default function CounselorDashboardPage() {
  return (
    <div className="min-h-screen">
      <main className="p-6 lg:p-8">
        <CounselorKpiCards />

        <CounselorAnalytics />
        <div className="mb-8">
          <ApplicationPipelineBoard applications={[]} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <CounselorPipeline />
          </div>

          <CounselorDeadlines />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <CounselorRecentActivity />

          <CounselorTasks />
        </div>

        <CounselorStudentsTable />
      </main>
    </div>
  );
}
