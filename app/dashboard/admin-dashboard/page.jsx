"use client";

import { motion } from "framer-motion";
import AdminSidebar from "@/components/admindashboard/AdminSidebar";
import DashboardHeader from "@/components/admindashboard/DashboardHeader";
import KpiCards from "@/components/admindashboard/KpiCards";
import StudentPipeline from "@/components/admindashboard/StudentPipeline";
import VisaStatus from "@/components/admindashboard/VisaStatus";
import UpcomingDeadlines from "@/components/admindashboard/UpcomingDeadlines";
import RevenueOverview from "@/components/admindashboard/RevenueOverview";
import TopCounselors from "@/components/admindashboard/TopCounselors";

// Shared variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 17,
      duration: 0.5,
    },
  },
};

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar usually doesn't need entrance animation */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header can have a subtle entrance */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <DashboardHeader title={"Admin Dashboard"} counselorName={"Imran"} btnName="+ Add New Admin"/>
        </motion.div>

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-gray-50">
          {/* KPI Cards – usually appear first and fast */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <KpiCards />
            </motion.div>

            {/* First big row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
            >
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <StudentPipeline />
              </motion.div>

              <motion.div variants={itemVariants}>
                <VisaStatus />
              </motion.div>
            </motion.div>

            {/* Second row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants}>
                <UpcomingDeadlines />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <RevenueOverview />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TopCounselors />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}