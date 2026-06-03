import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
export default function SavedUniversities() {
  return (
    <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-10 sm:mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          backgroundColor: "var(--brand-bg)",
          borderColor: "var(--brand-primary)",
        }}
        className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 border shadow-xl"
      >
        <h2
          style={{ color: "var(--brand-accent)" }}
          className="text-2xl sm:text-3xl font-bold  mb-5 flex items-center gap-3"
        >
          <span style={{ color: "var(--brand-primary)" }}>🏛️</span> Saved
          Universities
        </h2>
        <p className="text-gray-400 mb-6 text-sm sm:text-base">
          No universities saved yet — start exploring!
        </p>
        <MotionLink
          href="/programs/universities"
          className="font-bold hover:underline text-base sm:text-lg flex items-center gap-2"
          style={{ color: "var(--brand-primary)" }}
        >
          Browse Now <span>→</span>
        </MotionLink>
      </motion.div>
      {/* Visa Progress */}
    </div>
  );
}
