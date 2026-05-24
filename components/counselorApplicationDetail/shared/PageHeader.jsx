import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Lock, User } from "lucide-react";

export default function PageHeader({ application, profile, isKhizarManaged }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
            {profile?.profilePicture?.secure_url ? (
              <img
                src={profile.profilePicture.secure_url}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${application.avatarColor} flex items-center justify-center text-white font-bold text-xl`}
              >
                {application?.avatar ||
                  profile?.fullName?.slice(0, 2)?.toUpperCase() ||
                  "??"}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {profile?.fullName || "Student"}
              </h1>
              <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                {application?.appId || "N/A"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Mail size={13} />
                {profile?.email || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={13} />
                {profile?.phone || "N/A"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {profile?.preferredCountry || "N/A"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                {application?.status || "Pending"}
              </span>
              {isKhizarManaged && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <Lock size={10} />
                  Managed by Khizar Overseas
                </span>
              )}
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                <User size={10} />
                Processor: {application?.processor || "Not Assigned"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-slate-500 shrink-0">
          <p>
            Created:{" "}
            <span className="font-semibold text-slate-700">
              {profile?.createdAt}
            </span>
          </p>
          <p className="mt-1">
            Updated:{" "}
            <span className="font-semibold text-slate-700">
              {profile?.updatedAt}
            </span>
          </p>
          <p className="mt-1">
            Preferred Country:{" "}
            <span className="font-semibold text-slate-700">
              {profile?.preferredCountry}
            </span>
          </p>
          <p className="mt-1">
            Preferred Intake:{" "}
            <span className="font-semibold text-slate-700">
              {profile?.intendedIntake}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
