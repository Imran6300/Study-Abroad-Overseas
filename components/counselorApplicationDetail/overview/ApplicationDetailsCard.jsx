import {
  Hash,
  Building2,
  MapPin,
  GraduationCap,
  Calendar,
  Briefcase,
} from "lucide-react";

export default function ApplicationDetailCard({ application }) {
  const applicationDetails = [
    {
      label: "Application ID",
      value: application.appId,
      icon: Hash,
    },
    {
      label: "University",
      value: application.university,
      icon: Building2,
    },
    {
      label: "Country",
      value: application.country,
      icon: MapPin,
    },
    {
      label: "Course",
      value: application.course,
      icon: GraduationCap,
    },
    {
      label: "Intake",
      value: application.intake,
      icon: Calendar,
    },
    {
      label: "Processor",
      value: application.processor,
      icon: Briefcase,
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-bold text-slate-700 mb-4">
        Application Details
      </h3>

      <div className="space-y-3">
        {applicationDetails.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 py-2.5 px-3 bg-slate-50 rounded-xl"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
              <Icon size={13} className="text-slate-500" />
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {label}
              </p>

              <p className="text-sm font-semibold text-slate-700">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
