"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function RefundPolicyPage() {
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
            prose prose-sm sm:prose-base lg:prose-lg
            prose-gray max-w-prose mx-auto
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-2xl sm:prose-h2:text-3xl
            prose-p:mb-5 prose-p:leading-7 prose-p:text-gray-800
            prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-li:leading-6
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          "
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-200">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-md">
              <FaGraduationCap className="text-white text-2xl" />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight m-0">
                Khizar Overseas
              </h1>
              <p className="text-base text-gray-600 mt-1 font-medium">
                Refund Policy
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic mb-10">
            Last updated: March 11, 2026
          </p>

          <p className="mb-8 leading-7">
            This Refund Policy explains the conditions under which refunds may
            be issued for services purchased through Khizar Overseas. By
            purchasing our services, you agree to this policy.
          </p>

          <h2>1. General Refund Policy</h2>
          <p>
            Khizar Overseas provides professional consultancy and digital
            services related to overseas education, including profile
            evaluation, application support, university shortlisting, SOP/LOR
            guidance, and visa assistance.
          </p>

          <p>
            Due to the nature of consultancy and digital services, most services
            become non-refundable once work has started.
          </p>

          <h2>2. Non-Refundable Services</h2>

          <p>
            Once any of the following services have commenced, payments are
            generally non-refundable:
          </p>

          <ul>
            <li>Profile evaluation and counselling sessions</li>
            <li>University shortlisting and research work</li>
            <li>Application submission assistance</li>
            <li>SOP / LOR review or writing guidance</li>
            <li>Visa documentation support</li>
            <li>AI-based recommendations or digital platform tools</li>
          </ul>

          <p className="font-semibold text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
            Refunds will NOT be issued for university admission rejections, visa
            refusals, scholarship decisions, or changes in personal plans after
            services have started.
          </p>

          <h2>3. Digital Services</h2>

          <p>
            Some services offered by Khizar Overseas are delivered digitally,
            including consultations, profile analysis, document reviews, or AI
            tools available through the platform.
          </p>

          <p>
            By purchasing these services, you acknowledge that delivery may
            begin immediately after payment and therefore such services are
            generally non-refundable.
          </p>

          <h2>4. Refund Exceptions</h2>

          <p>
            Refunds may be considered only under limited circumstances,
            including:
          </p>

          <ul>
            <li>Duplicate payment due to technical error</li>
            <li>Payment made but service not initiated</li>
            <li>Incorrect charge due to billing mistake</li>
          </ul>

          <p>
            If a refund is approved under these circumstances, it will be
            processed through the original payment method.
          </p>

          <h2>5. Refund Processing Time</h2>

          <p>
            Approved refunds are typically processed within 7–10 business days.
            The exact time may vary depending on the payment gateway, bank, or
            financial institution.
          </p>

          <h2>6. University Fees</h2>

          <p>
            Application or admission fees charged by universities are separate
            from Khizar Overseas service fees.
          </p>

          <p className="font-semibold text-amber-800 bg-amber-50/70 p-4 rounded-lg border border-amber-200">
            University fees must be paid directly to the respective university
            and are governed by that university's refund policy.
          </p>

          <h2>7. Payment Gateways</h2>

          <p>
            Payments may be processed using secure third-party payment gateways
            such as Razorpay. Refunds approved under this policy will be issued
            through the same payment method whenever possible.
          </p>

          <h2>8. Policy Updates</h2>

          <p>
            Khizar Overseas reserves the right to update or modify this Refund
            Policy at any time. Changes will be posted on this page along with
            the updated revision date.
          </p>

          <h2>9. Contact Us</h2>

          <p>If you have questions about this Refund Policy, please contact:</p>

          <p>
            Email:{" "}
            <a
              href="mailto:support@khizaroverseas.com"
              className="font-medium text-blue-600 hover:underline"
            >
              support@khizaroverseas.com
            </a>
          </p>

          <p>
            Website:{" "}
            <Link
              href="/"
              className="font-medium text-blue-600 hover:underline"
            >
              khizaroverseas.in
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Khizar Overseas. All rights reserved.
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
