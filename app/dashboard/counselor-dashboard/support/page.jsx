"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  BookOpen,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Zap,
  FileText,
  Shield,
  Scale,
  Handshake,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm sm:text-base">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-sky-500 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

// ── Contact card ─────────────────────────────────────────────────────────────
function ContactCard({ icon: Icon, title, value, href, sub, color }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 bg-white border border-gray-200 hover:border-sky-300 hover:shadow-md rounded-xl p-5 transition-all duration-200"
    >
      <div
        className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-sm group-hover:text-sky-700 transition-colors">
          {title}
        </p>
        <p className="text-sky-600 text-sm font-medium truncate mt-0.5">
          {value}
        </p>
        {sub && <p className="text-gray-400 text-xs mt-1">{sub}</p>}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-sky-400 transition-colors shrink-0 mt-1" />
    </a>
  );
}

// ── Quick link card ────────────────────────────────────────────────────────────
function QuickLink({ icon: Icon, label, href, desc, iconColor }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 bg-white border border-gray-200 hover:border-sky-300 hover:shadow-md rounded-xl p-4 transition-all duration-200"
    >
      <div
        className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm group-hover:text-sky-700 transition-colors">
          {label}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}

const FAQS = [
  {
    q: "How does the free quarter work?",
    a: "If you successfully enroll at least 2 students through the Khizar Applications pipeline in a given 90-day quarter, your next quarter is completely free — no SaaS fee. This resets every quarter. See the Partner Agreement for full details.",
  },
  {
    q: "What counts as a 'successful KO enrollment'?",
    a: "A student you submitted through the Khizar Applications section on the platform who has received a confirmed offer letter, completed tuition deposit payment routed via KO, and has been marked 'Enrolled / Confirmed' by the KO admin team. Students you manage independently (outside Khizar Applications) do not count.",
  },
  {
    q: "When do I receive my commission payout?",
    a: "Commission is disbursed within 30 days of KO receiving confirmed payment from the partner university or institution. You receive 40% of the net commission KO receives for that enrollment, via bank transfer to the account registered in your profile.",
  },
  {
    q: "My trial ended — what happens to my students' data?",
    a: "If your access is suspended due to non-payment or trial expiry, your student data is preserved on the platform. Once you resume access (either by paying the SaaS fee or by processing a qualifying enrollment), everything is exactly as you left it. Data is only permanently deleted 90 days after account termination.",
  },
  {
    q: "Can I use the platform to manage students I'm not sending through KO?",
    a: "Yes. You can add and manage any student in the CRM regardless of which university or pathway they pursue. The 2-student KO enrollment threshold only applies to unlocking your free next quarter — general CRM usage is unrestricted.",
  },
  {
    q: "How do I customise the student-facing dashboard with my branding?",
    a: "Go to Settings → Branding in your counselor dashboard. You can upload your logo, set your agency name, and pick a primary brand color. The student dashboard will immediately reflect your branding when students log in.",
  },
  {
    q: "What happens if I pay the ₹4,999 fee and then enroll 2 students in that same quarter?",
    a: "Your payment gives you access for that quarter. If you also enroll ≥2 students during that same paid quarter, the following quarter will be free. The performance cycle always looks forward — enrollments always unlock the next quarter.",
  },
  {
    q: "I forgot my password / can't log in. What do I do?",
    a: 'Use the "Forgot Password" link on the login page to receive a password reset email. If you still cannot access your account, email support@khizaroverseas.in with your registered email address and we will manually assist you.',
  },
  {
    q: "How do I update my bank account for commission payouts?",
    a: "Go to Settings → Profile in your counselor dashboard and update your bank details. Changes take effect for the next payout cycle. For urgent updates, contact support@khizaroverseas.in.",
  },
  {
    q: "Is student data secure on the platform?",
    a: "Yes. All data is stored with encryption at rest, transmitted over HTTPS, and access is controlled via role-based authentication using secure HTTP-only cookies. KO does not sell or share student data with third parties outside of the direct application workflow.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50/70 px-5 py-12 md:py-16 lg:py-20 mt-12 sm:mt-0">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-[#070d1a] via-[#0b1220] to-[#0d1530] rounded-2xl p-8 sm:p-10 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                  <HelpCircle className="text-white w-7 h-7" />
                </div>
                <div>
                  <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-1">
                    Khizar Overseas
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Help &amp; Support
                  </h1>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Find answers to the most common questions about the KO counselor
                platform, or reach out to our team directly. We're here to help
                you succeed.
              </p>

              {/* Response time badge */}
              <div className="mt-6 inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span className="text-sky-300 text-xs font-semibold">
                  Typical response time: within 24 hours (Mon–Sat)
                </span>
              </div>
            </div>
          </div>

          {/* ── Contact options ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-sky-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Contact Support
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <ContactCard
                icon={Mail}
                title="Email Support"
                value="support@khizaroverseas.in"
                href="mailto:support@khizaroverseas.in"
                sub="For billing, account issues, and general queries"
                color="bg-sky-50 text-sky-600"
              />
              <ContactCard
                icon={Zap}
                title="Visit Our Website"
                value="khizaroverseas.in"
                href="https://khizaroverseas.in"
                sub="Learn more about KO services and university partners"
                color="bg-indigo-50 text-indigo-600"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  <strong>
                    For urgent commission or account suspension issues
                  </strong>{" "}
                  — please email with subject line starting with{" "}
                  <code className="bg-amber-100 px-1 rounded font-mono text-xs">
                    [URGENT]
                  </code>{" "}
                  for faster triage.
                </p>
              </div>
            </div>
          </div>

          {/* ── Quick links ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Useful Resources
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickLink
                icon={BookOpen}
                label="Dashboard Manual"
                href="/dashboard/counselor-dashboard/manual"
                desc="Complete guide to every feature of the counselor CRM"
                iconColor="bg-sky-50 text-sky-600"
              />
              <QuickLink
                icon={Handshake}
                label="Partner Agreement"
                href="/partner-agreement"
                desc="Quarterly performance cycle, commission, and SaaS fees"
                iconColor="bg-indigo-50 text-indigo-600"
              />
              <QuickLink
                icon={FileText}
                label="Terms of Service"
                href="/terms-of-service"
                desc="Platform usage terms and conditions"
                iconColor="bg-slate-50 text-slate-600"
              />
              <QuickLink
                icon={Shield}
                label="Privacy Policy"
                href="/privacy-policy"
                desc="How we collect, use, and protect your data"
                iconColor="bg-emerald-50 text-emerald-600"
              />
              <QuickLink
                icon={Scale}
                label="Refund Policy"
                href="/refund-policy"
                desc="Conditions under which refunds are considered"
                iconColor="bg-amber-50 text-amber-600"
              />
            </div>
          </div>

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-sky-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

          {/* ── Still need help CTA ───────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-[#070d1a] to-[#0d1530] rounded-2xl p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-lg">
                  Still can't find what you need?
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Our support team is happy to help — reach out directly and
                  we'll get back to you as soon as possible.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@khizaroverseas.in"
              className="shrink-0 inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-colors shadow-lg shadow-sky-500/25"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
          </div>

          <div className="text-center">
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
