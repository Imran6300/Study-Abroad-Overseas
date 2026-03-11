"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function PrivacyPolicyPage() {
  return (
    <div
      className="
        min-h-screen w-full bg-[#F7F9FC]
        flex flex-col items-center
        px-4 py-10 md:py-16 lg:py-20
        mt-12 sm:mt-0
      "
    >
      <div className="w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            bg-white rounded-xl shadow-lg border border-gray-200/70
            p-6 sm:p-8 md:p-10
            prose prose-sm sm:prose-base lg:prose-lg
            max-w-none
          "
        >
          {/* Header / Branding */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A6BFF] to-[#22C55E] flex items-center justify-center shadow-sm">
              <FaGraduationCap className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Khizar Overseas
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">Privacy Policy</p>
            </div>
          </div>

          {/* Last updated */}
          <p className="text-sm text-gray-500 mb-8 italic">
            Last updated: January 25, 2026
          </p>

          {/* Main Content */}
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Welcome to Khizar Overseas. We are committed to protecting your
            personal information and your right to privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website
            https://khizar-overseas.vercel.app/, use our services, or contact us
            regarding overseas education, visa guidance, university
            applications, or related consultancy services.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            By using our website or services, you agree to the collection and
            use of information in accordance with this policy. If you do not
            agree, please do not use our services.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4 font-medium">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              <strong>Personal Information</strong>: full name, email address,
              phone number, date of birth, nationality, current education level,
              preferred study destination/countries
            </li>
            <li>
              <strong>Account Data</strong>: username, password (encrypted),
              profile photo (optional)
            </li>
            <li>
              <strong>Application/Consultancy Data</strong>: academic
              transcripts, passport details, financial documents, test scores
              (IELTS/TOEFL/PTE/GRE/etc.), SOP, LOR (when you submit them)
            </li>
            <li>
              <strong>Technical Data</strong>: IP address, browser type, device
              information, pages visited, time spent, referral source
            </li>
            <li>
              <strong>Communication Data</strong>: messages, emails,
              WhatsApp/chat records related to your enquiry
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>To provide, maintain and improve our consultancy services</li>
            <li>
              To process your university/visa application enquiries and
              documentation
            </li>
            <li>
              To communicate with you (updates, reminders, offers, counselling
              sessions)
            </li>
            <li>
              To personalize your experience and recommend suitable
              programs/countries
            </li>
            <li>
              To comply with legal obligations (including immigration
              authorities when required)
            </li>
            <li>
              To detect, prevent and address technical issues or fraudulent
              activity
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            4. Sharing of Your Information
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We do <strong>not</strong> sell your personal information. We may
            share your data only in these limited cases:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>
              With partner universities, colleges, language test providers (only
              with your explicit consent)
            </li>
            <li>
              With visa/immigration consultants or lawyers when you authorize us
            </li>
            <li>
              With service providers (email service, cloud storage, analytics –
              under strict confidentiality)
            </li>
            <li>
              When required by law, court order, or government/immigration
              authorities
            </li>
            <li>
              In connection with a merger, acquisition, or sale of assets (with
              notice to you)
            </li>
          </ul>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            5. Data Security
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration,
            disclosure or destruction. However, no method of transmission over
            the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            6. Your Rights
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
            <li>Access, correct, or delete your personal information</li>
            <li>Withdraw consent where we rely on consent</li>
            <li>Object to or restrict processing</li>
            <li>Data portability (in certain cases)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-6">
            To exercise these rights, please contact us at:{" "}
            <strong>support@khizaroverseas.com</strong>
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            7. International Data Transfers
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            As an overseas education consultancy, your data may be transferred
            to and processed in countries outside your home country (including
            but not limited to Canada, Australia, UK, USA, Germany, Ireland,
            etc.). We ensure appropriate safeguards are in place.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            8. Cookies & Tracking Technologies
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We use cookies and similar technologies to enhance user experience,
            analyze usage, and show relevant content. You can manage cookie
            preferences through your browser settings.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We may update this policy from time to time. We will notify you of
            material changes by posting the new policy on this page and updating
            the "Last updated" date.
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-10 mb-4">
            10. Contact Us
          </h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            If you have any questions about this Privacy Policy, please contact:
          </p>
          <p className="text-gray-700 font-medium">
            Email:{" "}
            <a
              href="mailto:support@khizaroverseas.com"
              className="text-[#4A6BFF] hover:underline"
            >
              support@khizaroverseas.com
            </a>
          </p>
          <p className="text-gray-700 mt-1">
            Website:{" "}
            <Link href="/" className="text-[#4A6BFF] hover:underline">
              khizar-overseas.vercel.app
            </Link>
          </p>

          {/* Footer note */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Khizar Overseas. All rights reserved.
          </div>
        </motion.div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[#4A6BFF] font-medium hover:underline inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
