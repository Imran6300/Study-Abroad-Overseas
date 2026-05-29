import ActivityItem from "./ActivityItem";
import { Activity, Loader2 } from "lucide-react";

export default function ActivityTab({ activities, loading }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
        <Activity size={15} className="text-indigo-500" />
        Activity Log
      </h3>

      {loading ? (
        <div className="py-12 flex items-center justify-center text-slate-400">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : activities?.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No activity recorded yet.
        </div>
      ) : (
        <div className="relative pl-10 before:absolute before:left-4 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100">
          {activities.map((item) => (
            <ActivityItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
