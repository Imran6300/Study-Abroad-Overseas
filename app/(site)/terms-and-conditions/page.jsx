"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGraduationCap } from "react-icons/fa";

export default function TermsConditionsPage() {
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
                Terms & Conditions
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic mb-10">
            Last updated: March 11, 2026
          </p>

          <p className="mb-8 leading-7">
            These Terms and Conditions ("Terms") govern your access to and use
            of the Khizar Overseas website (
            <span className="font-medium">khizaroverseas.in</span>), services,
            consultations, and related offerings (collectively, the "Services").
            Please read them carefully.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing, browsing, or using our Services, you agree to be bound
            by these Terms. If you do not agree, you must not use the Services.
            We may update these Terms at any time — continued use after changes
            constitutes acceptance.
          </p>

          <h2>2. Description of Services</h2>
          <p>
            Khizar Overseas is an education consultancy assisting students with
            overseas higher education. Services may include:
          </p>
          <ul>
            <li>University / course shortlisting</li>
            <li>Academic & profile evaluation</li>
            <li>Application form filling & submission support</li>
            <li>
              Statement of Purpose (SOP), Essays & Letter of Recommendation
              (LOR) guidance
            </li>
            <li>Visa application guidance & document checklist</li>
            <li>Scholarship / funding options information</li>
            <li>Pre-departure & post-arrival orientation (where applicable)</li>
          </ul>
          <p className="mt-4 font-semibold text-amber-800 bg-amber-50/70 p-4 rounded-lg border border-amber-200">
            Important: We provide guidance and assistance only. We do{" "}
            <strong>NOT</strong> guarantee university admission, visa approval,
            scholarship award, or any other outcome. Final decisions rest solely
            with universities, consulates, and immigration authorities.
          </p>

          <h2>3. User Obligations & Representations</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide complete, accurate, and up-to-date information</li>
            <li>Submit only genuine, authentic documents</li>
            <li>
              Comply with all laws, university policies, and immigration rules
              of the destination country
            </li>
            <li>
              Not engage in misrepresentation, fraud, or unethical practices
            </li>
          </ul>
          <p>
            Any false information or forged documents may lead to application
            rejection, visa refusal, blacklisting, or legal consequences —
            Khizar Overseas bears no responsibility for such outcomes.
          </p>

          <h2>4. Platform Usage</h2>
          <p>
            Users agree not to misuse the platform, attempt unauthorized access,
            upload malicious content, scrape data, or interfere with the normal
            operation of the website or services.
          </p>
          <p>
            Application fees charged by universities are separate and must be
            paid directly to the respective university. Khizar Overseas service
            fees cover consultancy, guidance, and application support only.
          </p>

          <h2>5. Fees, Payments & Refund Policy</h2>
          <p>
            Certain Services require payment. Fees and scope are communicated
            clearly before engagement (via quote, invoice, or agreement).
          </p>
          <p>
            Payments are processed through secure gateways (e.g., Razorpay). All
            fees are non-refundable once Services commence (document review,
            profile building, application submission, etc.), except as
            explicitly agreed in writing.
          </p>
          <p className="font-semibold text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
            No refunds for visa refusals, admission rejections, or change of
            mind after work has started.
          </p>

          <h2>6. No Guarantee / Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Khizar Overseas:</p>
          <ul>
            <li>
              Shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages
            </li>
            <li>
              Shall not be responsible for admission/visa rejections, policy
              changes, delays, financial losses, or missed opportunities
            </li>
            <li>
              Provides information "as is" without warranty of accuracy or
              completeness
            </li>
          </ul>

          <h2>7. Privacy & Data Protection</h2>
          <p>
            We collect and process personal data (name, academics, passport,
            documents, etc.) only for providing Services. We follow reasonable
            security practices. For full details, refer to our{" "}
            <Link href="/privacy-policy" className="font-medium">
              Privacy Policy
            </Link>
            .
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            All content, templates, SOP/LOR samples, website design, logos, and
            materials are owned by Khizar Overseas. You may not copy, reproduce,
            modify, distribute, or use them commercially without written
            permission.
          </p>

          <h2>9. Indemnity</h2>
          <p>
            You agree to indemnify and hold Khizar Overseas harmless from any
            claims, losses, liabilities, or expenses (including legal fees)
            arising from your breach of these Terms, submission of false
            information, or violation of third-party rights/laws.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may suspend or terminate your access if you violate these Terms,
            engage in fraudulent activity, or for any other legitimate reason.
          </p>

          <h2>11. Force Majeure</h2>
          <p>
            We are not liable for delays or failure to perform due to events
            beyond our control (natural disasters, government actions,
            pandemics, immigration policy changes, etc.).
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may revise these Terms. The updated version will be posted here
            with a new "Last updated" date.
          </p>

          <h2>13. Governing Law & Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of competent courts in
            Hyderabad, Telangana.
          </p>

          <h2>14. Contact Us</h2>
          <p>For questions or concerns:</p>
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
