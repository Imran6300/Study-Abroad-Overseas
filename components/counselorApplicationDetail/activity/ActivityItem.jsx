import {
  Send,
  User,
  FileText,
  Activity,
  MessageSquare,
  Shield,
} from "lucide-react";
// ─── Activity item ────────────────────────────────────────────────────────────

export default function ActivityItem({ item }) {
  const activityTypeConfig = {
    submitted: { bg: "bg-indigo-100", icon: Send, color: "text-indigo-600" },
    assigned: { bg: "bg-blue-100", icon: User, color: "text-blue-600" },
    documents: {
      bg: "bg-emerald-100",
      icon: FileText,
      color: "text-emerald-600",
    },
    status: { bg: "bg-violet-100", icon: Activity, color: "text-violet-600" },
    note: {
      bg: "bg-amber-100",
      icon: MessageSquare,
      color: "text-amber-600",
    },
    visa: { bg: "bg-teal-100", icon: Shield, color: "text-teal-600" },
  };
  const cfg = activityTypeConfig[item.type] || activityTypeConfig.status;
  const Icon = cfg.icon;
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div
        className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center z-10 shrink-0`}
      >
        <Icon size={14} className={cfg.color} />
      </div>
      <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-800">{item.message}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xs text-slate-400">{item.timestamp}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs font-semibold text-slate-500">
            {item.by}
          </span>
        </div>
      </div>
    </div>
  );
}
