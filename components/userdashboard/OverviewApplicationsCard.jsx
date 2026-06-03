"use client";

import { motion } from "framer-motion";
import { Eye, Globe, CalendarDays, ArrowRight } from "lucide-react";

const stageToUserStatus = {
  "Lead / Enquiry": "In Progress",
  "Profile Completed": "In Progress",
  "Documents Pending": "Docs Required",
  "Application Submitted": "Submitted",
  "Offer Received": "Offer",
  "Visa Applied": "Visa",
  "Visa Approved": "Approved",
  "Enrolled / Completed": "Enrolled",
  "Rejected / Lost": "Closed",
};

const statusStyles = (status) => {
  const mapped = stageToUserStatus[status] || status;

  switch (mapped) {
    case "In Progress":
      return "bg-blue-500/15 text-blue-400 border-blue-500/20";

    case "Docs Required":
      return "bg-orange-500/15 text-orange-400 border-orange-500/20";

    case "Submitted":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";

    case "Offer":
      return "bg-green-500/15 text-green-400 border-green-500/20";

    case "Visa":
      return "bg-purple-500/15 text-purple-400 border-purple-500/20";

    case "Approved":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";

    case "Enrolled":
      return "bg-[#32CD32]/15 text-[#32CD32] border-[#32CD32]/20";

    default:
      return "bg-gray-500/15 text-gray-300 border-gray-500/20";
  }
};

export default function OverviewApplicationsCard({ applications, router }) {
  return (
    <div className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-3xl p-5 lg:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            style={{ color: "var(--brand-accent)" }}
            className=" text-lg font-bold"
          >
            Recent Applications
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Track your latest university applications
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard/user/applications")}
          style={{
            color: "var(--brand-primary)",
          }}
          className="flex items-center gap-1  text-sm hover:opacity-80 transition"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* EMPTY STATE */}
      {!applications.length ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-10 text-center">
          <p className="text-gray-400">No applications submitted yet.</p>

          <button
            onClick={() => router.push("/programs/universities")}
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--brand-accent)",
            }}
            className="mt-4  text-black px-5 py-2 rounded-xl font-semibold hover:bg-[#28b428] transition"
          >
            Explore Universities
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <motion.div
              key={app._id}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="
                bg-[#081426]
                border border-white/5
                rounded-2xl
                p-4
                hover:border-[#32CD32]/20
                transition
              "
            >
              {/* TOP */}
              <div className="flex items-start gap-3">
                {/* LOGO */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                  {app.logo ? (
                    <img
                      src={app.logo}
                      alt={app.university}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span
                      style={{
                        color: "var(--brand-primary)",
                      }}
                      className=" font-bold text-lg"
                    >
                      {app.university?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">
                    {app.university}
                  </h3>

                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                    {app.course}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <Globe size={12} />
                      <span>
                        {app.city ? `${app.city}, ${app.country}` : app.country}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      <span>{app.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="flex items-center justify-between gap-3 mt-4">
                <div
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-semibold border
                    ${statusStyles(app.status)}
                  `}
                >
                  {stageToUserStatus[app.status] || app.status}
                </div>

                <button
                  onClick={() =>
                    router.push(`/programs/universities/${app.slug}`)
                  }
                  className="
                    flex items-center gap-2
                    border border-white/10
                    hover:border-white/20
                    text-white text-xs
                    px-3 py-2 rounded-xl
                    hover:bg-white/5
                    transition
                  "
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
