import Link from "next/link";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function PricingPlans({
  applications,
  shortlistedCount,
  upcomingDeadlines,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
        Choose Your Plan
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* BASIC */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Basic</h3>
            <p className="text-sm text-gray-400 mt-1">Start your journey</p>

            <p className="text-4xl font-bold text-white mt-4">₹2,999</p>
            <span className="text-sm text-gray-400">one-time</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
            <li>✓ 3 university applications</li>
            <li>✓ Document checklist</li>
            <li>✓ Profile evaluation</li>
            <li className="text-gray-500">✗ SOP / Resume review</li>
            <li className="text-gray-500">✗ Visa support</li>
          </ul>

          <button
            disabled
            className="w-full py-3 rounded-lg bg-gray-800 text-gray-400 cursor-not-allowed"
          >
            Current Plan
          </button>
        </div>

        {/* STANDARD (RECOMMENDED) */}
        <div className="relative bg-[#0f172a] border-2 border-emerald-500 rounded-2xl p-6 flex flex-col shadow-lg shadow-emerald-900/30">
          {/* badge */}
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-4 py-1 rounded-full">
            MOST POPULAR
          </span>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Standard</h3>
            <p className="text-sm text-gray-400 mt-1">
              Strong applications, better chances
            </p>

            <p className="text-4xl font-bold text-emerald-400 mt-4">₹7,999</p>

            <span className="text-sm text-gray-400">one-time</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-200 mb-8 flex-1">
            <li>✓ Everything in Basic</li>
            <li>✓ SOP & Resume review</li>
            <li>✓ Scholarship guidance</li>
            <li>✓ 2 expert counseling sessions</li>
            <li>✓ Priority support</li>
          </ul>

          <MotionLink
            href="/pricing?plan=standard"
            whileHover={{ scale: 1.04 }}
            className="w-full py-3 rounded-lg bg-emerald-500 text-black font-semibold text-center hover:bg-emerald-400 transition"
          >
            Upgrade to Standard
          </MotionLink>
        </div>

        {/* PREMIUM */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Premium</h3>
            <p className="text-sm text-gray-400 mt-1">
              Personalized & professional
            </p>

            <p className="text-4xl font-bold text-white mt-4">₹14,999</p>

            <span className="text-sm text-gray-400">one-time</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
            <li>✓ Everything in Standard</li>
            <li>✓ SOP writing assistance</li>
            <li>✓ Dedicated counselor</li>
            <li>✓ Interview preparation</li>
            <li>✓ Unlimited consultations</li>
          </ul>

          <MotionLink
            href="/pricing?plan=premium"
            whileHover={{ scale: 1.04 }}
            className="w-full py-3 rounded-lg bg-white text-black font-semibold text-center hover:bg-gray-200 transition"
          >
            Choose Premium
          </MotionLink>
        </div>

        {/* ELITE */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col hover:border-white/20 transition">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-200">Elite</h3>
            <p className="text-sm text-gray-400 mt-1">End-to-end support</p>

            <p className="text-4xl font-bold text-white mt-4">₹24,999</p>

            <span className="text-sm text-gray-400">one-time</span>
          </div>

          <ul className="space-y-3 text-sm text-gray-300 mb-8 flex-1">
            <li>✓ Everything in Premium</li>
            <li>✓ Visa documentation help</li>
            <li>✓ Visa interview prep</li>
            <li>✓ Accommodation guidance</li>
            <li>✓ Pre-departure briefing</li>
          </ul>

          <MotionLink
            href="/pricing?plan=elite"
            whileHover={{ scale: 1.04 }}
            className="w-full py-3 rounded-lg bg-indigo-500 text-white font-semibold text-center hover:bg-indigo-400 transition"
          >
            Get Elite Support
          </MotionLink>
        </div>
      </div>

      <p className="text-center mt-8 text-gray-400 text-sm">
        Want to compare all features?{" "}
        <Link href="/pricing" className="text-emerald-400 hover:underline">
          View full comparison
        </Link>
      </p>
    </motion.div>
  );
}
