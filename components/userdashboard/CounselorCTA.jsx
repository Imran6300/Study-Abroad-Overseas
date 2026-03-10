import { motion } from "framer-motion";
export default function CounselorCta() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-gradient-to-br from-[#112240] to-[#0A192F] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#4169E1]/5"></div>
      <div className="relative z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Expert Help
        </h2>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">
          Certified counselors — helped 1000+ students from Hyderabad
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          className="bg-[#32CD32] text-black font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto text-base sm:text-lg"
        >
          Book Free Call
        </motion.button>
      </div>
    </motion.div>
  );
}
