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
  compact = false,
}) {
  if (!applications.length) {
    return (
      <div className="space-y-4">
        {applications.map((app) => (
          <motion.div
            key={app.universityEntryId || app._id || app.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            transition={{ duration: 0.25 }}
            style={{
              background: `
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-primary) 18%, var(--brand-bg)),
      var(--brand-bg)
    )
  `,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: `
    0 8px 32px rgba(0,0,0,0.2),
    0 0 20px color-mix(
      in srgb,
      var(--brand-primary) 12%,
      transparent
    )
  `,
            }}
            className={`
            
          rounded-2xl
          
          hover:shadow-lg 
          transition overflow-hidden
          ${compact ? "p-4" : "p-5 lg:p-6"}
        `}
          >
            {compact ? (
              // DASHBOARD COMPACT CARD
              <div className="space-y-4">
                {/* TOP */}
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                    {app.logo ? (
                      <img
                        src={app.logo?.url}
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

                  <div className="min-w-0 flex-1">
                    <h3
                      style={{ color: "var(--brand-accent)" }}
                      className=" font-semibold text-sm leading-tight line-clamp-2"
                    >
                      {app.university}
                    </h3>

                    <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                      {app.course}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <Globe size={12} />
                        <span>{app.country}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{app.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div
                    className={`
                  flex items-center gap-2
                  px-3 py-1.5 rounded-full
                  text-xs font-semibold
                  whitespace-nowrap
                  ${statusStyles(app.status)}
                `}
                  >
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {stageToUserStatus[app.status] || app.status}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/programs/universities/${app.slug}`)
                      }
                      style={{ color: "var(--brand-accent)" }}
                      className="flex items-center gap-1.5 border border-white/20  px-3 py-1.5 rounded-lg hover:bg-white/10 transition text-xs"
                    >
                      <Eye size={13} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleWithdraw(app.applicationId, app.universityEntryId)
                      }
                      className="flex items-center gap-1.5 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition text-xs"
                    >
                      <XCircle size={13} />
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // FULL APPLICATION PAGE CARD
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                {/* LEFT */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                    {app.logo ? (
                      <img
                        src={app.logo?.url}
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

                  <div className="min-w-0 flex-1">
                    <h3
                      style={{ color: "var(--brand-accent)" }}
                      className=" text-base sm:text-lg font-semibold break-words"
                    >
                      {app.university}
                    </h3>

                    <p className="text-gray-400 text-sm break-words">
                      {app.course}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Globe size={14} />
                        <span>{app.country}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{app.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div
                  className={`
                flex items-center justify-center gap-2
                px-4 py-2 rounded-full text-sm font-semibold
                whitespace-nowrap self-start xl:self-center
                ${statusStyles(app.status)}
              `}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  {stageToUserStatus[app.status] || app.status}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                  <button
                    onClick={() =>
                      router.push(`/programs/universities/${app.slug}`)
                    }
                    style={{ color: "var(--brand-accent)" }}
                    className="flex items-center justify-center gap-2 border border-white/20  px-4 py-2 rounded-lg hover:bg-white/10 transition w-full sm:w-auto"
                  >
                    <Eye size={16} />
                    View
                  </button>

                  <button
                    onClick={() =>
                      handleWithdraw(app.applicationId, app.universityEntryId)
                    }
                    className="flex items-center justify-center gap-2 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition w-full sm:w-auto"
                  >
                    <XCircle size={16} />
                    Withdraw
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
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
        return "";

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
          key={app.universityEntryId || app._id || app.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.02,
            y: -2,
          }}
          transition={{ duration: 0.25 }}
          style={{
            background: `
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--brand-primary) 18%, var(--brand-bg)),
      var(--brand-bg)
    )
  `,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: `
    0 8px 32px rgba(0,0,0,0.2),
    0 0 20px color-mix(
      in srgb,
      var(--brand-primary) 12%,
      transparent
    )
  `,
          }}
          className={`
  rounded-2xl p-4 sm:p-5
  flex flex-col
  ${compact ? "gap-3" : "xl:flex-row xl:items-center xl:justify-between gap-5"}
  hover:shadow-lg 
  transition
  overflow-hidden
`}
        >
          {/* LEFT SIDE */}
          <div className="flex items-start gap-4 min-w-0 flex-1">
            {/* University Logo */}
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
              {app.logo ? (
                <img
                  src={app.logo?.url}
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
                  {app.university?.charAt(0) || "U"}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3
                style={{ color: "var(--brand-accent)" }}
                className=" text-base sm:text-lg font-semibold break-words"
              >
                {app.university}
              </h3>

              <p className="text-gray-400 text-sm break-words">{app.course}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Globe size={14} />
                  <span className="break-words">
                    {typeof app.country === "string" && app.country.length > 20
                      ? "Country Not Available"
                      : app.country || "N/A"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{app.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div
            className={`
      flex items-center justify-center gap-2
      px-4 py-2 rounded-full text-sm font-semibold
      whitespace-nowrap
      self-start xl:self-center
      ${statusStyles(app.status)}
    `}
          >
            <span className="w-2 h-2 rounded-full bg-current"></span>
            {stageToUserStatus[app.status] || app.status}
          </div>

          {/* ACTION BUTTONS */}
          <div
            className={`
    flex gap-3
    ${compact ? "flex-row flex-wrap" : "flex-col sm:flex-row"}
    w-full xl:w-auto
  `}
          >
            <button
              onClick={() => router.push(`/programs/universities/${app.slug}`)}
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--brand-accent)",
              }}
              className="
flex items-center justify-center gap-2
px-4 py-2
rounded-lg
font-medium
transition-all
"
            >
              <Eye size={16} />
              View
            </button>

            <button
              onClick={() =>
                handleWithdraw(app.applicationId, app.universityEntryId)
              }
              className="
        flex items-center justify-center gap-2
        border border-red-500/30 text-red-400
        px-4 py-2 rounded-lg
        hover:bg-red-500/10 transition
        w-full sm:w-auto
      "
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
