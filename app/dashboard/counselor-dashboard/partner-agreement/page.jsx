"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Handshake,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  IndianRupee,
  Users,
  Award,
  Calendar,
  TrendingUp,
} from "lucide-react";

// ── Visual cycle card ─────────────────────────────────────────────────────────
function CycleCard({ quarter, label, condition, result, highlight }) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "bg-gradient-to-br from-sky-50 to-indigo-50 border-sky-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold tracking-widest uppercase text-sky-500 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
          {quarter}
        </span>
      </div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
        Condition
      </p>
      <p className="text-sm text-gray-700 font-medium mb-3">{condition}</p>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
        Result for next quarter
      </p>
      <p
        className={`text-sm font-bold ${highlight ? "text-sky-700" : "text-gray-800"}`}
      >
        {result}
      </p>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, value, label, color }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border p-6 ${color}`}
    >
      <Icon className="w-7 h-7 mb-2 opacity-80" />
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-70 text-center">
        {label}
      </p>
    </div>
  );
}

export default function PartnerAgreementPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50/70 flex flex-col items-center px-5 py-12 md:py-16 lg:py-20 mt-12 sm:mt-0">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ── Hero card ─────────────────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-[#070d1a] via-[#0b1220] to-[#0d1530] rounded-2xl p-8 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
            {/* bg glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start gap-5">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Handshake className="text-white w-7 h-7" />
              </div>
              <div>
                <p className="text-sky-400 font-bold text-xs tracking-widest uppercase mb-1">
                  Official Document
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Counselor Partner Agreement
                </h1>
                <p className="text-slate-400 mt-2 text-sm">
                  Khizar Overseas — Effective June 2026
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatPill
                icon={IndianRupee}
                value="₹4,999"
                label="SaaS Fee / Quarter"
                color="bg-white/5 border-white/10 text-white"
              />
              <StatPill
                icon={Users}
                value="2"
                label="Students for Free Quarter"
                color="bg-sky-500/10 border-sky-500/20 text-sky-300"
              />
              <StatPill
                icon={Award}
                value="40%"
                label="Commission on KO Enrollments"
                color="bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
              />
              <StatPill
                icon={Calendar}
                value="90"
                label="Days per Performance Cycle"
                color="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          {/* ── Main document ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-6 sm:p-8 md:p-10 lg:p-12">
            <p className="text-sm text-gray-500 italic mb-8">
              Last updated: June 15, 2026
            </p>

            <p className="text-gray-700 leading-relaxed mb-8">
              This Partner Agreement ("Agreement") governs the relationship
              between Khizar Overseas ("KO", "we", "us") and you, the registered
              education counselor or agency ("Partner", "Counselor", "you"). By
              activating your counselor account on the KO platform, you agree to
              be bound by the terms set out in this Agreement in addition to our{" "}
              <Link
                href="/terms-of-service"
                className="text-sky-600 underline hover:text-sky-800"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-sky-600 underline hover:text-sky-800"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* ── Section 1 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              1. What Khizar Overseas Provides
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Khizar Overseas provides an end-to-end CRM and study-abroad
              management platform designed for Indian education counselors and
              agencies. The platform includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                A full-featured student CRM with lead scoring, application
                tracking (9-stage pipeline), and document management.
              </li>
              <li>
                White-label branding — customize the student-facing dashboard
                with your own logo, brand colors, and welcome message.
              </li>
              <li>
                Khizar Applications — submit students directly through KO's
                enrollment pipeline to partner universities and receive
                commission.
              </li>
              <li>
                Visa tracking, deadline automation, meeting scheduler, task
                management, and analytics.
              </li>
              <li>Real-time notifications via Socket.IO and email alerts.</li>
            </ul>

            {/* ── Section 2 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              2. Free Trial Period
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Every new counselor account receives a{" "}
              <strong>30-day free trial</strong> from the date of activation.
              During this trial you have full access to all platform features
              with no charge. The trial is designed to give you sufficient time
              to onboard students, explore the platform, and evaluate whether to
              continue as a partner.
            </p>
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-5">
              <p className="text-sky-800 text-sm font-medium">
                <strong>Tip:</strong> If you process at least 2 successful KO
                enrollments during the trial, your first full quarter after the
                trial is automatically free.
              </p>
            </div>

            {/* ── Section 3 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              3. Quarterly Performance Cycle — The Core Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              After the initial 30-day trial, access to the KO CRM is governed
              by a <strong>rolling 90-day (quarterly) performance cycle</strong>
              . Whether your next quarter is free or paid depends entirely on
              how many students you successfully enroll through Khizar Overseas
              ("KO Enrollments") in the current quarter.
            </p>

            {/* Visual cycle diagram */}
            <div className="bg-gradient-to-br from-sky-50/50 to-indigo-50/50 border border-sky-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <RefreshCw className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-gray-900 text-base">
                  How the Quarterly Cycle Works
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <CycleCard
                  quarter="Scenario A"
                  condition="You process ≥2 successful KO student enrollments in a quarter"
                  result="✅ Next quarter is completely FREE — ₹0 SaaS fee"
                  highlight={true}
                />
                <CycleCard
                  quarter="Scenario B"
                  condition="You process 0 students through KO in a quarter"
                  result="❌ Next quarter requires ₹4,999 SaaS fee to maintain access"
                  highlight={false}
                />
              </div>

              {/* Flow arrows */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Example Timeline
                </p>
                <div className="space-y-3">
                  {[
                    {
                      q: "Q1 (Trial)",
                      text: "30-day free trial — full access, no charge",
                      free: true,
                    },
                    {
                      q: "Q2",
                      text: "You enroll 3 students through KO → Q3 is FREE",
                      free: true,
                    },
                    {
                      q: "Q3",
                      text: "Free access. You enroll 0 students → Q4 requires ₹4,999",
                      free: true,
                    },
                    {
                      q: "Q4",
                      text: "You pay ₹4,999. Mid-quarter you enroll 2 students → Q5 is FREE",
                      free: false,
                    },
                    {
                      q: "Q5",
                      text: "Free access again — the cycle resets",
                      free: true,
                    },
                  ].map((row, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border mt-0.5 ${
                          row.free
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}
                      >
                        {row.q}
                      </span>
                      <p className="text-sm text-gray-700">{row.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                <p className="text-indigo-800 text-sm font-semibold">
                  💡 Important: If you pay the ₹4,999 fee in a paid quarter and
                  subsequently enroll ≥2 students during that same quarter, the
                  following quarter will be free regardless of whether you paid
                  or not. Enrollments always unlock the next quarter.
                </p>
              </div>
            </div>

            {/* ── Section 4 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              4. Definition: "Successful KO Enrollment"
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              A "successful KO enrollment" or "KO student" means a student who:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                Has been submitted by you through the Khizar Applications
                pipeline on the platform.
              </li>
              <li>
                Has received a confirmed offer letter or admission from a
                partner university processed via KO.
              </li>
              <li>
                Has completed payment of any applicable tuition deposit or
                application fee routed through KO.
              </li>
              <li>
                The enrollment has been marked as{" "}
                <strong>"Enrolled / Confirmed"</strong> by the KO admin team.
              </li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-amber-800 text-sm font-semibold">
                ⚠️ Students you manage independently (outside the Khizar
                Applications pipeline) do NOT count towards the 2-student
                threshold for free quarter eligibility.
              </p>
            </div>

            {/* ── Section 5 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              5. Commission Structure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              For every student successfully enrolled through Khizar Overseas,
              KO receives a commission from the partner university or
              institution. Of this commission:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-sky-600" />
                  <p className="font-bold text-sky-800">Your Share</p>
                </div>
                <p className="text-4xl font-black text-sky-600 mb-1">40%</p>
                <p className="text-sm text-sky-700">
                  of net commission received by KO from the university/agency
                  for that enrollment.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="w-5 h-5 text-gray-600" />
                  <p className="font-bold text-gray-700">KO's Share</p>
                </div>
                <p className="text-4xl font-black text-gray-700 mb-1">60%</p>
                <p className="text-sm text-gray-600">
                  retained by Khizar Overseas to cover platform costs, admin
                  processing, and university relationship management.
                </p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-5">
              Commission payouts are processed within <strong>30 days</strong>{" "}
              of KO receiving payment from the partner institution. Commission
              amounts and timelines vary by institution and program.
            </p>

            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                Commissions are disbursed via bank transfer to the account
                details registered in your counselor profile.
              </li>
              <li>
                Any applicable TDS (Tax Deducted at Source) will be deducted in
                accordance with Indian tax law.
              </li>
              <li>
                KO reserves the right to adjust commission rates with 30 days'
                written notice for new enrollments.
              </li>
              <li>
                Fraudulent or reversed enrollments result in forfeiture of the
                corresponding commission.
              </li>
            </ul>

            {/* ── Section 6 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              6. SaaS Fee — Pricing &amp; Payment Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              When a quarterly fee is applicable (per Section 3 above), the
              following terms apply:
            </p>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 font-bold text-gray-700">
                      Item
                    </th>
                    <th className="text-left p-4 font-bold text-gray-700">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-4 font-medium text-gray-700">Amount</td>
                    <td className="p-4 text-gray-700">
                      ₹4,999 per 90-day (quarterly) cycle
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700">
                      Payment Gateway
                    </td>
                    <td className="p-4 text-gray-700">
                      CashFree (UPI, Net Banking, Cards)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700">
                      Grace Period
                    </td>
                    <td className="p-4 text-gray-700">
                      7 days after quarter start before access is restricted
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700">
                      Access on Non-Payment
                    </td>
                    <td className="p-4 text-gray-700">
                      Platform access suspended until payment is received
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-700">
                      Refundability
                    </td>
                    <td className="p-4 text-gray-700">
                      Non-refundable once the quarter has started (see{" "}
                      <Link
                        href="/refund-policy"
                        className="text-sky-600 underline"
                      >
                        Refund Policy
                      </Link>
                      )
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── Section 7 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              7. White-Label Branding Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              Partners on the platform may customise the student-facing
              dashboard with their own brand identity — including logo, primary
              color, and agency name. This white-label capability is available
              to all active partners (trial or paid).
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                Branding customization does not constitute transfer of any
                intellectual property rights from KO to you.
              </li>
              <li>
                Advanced branding features (custom domain, full theme override)
                may be restricted to premium tiers in future updates.
              </li>
              <li>
                KO retains the right to display a discreet "Powered by Khizar
                Overseas" attribution on student-facing pages.
              </li>
            </ul>

            {/* ── Section 8 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              8. Counselor Obligations
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              As a KO partner counselor, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                Provide honest, accurate, and complete information to students
                regarding study-abroad options, university rankings, costs, and
                visa requirements.
              </li>
              <li>
                Comply with all applicable laws in your state and jurisdiction
                regarding education consultancy practices.
              </li>
              <li>
                Not charge students any fees that are not pre-approved by KO for
                enrollments processed through the KO pipeline.
              </li>
              <li>
                Not misrepresent your association with Khizar Overseas or claim
                benefits that have not been granted.
              </li>
              <li>
                Keep student records accurate and up to date within the CRM.
              </li>
              <li>
                Report any suspected fraud, data breach, or system vulnerability
                to KO immediately via{" "}
                <a
                  href="mailto:support@khizaroverseas.in"
                  className="text-sky-600 underline"
                >
                  support@khizaroverseas.in
                </a>
                .
              </li>
            </ul>

            {/* ── Section 9 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              9. Suspension &amp; Termination
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              KO may suspend or terminate a partner account under the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>Non-payment of SaaS fees beyond the 7-day grace period.</li>
              <li>
                Violation of this Agreement, the Terms of Service, or applicable
                law.
              </li>
              <li>
                Fraudulent activity, submission of fabricated student records,
                or misuse of the commission structure.
              </li>
              <li>
                Reputational harm to Khizar Overseas or its university partners.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-5">
              Upon termination: access is revoked immediately; any unpaid
              commissions earned on valid enrollments prior to termination will
              be disbursed within 60 days after verification; student data will
              be retained for 90 days before deletion.
            </p>

            {/* ── Section 10 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              10. Agreement Updates
            </h2>
            <p className="text-gray-700 leading-relaxed mb-5">
              KO reserves the right to update this Partner Agreement at any
              time. Changes will be communicated via email and an in-platform
              banner at least <strong>14 days before</strong> they take effect
              for existing partners. Continued use of the platform after the
              effective date constitutes your acceptance of the revised terms.
            </p>

            {/* ── Section 11 ─────────────────────────────────────────────── */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
              11. Contact &amp; Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For any questions, disputes, or notices under this Agreement,
              please contact:
            </p>
            <p className="text-gray-700 mb-2">
              Email:{" "}
              <a
                href="mailto:support@khizaroverseas.in"
                className="font-medium text-sky-600 hover:underline"
              >
                support@khizaroverseas.in
              </a>
            </p>
            <p className="text-gray-700 mb-5">
              Website:{" "}
              <Link
                href="/"
                className="font-medium text-sky-600 hover:underline"
              >
                khizaroverseas.in
              </Link>
            </p>
            <p className="text-gray-700 leading-relaxed mb-5">
              This Agreement is governed by the laws of India. Disputes shall be
              resolved in the courts of Hyderabad, Telangana, India.
            </p>

            {/* ── Acceptance banner ─────────────────────────────────────── */}
            <div className="mt-10 bg-gradient-to-br from-[#070d1a] to-[#0d1530] rounded-xl p-6 flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold mb-1">
                  By using the Khizar Overseas counselor platform, you confirm
                  that you have read, understood, and accepted this Partner
                  Agreement in full.
                </p>
                <p className="text-slate-400 text-sm">
                  This acceptance occurs at the time of account activation and
                  again upon each login after a material update.
                </p>
              </div>
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Khizar Overseas. All rights reserved.
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-800 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
