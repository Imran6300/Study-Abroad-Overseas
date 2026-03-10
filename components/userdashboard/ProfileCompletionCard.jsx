import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function ProfileCompletionCard({ progress, router }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 mb-8 sm:mb-12 border border-white/10 hover:border-[#32CD32]/30 transition-all"
    >
      {progress === 100 ? (
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-[#32CD32] mb-3 flex items-center justify-center sm:justify-start gap-2.5">
              🎉 Profile 100% Complete!
            </h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              You're ready to apply — let's go!
            </p>
            <div className="w-full max-w-[260px] mx-auto sm:mx-0 bg-slate-800 rounded-full h-4 overflow-hidden relative">
              <div className="h-full bg-[#32CD32] w-full" />
              <span className="absolute inset-0 text-[10px] font-bold text-black flex items-center justify-center">
                100%
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/programs/universities")}
            className="bg-[#32CD32] text-black px-8 py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-base sm:text-lg"
          >
            Start Applying 🚀
          </motion.button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="w-full sm:flex-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Profile Completion
            </h3>
            <p className="text-gray-400 mb-4 text-sm sm:text-base">
              Finish to unlock full features
            </p>
            <div className="w-full max-w-[260px] mx-auto sm:mx-0 bg-slate-800 rounded-full h-4 overflow-hidden relative">
              <motion.div
                className="h-full bg-[#32CD32]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
              <span className="absolute inset-0 text-[10px] font-bold text-black flex items-center justify-center">
                {progress}%
              </span>
            </div>
          </div>
          <MotionLink
            href="/dashboard/user/profile"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#4169E1] text-white px-8 py-4 rounded-xl sm:rounded-2xl font-bold shadow-lg hover:bg-[#3258c9] transition-all w-full sm:w-auto text-base sm:text-lg text-center"
          >
            Complete Profile
          </MotionLink>
        </div>
      )}
    </motion.div>
  );
}
