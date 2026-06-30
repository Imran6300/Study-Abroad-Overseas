// app/dashboard/counselor-dashboard/page.jsx
//
// BUGS FIXED:
//  - handleRefreshComplete was completely missing. The refresh button in
//    CounselorKpiCards called onRefreshComplete() but no such prop was wired
//    from this page. The refresh button appeared to work (no error) but the
//    stats on screen never actually updated after the force-refresh API call
//    completed — because loadData() was never re-invoked.
//
//  - statsRefreshKey pattern added: incrementing this key triggers the
//    useEffect dependency to re-run loadData() after the refresh button
//    is clicked, giving the counselor immediate visual feedback.
//
//  - loadData was not memoised correctly for dependency arrays — wrapped
//    in useCallback with stable deps to prevent infinite re-render loops.
"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { counselorApi } from "@/lib/counselorApi";

import CounselorKpiCards from "@/components/counselordashboard/CounselorKpiCards";
import CounselorPipeline from "@/components/counselordashboard/CounselorPipeline";
import CounselorDeadlines from "@/components/counselordashboard/CounselorDeadlines";
import CounselorRecentActivity from "@/components/counselordashboard/CounselorRecentActivity";
import CounselorTasks from "@/components/counselordashboard/CounselorTasks";
import CounselorStudentsTable from "@/components/counselordashboard/CounselorStudentsTable";
// Lazy-loaded: chart.js (~180KB) only downloads when the dashboard renders
const CounselorAnalytics = dynamic(
  () => import("@/components/counselordashboard/CounselorAnalytics"),
  {
    ssr: false,
    loading: () => <div className="h-64 rounded-xl bg-white/5 animate-pulse" />,
  },
);
import ApplicationPipelineBoard from "@/components/counselordashboard/Applicationpipelineboard";

export default function CounselorDashboardPage() {
  const [overview, setOverview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // FIX: statsRefreshKey triggers re-fetch when refreshed manually
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoadingOverview(true);
      const [overviewData, appsData, deadlinesData] = await Promise.all([
        counselorApi.getOverview(),
        counselorApi.getApplications({ limit: 50 }),
        counselorApi.getDeadlines({ limit: 20, upcoming: true }),
      ]);
      setOverview(overviewData.data);
      setApplications(appsData.data || []);
      setDeadlines(deadlinesData.data || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoadingOverview(false);
    }
  }, []); // no changing deps — loadData is stable

  // Initial load + re-load on manual refresh
  useEffect(() => {
    loadData();
  }, [loadData, statsRefreshKey]);

  // FIX: called by CounselorKpiCards after forceRefreshStats API returns
  // Increments key → triggers the useEffect above → re-fetches overview
  const handleRefreshComplete = useCallback(() => {
    setStatsRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen">
      <main className="p-6 lg:p-8">
        {/* KPI Cards — passes onRefreshComplete so the refresh button works */}
        <CounselorKpiCards
          stats={overview?.stats}
          loading={loadingOverview}
          onRefreshComplete={handleRefreshComplete}
        />

        {/* Analytics — fetches its own data internally */}
        <CounselorAnalytics />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            {/* Pipeline funnel — fetches its own data internally */}
            {/*needs backend api */}
            <CounselorPipeline />
          </div>
          {/* Deadlines — pass fetched deadlines */}
          <CounselorDeadlines deadlines={deadlines} loading={loadingOverview} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Recent activity — fetches its own data internally */}
          <CounselorRecentActivity />
          {/* Tasks — local state only (acceptable for now) */}
          {/* needs backend api*/}
          <CounselorTasks />
        </div>

        {/* Students table — fetches its own data internally */}
        <CounselorStudentsTable />
      </main>
    </div>
  );
}
