import {
  Send,
  User,
  FileText,
  Activity,
  MessageSquare,
  Shield,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function ActivityItem({ item }) {
  const typeMap = {
    "application.submitted": {
      icon: Send,
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },

    "application.updated": {
      icon: Activity,
      bg: "bg-violet-100",
      color: "text-violet-600",
    },

    "note.created": {
      icon: MessageSquare,
      bg: "bg-amber-100",
      color: "text-amber-600",
    },

    "deadline.created": {
      icon: FileText,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },

    "visa.step_updated": {
      icon: Shield,
      bg: "bg-teal-100",
      color: "text-teal-600",
    },
  };

  const cfg = typeMap[item.action] || typeMap["application.updated"];

  const Icon = cfg.icon;

  const formattedDate = new Date(item.createdAt).toLocaleString();

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
          <span className="text-xs text-slate-400">{formattedDate}</span>

          <span className="text-xs text-slate-300">·</span>

          <span className="text-xs font-semibold text-slate-500">
            {item.actor?.name || "System"}
          </span>

          {item.severity === "warning" && (
            <AlertTriangle size={12} className="text-amber-500" />
          )}

          {item.severity === "success" && (
            <CheckCircle2 size={12} className="text-emerald-500" />
          )}
        </div>
      </div>
    </div>
  );
}
