"use client";

import { motion } from "framer-motion";
import { Calendar, Globe, Eye, XCircle } from "lucide-react";

const stageToUserStatus = {
  "Lead / Enquiry": "Application In Progress",
  "Profile Completed": "Application In Progress",
  "Documents Pending": "Documents Required",
  "Application Submitted": "Application Submitted",
  "Offer Received": "Offer Received",
  "Visa Applied": "Visa Processing",
  "Visa Approved": "Visa Approved",
  "Enrolled / Completed": "Enrolled",
  "Rejected / Lost": "Application Closed",
};

export default function ApplicationsCard({
  applications,
  handleWithdraw,
  router,
}) {
  if (!applications.length) {
    return (
      <div className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <h2 className="text-xl font-bold text-white">No Applications Yet</h2>

        <p className="text-gray-400 mt-2">
          Start applying to universities and track your applications here.
        </p>

        <button
          onClick={() => router.push("/programs/universities")}
          className="mt-6 bg-[#32CD32] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#28b428] transition"
        >
          Explore Universities
        </button>
      </div>
    );
  }

  const statusStyles = (status) => {
    const mapped = stageToUserStatus[status] || status;

    switch (mapped) {
      case "Application In Progress":
        return "bg-blue-500/20 text-blue-400";

      case "Documents Required":
        return "bg-orange-500/20 text-orange-400";

      case "Application Submitted":
        return "bg-yellow-500/20 text-yellow-400";

      case "Offer Received":
        return "bg-green-500/20 text-green-400";

      case "Visa Processing":
        return "bg-purple-500/20 text-purple-400";

      case "Visa Approved":
        return "bg-emerald-500/20 text-emerald-400";

      case "Enrolled":
        return "bg-[#32CD32]/20 text-[#32CD32]";

      case "Application Closed":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  return (
    <div className="space-y-5">
      {applications.map((app) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.25 }}
          className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:border-[#32CD32]/40 hover:shadow-lg hover:shadow-[#32CD32]/10 transition"
        >
          {/* LEFT SIDE */}
          <div className="flex items-start gap-4">
            {/* University Logo Placeholder */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
              {app.logo ? (
                <img
                  src={app.logo}
                  alt={app.university}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[#32CD32] font-bold text-lg">
                  {app.university.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold">
                {app.university}
              </h3>

              <p className="text-gray-400 text-sm">{app.course}</p>

              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Globe size={14} />
                  {app.country}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {app.date}
                </div>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusStyles(
              app.status,
            )}`}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {stageToUserStatus[app.status] || app.status}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/programs/universities/${app.slug}`)}
              className="flex items-center gap-2 border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
            >
              <Eye size={16} />
              View
            </button>

            <button
              onClick={() => handleWithdraw(app.id)}
              className="flex items-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition"
            >
              <XCircle size={16} />
              Withdraw
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
