import { motion } from "framer-motion";
export default function VisaProgress({ visaStages }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-white/6 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3">
        <span className="text-[#4169E1]">🛂</span> Visa Progress
      </h2>
      <div className="space-y-4">
        {visaStages.map((stage, i) => (
          <div key={stage.stage} className="flex items-center gap-4">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-base font-bold ${stage.done ? "bg-[#32CD32] text-black" : "bg-gray-700 text-gray-400"}`}
            >
              {i + 1}
            </div>
            <div>
              <p className="font-semibold text-white text-base">
                {stage.stage}
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                {stage.done ? "Done" : "Pending"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center sm:text-left">
        <button className="text-[#4169E1] font-bold hover:underline text-base sm:text-lg">
          Update Status →
        </button>
      </div>
    </motion.div>
  );
}
