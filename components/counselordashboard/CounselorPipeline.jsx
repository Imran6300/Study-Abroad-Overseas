"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Upload,
  Mail,
  CheckCircle2,
  Send,
  FileCheck,
  Clock,
  AlertCircle,
  UserPlus,
  Edit3,
  Loader2,
} from "lucide-react";
import { counselorApi } from "@/lib/counselorApi";

// Map activity log action → icon + colors
const ACTION_CONFIG = {
  "lead.created": {
    icon: UserPlus,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    tag: "New Lead",
    tagColor: "bg-sky-50 text-sky-600",
  },
  "lead.stage_changed": {
    icon: Edit3,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    tag: "Stage",
    tagColor: "bg-violet-50 text-violet-600",
  },
  "lead.counselor_assigned": {
    icon: UserPlus,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    tag: "Assigned",
    tagColor: "bg-indigo-50 text-indigo-600",
  },
  "lead.notes_updated": {
    icon: FileCheck,
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600",
    tag: "Note",
    tagColor: "bg-fuchsia-50 text-fuchsia-600",
  },
  "application.created": {
    icon: Send,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tag: "Application",
    tagColor: "bg-amber-50 text-amber-600",
  },
  "application.status_changed": {
    icon: CheckCircle2,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tag: "Status",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  "document.uploaded": {
    icon: Upload,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    tag: "Document",
    tagColor: "bg-sky-50 text-sky-600",
  },
  "offer.received": {
    icon: Mail,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tag: "Offer",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  default: {
    icon: AlertCircle,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    tag: "Activity",
    tagColor: "bg-slate-50 text-slate-500",
  },
};

function getConfig(action = "") {
  return ACTION_CONFIG[action] || ACTION_CONFIG.default;
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function CounselorRecentActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    counselorApi
      .getActivity({ limit: 8, page: 1 })
      .then((data) => setLogs(data.data || []))
      .catch((err) => console.error("Activity load error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest student updates
          </p>
        </div>
        <button className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg transition-colors">
          View all
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={22} className="animate-spin text-slate-400" />
        </div>
      ) : logs.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No recent activity yet
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((item, i) => {
            const config = getConfig(item.action);
            const Icon = config.icon;
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ x: 3 }}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-all duration-200 cursor-pointer group"
              >
                <div
                  className={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon
                    size={17}
                    className={config.iconColor}
                    strokeWidth={2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {item.message || "Activity logged"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={10} className="text-slate-400" />
                    <span className="text-[11px] text-slate-400">
                      {timeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${config.tagColor}`}
                >
                  {config.tag}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
