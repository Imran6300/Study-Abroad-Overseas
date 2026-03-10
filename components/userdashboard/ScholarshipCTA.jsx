import { motion } from "framer-motion";

export default function ScholarshipCta() {
  return (
    <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
      {/* Scholarships */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-amber-950/40 to-yellow-950/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-2xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3">
          <span className="text-yellow-400 text-2xl sm:text-3xl">💰</span>{" "}
          Scholarships
        </h2>
        <p className="text-gray-300 mb-6 text-sm sm:text-base">
          You could be eligible for $5k–$25k — check now!
        </p>
        <button className="bg-yellow-600/80 text-white px-8 py-4 rounded-xl font-bold hover:bg-yellow-600 transition-all w-full sm:w-auto text-base sm:text-lg">
          Find Funding
        </button>
      </motion.div>
    </div>
  );
}
