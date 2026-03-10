import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
export default function ApplicationsCard({
  applications,
  handleWithdraw,
  router,
  getStatusColor,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-10 sm:mb-12 border border-white/10 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
          🎓 My Applications
        </h2>
        <motion.button
          whileHover={{ scale: 1.04 }}
          onClick={() => router.push("/dashboard/applications/new")}
          className="bg-[#32CD32] text-black px-6 sm:px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-base sm:text-lg"
        >
          + New Application
        </motion.button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-base mb-5">
            No applications yet — start now!
          </p>
          <MotionLink
            href="/programs/universities"
            className="text-[#32CD32] font-bold hover:underline text-base sm:text-lg"
          >
            Explore Universities →
          </MotionLink>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5"
            >
              <div className="w-full">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {app.university}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {app.course} • {app.intake}
                </p>
                <span
                  className={`mt-3 inline-block px-4 py-1 text-xs rounded-full border ${getStatusColor(app.status)}`}
                >
                  {app.status}
                </span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() =>
                    router.push(`/dashboard/applications/${app._id}`)
                  }
                  className="flex-1 sm:flex-none px-5 py-3 bg-[#4169E1] text-white rounded-xl hover:bg-[#3258c9] transition-all text-sm sm:text-base"
                >
                  View
                </button>
                {app.status !== "Withdrawn" && (
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    className="flex-1 sm:flex-none px-5 py-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/40 hover:bg-red-600/30 transition-all text-sm sm:text-base"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
