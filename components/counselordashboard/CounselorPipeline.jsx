"use client";

import { motion } from "framer-motion";
import {
  Upload,
  Mail,
  CheckCircle2,
  Send,
  FileCheck,
  Clock,
} from "lucide-react";

const activities = [
  {
    id: 1,
    icon: Upload,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    text: "Ahmed uploaded passport",
    student: "Ahmed Khan",
    time: "2 min ago",
    tag: "Document",
    tagColor: "bg-sky-50 text-sky-600",
  },
  {
    id: 2,
    icon: Mail,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    text: "Priya received offer letter",
    student: "Priya Sharma",
    time: "18 min ago",
    tag: "Offer",
    tagColor: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 3,
    icon: CheckCircle2,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    text: "Ali visa approved",
    student: "Ali Hassan",
    time: "1 hr ago",
    tag: "Visa",
    tagColor: "bg-violet-50 text-violet-600",
  },
  {
    id: 4,
    icon: Send,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    text: "Hassan application submitted",
    student: "Hassan Malik",
    time: "3 hrs ago",
    tag: "Application",
    tagColor: "bg-amber-50 text-amber-600",
  },
  {
    id: 5,
    icon: FileCheck,
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600",
    text: "Fatima uploaded IELTS certificate",
    student: "Fatima Noor",
    time: "5 hrs ago",
    tag: "Document",
    tagColor: "bg-fuchsia-50 text-fuchsia-600",
  },
];

export default function CounselorRecentActivity() {
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

      <div className="space-y-3">
        {activities.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition-all duration-200 cursor-pointer group"
            >
              <div
                className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon size={17} className={item.iconColor} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={10} className="text-slate-400" />
                  <span className="text-[11px] text-slate-400">
                    {item.time}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg shrink-0 ${item.tagColor}`}
              >
                {item.tag}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
