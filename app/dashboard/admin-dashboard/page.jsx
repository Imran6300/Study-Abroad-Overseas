"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import KpiCards from "@/components/admindashboard/KpiCards";
import StudentPipeline from "@/components/admindashboard/StudentPipeline";
import VisaStatus from "@/components/admindashboard/VisaStatus";
import UpcomingDeadlines from "@/components/admindashboard/UpcomingDeadlines";
import RevenueOverview from "@/components/admindashboard/RevenueOverview";
import TopCounselors from "@/components/admindashboard/TopCounselors";

//imp for addadmin
import AdminManagementSection from "@/components/admindashboard/addadmin/AdminManagementSection";


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 140, damping: 17 },
  },
};

export default function AdminPage() {
  const [showAdminSection, setShowAdminSection] = useState(false);

  // ✅ TEMP STATE (later you can move this to API / context)
  const [admins, setAdmins] = useState([
    {
      id: "1",
      name: "Imran Khan",
      email: "imran@khizaroverseas.in",
      role: "Super Admin",
    },
    {
      id: "2",
      name: "Sara Ahmed",
      email: "sara@khizaroverseas.in",
      role: "Admin",
    },
  ]);

  // handlers
  const handleAdminAdded = (data) => {
    setAdmins((prev) => [
      ...prev,
      { id: Date.now().toString(), ...data },
    ]);
  };

  const handleDeleteAdmin = (id) => {
    if (!confirm("Delete this admin?")) return;
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <DashboardHeader
          title="Admin Dashboard"
          counselorName="Imran"
          btnName="+ Add New Admin"
          onButtonClick={() => setShowAdminSection(true)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          
          {/* 🔥 ADMIN MANAGEMENT FEATURE */}
          {showAdminSection && (
            <AdminManagementSection
              admins={admins}
              onClose={() => setShowAdminSection(false)}
              onAddAdmin={handleAdminAdded}
              onDeleteAdmin={handleDeleteAdmin}
            />
          )}

          {/* NORMAL DASHBOARD CONTENT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <KpiCards />
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
            >
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <StudentPipeline />
              </motion.div>
              <motion.div variants={itemVariants}>
                <VisaStatus />
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants}>
                <UpcomingDeadlines />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <RevenueOverview />
                <TopCounselors />
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
