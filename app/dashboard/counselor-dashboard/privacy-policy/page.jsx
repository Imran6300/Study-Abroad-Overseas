"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Eye,
  Database,
  Share2,
  Lock,
  UserCheck,
  Globe,
  Cookie,
  RefreshCw,
  Mail,
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

export default function CounselorPrivacyPolicyPage() {
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
                <Shield className="text-white w-7 h-7" />
              </div>
              <div>
                <p className="text-sky-400 font-bold text-xs tracking-widest uppercase mb-1">
                  Khizar Overseas · Counselor Platform
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Privacy Policy
                </h1>
                <p className="text-slate-400 mt-2 text-sm">
                  Last updated: January 25, 2026
                </p>
              </div>
            </div>

            <p className="relative z-10 mt-6 text-slate-400 text-sm leading-relaxed max-w-2xl">
              We are committed to protecting your personal information and your
              right to privacy. This Policy explains how we collect, use,
              disclose, and safeguard your information when you use the Khizar
              Overseas counselor platform and related services.
            </p>

            {/* Quick-glance badges */}
            <div className="relative z-10 mt-6 flex flex-wrap gap-2">
              {[
                "No data selling",
                "Encrypted storage",
                "Role-based access",
                "HTTPS only",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ── Main document ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-6 sm:p-8 md:p-10 lg:p-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to Khizar Overseas. By using our website or counselor
              platform, you agree to the collection and use of information in
              accordance with this policy. If you do not agree, please do not
              use our services.
            </p>

            {/* ── 1 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Database}
              number="1"
              title="Information We Collect"
            />
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                <strong className="text-gray-900">Personal Information</strong>{" "}
                — full name, email address, phone number, date of birth,
                nationality, current education level, preferred study
                destination or countries.
              </li>
              <li>
                <strong className="text-gray-900">Account Data</strong> —
                username, password (encrypted), profile photo (optional).
              </li>
              <li>
                <strong className="text-gray-900">
                  Application / Consultancy Data
                </strong>{" "}
                — academic transcripts, passport details, financial documents,
                test scores (IELTS / TOEFL / PTE / GRE etc.), SOP, LOR when
                submitted.
              </li>
              <li>
                <strong className="text-gray-900">Technical Data</strong> — IP
                address, browser type, device information, pages visited, time
                spent, referral source.
              </li>
              <li>
                <strong className="text-gray-900">Communication Data</strong> —
                messages, emails, and chat records related to your enquiry.
              </li>
            </ul>

            {/* ── 2 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Eye}
              number="2"
              title="How We Use Your Information"
            />
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                To provide, maintain and improve our consultancy services.
              </li>
              <li>
                To process university and visa application enquiries and
                documentation.
              </li>
              <li>
                To communicate with you — updates, reminders, offers, and
                counselling sessions.
              </li>
              <li>
                To personalise your experience and recommend suitable programs
                and countries.
              </li>
              <li>
                To comply with legal obligations, including immigration
                authorities when required.
              </li>
              <li>
                To detect, prevent, and address technical issues or fraudulent
                activity.
              </li>
            </ul>

            {/* ── 3 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Share2}
              number="3"
              title="Sharing of Your Information"
            />
            <InfoCard variant="blue">
              <strong>We do not sell your personal information.</strong> We may
              share your data only in the limited cases described below.
            </InfoCard>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>
                With partner universities, colleges, and language test providers
                — only with your explicit consent.
              </li>
              <li>
                With visa or immigration consultants or lawyers when you
                authorise us to do so.
              </li>
              <li>
                With service providers such as email services, cloud storage,
                and analytics tools — under strict confidentiality agreements.
              </li>
              <li>
                When required by law, court order, or government or immigration
                authorities.
              </li>
              <li>
                In connection with a merger, acquisition, or sale of assets —
                with prior notice to you.
              </li>
            </ul>

            {/* ── 4 ──────────────────────────────────────────────────────── */}
            <SectionHeading icon={Lock} number="4" title="Data Security" />
            <p className="text-gray-700 leading-relaxed mb-5">
              We implement appropriate technical and organisational measures to
              protect your personal data against unauthorised access,
              alteration, disclosure, or destruction. This includes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {[
                { label: "Encrypted storage at rest", icon: "🔒" },
                { label: "HTTPS-only transmission", icon: "🛡️" },
                { label: "HTTP-only secure cookies", icon: "🍪" },
                { label: "Role-based access control", icon: "👤" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium"
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
            <InfoCard variant="amber">
              No method of transmission over the internet or electronic storage
              is 100% secure. While we strive to protect your information, we
              cannot guarantee absolute security.
            </InfoCard>

            {/* ── 5 ──────────────────────────────────────────────────────── */}
            <SectionHeading icon={UserCheck} number="5" title="Your Rights" />
            <p className="text-gray-700 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
              <li>Access, correct, or delete your personal information.</li>
              <li>Withdraw consent where we rely on consent for processing.</li>
              <li>Object to or restrict processing of your data.</li>
              <li>Data portability in certain cases.</li>
            </ul>
            <InfoCard variant="blue">
              To exercise any of these rights, please contact us at{" "}
              <a
                href="mailto:support@khizaroverseas.in"
                className="font-semibold underline"
              >
                support@khizaroverseas.in
              </a>
              . We will respond within 30 days.
            </InfoCard>

            {/* ── 6 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Globe}
              number="6"
              title="International Data Transfers"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              As an overseas education consultancy, your data may be transferred
              to and processed in countries outside your home country —
              including but not limited to Canada, Australia, UK, USA, Germany,
              and Ireland. We ensure appropriate safeguards are in place for all
              cross-border data transfers.
            </p>

            {/* ── 7 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={Cookie}
              number="7"
              title="Cookies & Tracking Technologies"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              We use cookies and similar technologies to enhance user
              experience, analyse platform usage, and show relevant content. The
              counselor dashboard uses secure HTTP-only session cookies for
              authentication — these cannot be accessed by client-side scripts
              and help prevent session hijacking. You can manage general cookie
              preferences through your browser settings.
            </p>

            {/* ── 8 ──────────────────────────────────────────────────────── */}
            <SectionHeading
              icon={RefreshCw}
              number="8"
              title="Changes to This Privacy Policy"
            />
            <p className="text-gray-700 leading-relaxed mb-5">
              We may update this policy from time to time. We will notify you of
              material changes by posting the new policy on this page and
              updating the "Last updated" date above. For significant changes,
              we will also send an email notification to your registered
              address.
            </p>

            {/* ── 9 ──────────────────────────────────────────────────────── */}
            <SectionHeading icon={Mail} number="9" title="Contact Us" />
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please reach
              out:
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
              <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm leading-relaxed">
                By continuing to use the Khizar Overseas counselor platform, you
                acknowledge that you have read and understood this Privacy
                Policy and consent to the collection and use of your information
                as described.
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
