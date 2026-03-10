import { motion } from "framer-motion";
export default function DocumentChecklist({ documents }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="mb-10 sm:mb-12"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5 flex items-center gap-3 px-1">
        <span className="text-[#4169E1]">📄</span> Document Checklist
      </h2>

      <div className="overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        <div className="flex gap-4 sm:grid sm:grid-cols-4 sm:gap-6 min-w-max sm:min-w-0">
          {documents.map((doc) => (
            <div
              key={doc.name}
              className="p-5 bg-white/6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-all snap-start min-w-[220px] sm:min-w-0"
            >
              <p className="font-semibold text-white text-base mb-2">
                {doc.name}
              </p>
              <span
                className={`text-sm ${doc.status.includes("Pending") ? "text-yellow-400" : "text-[#32CD32]"}`}
              >
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <button className="text-[#4169E1] font-bold hover:underline text-base sm:text-lg">
          Manage Documents →
        </button>
      </div>
    </motion.div>
  );
}
