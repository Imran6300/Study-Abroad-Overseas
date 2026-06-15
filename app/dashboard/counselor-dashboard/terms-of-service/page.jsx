"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Shield, Scale, AlertCircle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50/70 flex flex-col items-center px-5 py-12 md:py-16 lg:py-20 mt-12 sm:mt-0">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            bg-white rounded-2xl shadow-xl border border-gray-200/60
            p-6 sm:p-8 md:p-10 lg:p-12
          "
        >
          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight m-0">
                Khizar Overseas
              </h1>
              <p className="text-base text-gray-600 mt-1 font-medium">
                Terms of Service
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic mb-10">
            Last updated: June 15, 2026
          </p>

          <p className="mb-8 leading-7 text-gray-700">
            Please read these Terms of Service carefully before using the Khizar
            Overseas platform, website, or any associated services. By accessing
            or using our platform, you confirm that you have read, understood,
            and agree to be bound by these Terms.
          </p>

          {/* ── Section 1 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            By creating an account, accessing the counselor dashboard, or using
            any feature of Khizar Overseas ("KO", "we", "us", or "our"), you
            ("Counselor", "Partner", "User") agree to these Terms of Service and
            our Privacy Policy. If you do not agree, you must not use the
            platform.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            These Terms govern the use of the Khizar Overseas CRM platform —
            including student management, application processing, visa tracking,
            branding tools, and all related services.
          </p>

          {/* ── Section 2 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            2. Platform Access &amp; Account Responsibilities
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            You are responsible for maintaining the confidentiality of your
            login credentials. You agree not to share your account with any
            third party, not to use the platform for any unlawful purpose, and
            to provide accurate information when registering.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
            <li>
              You must be at least 18 years of age to register as a counselor.
            </li>
            <li>
              Each account is for a single authorized counselor or agency
              representative.
            </li>
            <li>
              You are responsible for all activity that occurs under your
              account.
            </li>
            <li>
              KO reserves the right to suspend or terminate accounts found
              violating these Terms.
            </li>
          </ul>

          {/* ── Section 3 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            3. CRM &amp; SaaS Platform Usage
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Khizar Overseas provides a Software-as-a-Service (SaaS) platform for
            overseas education counselors. Access to the CRM is governed by the
            subscription and performance terms outlined in our Partner
            Agreement.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            New counselors receive a <strong>30-day free trial</strong> upon
            activation. After the trial period, access is governed by the
            quarterly performance cycle described in the Partner Agreement. You
            may not reverse engineer, copy, or redistribute any part of the
            platform.
          </p>

          {/* ── Section 4 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            4. Student Data &amp; Privacy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            As a counselor, you may upload and manage personally identifiable
            information (PII) of students. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
            <li>
              Obtain proper consent from students before entering their data
              into the platform.
            </li>
            <li>
              Use student data solely for the purpose of overseas education
              guidance.
            </li>
            <li>
              Not share student data with unauthorized third parties outside of
              Khizar Overseas workflows.
            </li>
            <li>
              Ensure that your use of the platform complies with applicable data
              protection laws in India.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-5">
            KO takes data security seriously and employs industry-standard
            measures including encrypted storage, secure HTTP-only cookies, and
            role-based access control.
          </p>

          {/* ── Section 5 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            5. Commission &amp; Payments
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            When you process student applications through KO's enrollment
            pipeline (Khizar Applications), KO earns a service fee from
            university or agency partners. You are entitled to a commission as
            described in the Partner Agreement currently set at{" "}
            <strong>40% of the net revenue</strong> received by KO for that
            enrollment.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            Commission payouts are processed after confirmation of student
            enrollment and receipt of payment from the respective institution.
            KO reserves the right to withhold commission in cases of fraudulent
            or disputed enrollments.
          </p>
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-5">
            <p className="text-sky-800 font-semibold text-sm">
              ℹ️ For SaaS fee terms, quarterly free-access conditions, and
              detailed commission structure, please refer to the{" "}
              <Link
                href="/partner-agreement"
                className="underline text-sky-600 hover:text-sky-800"
              >
                Partner Agreement
              </Link>
              .
            </p>
          </div>

          {/* ── Section 6 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            6. Prohibited Activities
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            You agree not to engage in any of the following:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
            <li>
              Providing false or misleading information to students or to KO.
            </li>
            <li>
              Collecting fees from students in violation of applicable education
              agent regulations.
            </li>
            <li>
              Using the platform to spam, solicit, or harass students or
              institutions.
            </li>
            <li>
              Attempting to bypass platform security, access other users'
              accounts, or interfere with platform infrastructure.
            </li>
            <li>
              Reverse engineering, scraping, or copying the platform's code,
              design, or data.
            </li>
            <li>
              Sub-licensing, reselling, or redistributing platform access
              without prior written consent from KO.
            </li>
          </ul>

          {/* ── Section 7 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            7. Intellectual Property
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            All content, features, designs, logos, and source code of the Khizar
            Overseas platform are the exclusive intellectual property of Khizar
            Overseas and its licensors. You may not reproduce, modify, or
            distribute any part of the platform without express written
            permission.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            The white-label branding feature allows you to customise the
            student-facing dashboard with your own logo and colors. This does
            not transfer any intellectual property rights to you. Your branding
            assets remain your property; KO's underlying platform infrastructure
            remains KO's property.
          </p>

          {/* ── Section 8 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Khizar Overseas provides the platform "as is" without warranties of
            any kind, express or implied. To the maximum extent permitted by
            applicable law:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-5 text-gray-700">
            <li>
              KO is not liable for any indirect, incidental, or consequential
              damages arising from your use of the platform.
            </li>
            <li>
              KO is not responsible for university admission decisions, visa
              outcomes, or scholarship results.
            </li>
            <li>
              KO's total liability to you for any claim is limited to the amount
              you paid in the immediately preceding 3-month period.
            </li>
          </ul>

          {/* ── Section 9 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            9. Termination
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            KO may suspend or terminate your account at any time for violation
            of these Terms, non-payment of SaaS fees, or if we determine in good
            faith that your activity is harmful to students, institutions, or
            the platform.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            You may terminate your account at any time by contacting support.
            Upon termination, your access to the platform will be revoked.
            Student data you have entered will be retained for a period of 90
            days and then deleted, unless required by law.
          </p>

          {/* ── Section 10 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            10. Governing Law &amp; Disputes
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            These Terms are governed by the laws of India. Any disputes arising
            out of or in connection with these Terms shall be subject to the
            exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
          </p>
          <p className="text-gray-700 leading-relaxed mb-5">
            Both parties agree to first attempt resolution through good-faith
            negotiation before initiating any formal legal proceedings.
          </p>

          {/* ── Section 11 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            11. Changes to These Terms
          </h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Khizar Overseas reserves the right to update these Terms at any
            time. Material changes will be communicated via email or an
            in-platform notice. Your continued use of the platform after changes
            are posted constitutes acceptance of the revised Terms.
          </p>

          {/* ── Section 12 ──────────────────────────────────────────────────── */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-10 mb-4">
            12. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have any questions about these Terms, please reach out:
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
            <Link href="/" className="font-medium text-sky-600 hover:underline">
              khizaroverseas.in
            </Link>
          </p>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Khizar Overseas. All rights reserved.
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
