import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function ProfileCompletionCard({ progress, router }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        sm:rounded-3xl
        p-5
        sm:p-7
        mb-8
        sm:mb-12
        backdrop-blur-xl
      "
      style={{
        background: `
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--brand-primary) 14%, var(--brand-bg)),
            var(--brand-bg)
          )
        `,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.25),
          0 0 24px color-mix(
            in srgb,
            var(--brand-primary) 20%,
            transparent
          )
        `,
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at top right,
              color-mix(
                in srgb,
                var(--brand-primary) 18%,
                transparent
              ) 0%,
              transparent 65%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {progress === 100 ? (
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="text-center sm:text-left flex-1">
              <h3
                className="text-xl sm:text-2xl font-bold mb-3 flex items-center justify-center sm:justify-start gap-2.5"
                style={{
                  color: "var(--brand-primary)",
                }}
              >
                🎉 Profile 100% Complete!
              </h3>

              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                You're ready to apply — let's go!
              </p>

              <div className="w-full max-w-[260px] mx-auto sm:mx-0 bg-slate-800 rounded-full h-4 overflow-hidden relative">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                  }}
                />

                <span className="absolute inset-0 text-[10px] font-bold text-black flex items-center justify-center">
                  100%
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "0 0 24px color-mix(in srgb, var(--brand-primary) 50%, transparent)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/programs/universities")}
              style={{
                backgroundColor: "var(--brand-primary)",
              }}
              className="
                text-black
                px-8
                py-4
                rounded-xl
                sm:rounded-2xl
                font-bold
                shadow-lg
                transition-all
                w-full
                sm:w-auto
                text-base
                sm:text-lg
              "
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
                  className="h-full"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: 1.4,
                    ease: "easeOut",
                  }}
                />

                <span className="absolute inset-0 text-[10px] font-bold text-black flex items-center justify-center">
                  {progress}%
                </span>
              </div>
            </div>

            <MotionLink
              href="/dashboard/user/profile"
              whileHover={{
                scale: 1.04,
                boxShadow:
                  "0 0 24px color-mix(in srgb, var(--brand-primary) 50%, transparent)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                backgroundColor: "var(--brand-primary)",
              }}
              className="
                text-white
                px-8
                py-4
                rounded-xl
                sm:rounded-2xl
                font-bold
                shadow-lg
                transition-all
                w-full
                sm:w-auto
                text-base
                sm:text-lg
                text-center
              "
            >
              Complete Profile
            </MotionLink>
          </div>
        )}
      </div>
    </motion.div>
  );
}
