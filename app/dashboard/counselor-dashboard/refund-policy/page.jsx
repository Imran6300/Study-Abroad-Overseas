"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Scale,
  Ban,
  Laptop,
  CheckCircle,
  Clock,
  GraduationCap,
  CreditCard,
  RefreshCw,
  Mail,
  AlertTriangle,
} from "lucide-react";

// ── Section heading component ─────────────────────────────────────────────────
function SectionHeading({ icon: Icon, number, title }) {
  return (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 m-0">
        {number}. {title}
      </h2>
    </div>
  );
}

// ── Info card ─────────────────────────────────────────────────────────────────
function InfoCard({ children, variant = "blue" }) {
  const variants = {
    blue: "bg-sky-50 border-sky-200 text-sky-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
    slate: "bg-slate-50 border-slate-200 text-slate-700",
  };
  return (
    <div
      className={`border rounded-xl p-4 mb-5 text-sm leading-relaxed ${variants[variant]}`}
    >
      {children}
    </div>
  );
}

export default function CounselorRefundPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50/70 flex flex-col items-center px-5 py-12 md:py-16 lg:py-20 mt-12 sm:mt-0">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ── Dark hero card ─────────────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-[#070d1a] via-[#0b1220] to-[#0d1530] rounded-2xl p-8 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-start gap-5">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Scale className="text-white w-7 h-7" />
              </div>
              <div>
                <p className="text-sky-400 font-bold text-xs tracking-widest uppercase mb-1">
                  Khizar Overseas · Counselor Platform
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Refund Policy
                </h1>
                <p className="text-slate-400 mt-2 text-sm">
                  Last updated: March 11, 2026
                </p>
              </div>
            </div>

            <p className="relative z-10 mt-6 text-slate-400 text-sm leading-relaxed max-w-2xl">
              This Refund Policy explains the conditions under which refunds may
              be issued for services purchased through Khizar Overseas. By
              purchasing our services, you agree to this policy.
            </p>

            {/* Key facts strip */}
            <div className="relative z-10 mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Most services", sub: "Non-refundable once started" },
                { label: "Approved refunds", sub: "7–10 business days" },
                { label: "Exceptions", sub: "Duplicate / billing errors only" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <p className="text-white font-bold text-sm">{item.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main document ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-6 sm:p-8 md:p-10 lg:p-12">
            {/* ── 1 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Scale}
              number="1"
              title="General Refund Policy"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              Khizar Overseas provides professional consultancy and digital
              services related to overseas education, including profile
              evaluation, application support, university shortlisting, SOP/LOR
              guidance, and visa assistance.
            </p>
            <p className="text-gray-700 leading-relaxed mb-5">
              Due to the nature of consultancy and digital services, most
              services become{" "}
              <strong>non-refundable once work has started</strong>. Please
              review this policy carefully before making a purchase.
            </p>

            {/* ── 2 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Ban}
              number="2"
              title="Non-Refundable Services"
            />
            <p className="text-gray-700 leading-relaxed mb-4">
              Once any of the following services have commenced, payments are
              generally non-refundable:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>Profile evaluation and counselling sessions</li>
              <li>University shortlisting and research work</li>
              <li>Application submission assistance</li>
              <li>SOP / LOR review or writing guidance</li>
              <li>Visa documentation support</li>
              <li>AI-based recommendations or digital platform tools</li>
            </ul>
            <InfoCard variant="red">
              <strong>⚠️ No refunds</strong> will be issued for university
              admission rejections, visa refusals, scholarship decisions, or
              changes in personal plans after services have started.
            </InfoCard>

            {/* ── 3 ──────────────────────────────────────────────────────── */}
            <SectionHeading icon={Laptop} number="3" title="Digital Services" />
            <p className="text-gray-700 leading-relaxed mb-5">
              Some services offered by Khizar Overseas are delivered digitally,
              including consultations, profile analysis, document reviews, and
              AI tools available through the platform.
            </p>
            <InfoCard variant="amber">
              By purchasing these services, you acknowledge that delivery may
              begin <strong>immediately after payment</strong> and therefore
              such services are generally non-refundable.
            </InfoCard>

            {/* ── 4 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={CheckCircle}
              number="4"
              title="Refund Exceptions"
            />
            <p className="text-gray-700 leading-relaxed mb-4">
              Refunds may be considered only under these limited circumstances:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {[
                {
                  emoji: "🔁",
                  title: "Duplicate Payment",
                  desc: "Technical error caused the same payment to be charged twice",
                },
                {
                  emoji: "🚫",
                  title: "Service Not Initiated",
                  desc: "Payment was made but the service had not yet been started",
                },
                {
                  emoji: "❌",
                  title: "Billing Mistake",
                  desc: "An incorrect amount was charged due to a billing error on our side",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center"
                >
                  <span className="text-2xl block mb-2">{item.emoji}</span>
                  <p className="font-bold text-gray-800 text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mb-5">
              If a refund is approved under these circumstances, it will be
              processed through the original payment method.
            </p>

            {/* ── 5 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Clock}
              number="5"
              title="Refund Processing Time"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              Approved refunds are typically processed within{" "}
              <strong>7–10 business days</strong>. The exact timeline may vary
              depending on your payment gateway, bank, or financial institution.
              You will receive an email confirmation once a refund is initiated.
            </p>

            {/* ── 6 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={GraduationCap}
              number="6"
              title="University Fees"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              Application or admission fees charged by universities are entirely
              separate from Khizar Overseas service fees.
            </p>
            <InfoCard variant="amber">
              University fees must be paid directly to the respective university
              and are governed solely by that university's own refund policy.
              Khizar Overseas has no authority to refund these fees.
            </InfoCard>

            {/* ── 7 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={CreditCard}
              number="7"
              title="Payment Gateways"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              Payments are processed using secure third-party payment gateways,
              primarily <strong>Razorpay</strong>. Refunds approved under this
              policy will be issued through the same payment method whenever
              possible. In cases where the original payment method is
              unavailable, we will coordinate an alternative with you.
            </p>

            {/* ── 8 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={RefreshCw}
              number="8"
              title="Policy Updates"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              Khizar Overseas reserves the right to update or modify this Refund
              Policy at any time. Changes will be posted on this page along with
              the updated revision date. Continued use of the platform after
              changes are posted constitutes acceptance of the revised policy.
            </p>

            {/* ── 9 ──────────────────────────────────────────────────────── */}
            <SectionHeading icon={Mail} number="9" title="Contact Us" />
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this Refund Policy or wish to submit a
              refund request, please contact:
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
            <p className="text-gray-700 mb-8">
              Website:{" "}
              <Link
                href="/"
                className="font-medium text-sky-600 hover:underline"
              >
                khizaroverseas.in
              </Link>
            </p>

            {/* ── acceptance banner ─────────────────────────────────────── */}
            <div className="mt-10 bg-gradient-to-br from-[#070d1a] to-[#0d1530] rounded-xl p-6 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm leading-relaxed">
                By purchasing services from Khizar Overseas or continuing to use
                the counselor platform, you confirm that you have read and
                agreed to this Refund Policy in full.
              </p>
            </div>

            {/* ── footer ───────────────────────────────────────────────── */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Khizar Overseas. All rights reserved.
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/dashboard/counselor-dashboard"
              className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-800 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
