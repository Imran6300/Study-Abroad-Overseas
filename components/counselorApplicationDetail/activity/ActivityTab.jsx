import ActivityItem from "./ActivityItem";
import { Activity } from "lucide-react";
export default function ActivityTab({ application }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
        <Activity size={15} className="text-indigo-500" /> Activity Log
      </h3>
      {(application?.activityLog?.length || 0) === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No activity recorded yet.
        </div>
      ) : (
        <div className="relative pl-10 before:absolute before:left-4 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-100">
          {application?.activityLog?.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
