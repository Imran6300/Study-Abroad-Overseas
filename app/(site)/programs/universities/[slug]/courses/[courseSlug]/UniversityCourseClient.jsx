// app/(site)/programs/universities/[slug]/courses/[courseSlug]/UniversityCourseClient.jsx
//
// Mirrors the structure and visual language of
// study-combo/[combo]/ComboClient.jsx (course × country), adapted for the
// university × course pair. What makes each of these pages unique content
// (not templated/duplicate in Google's eyes) is:
//   - university-specific facts (qsRanking, acceptanceRate, tuitionFee,
//     intakes, city) crossed with course-specific facts (fees, duration,
//     entry requirements) — a combination that's different for every pair
//   - a combo-specific FAQ block combining both entities' FAQs

import Link from "next/link";
import Image from "next/image";
import CareerSalaryPanel from "@/components/ui/CareerSalaryPanel";

function formatList(items = []) {
  return items.filter(Boolean);
}

export default function UniversityCourseClient({
  university = {},
  course = {},
  offersThisCourse,
}) {
  const courseTitle = course.title || "This Program";
  const uniName = university.name || "This University";
  const countryName = university.country?.name || "";

  const faqs = [
    {
      q: `What is the acceptance rate at ${uniName}?`,
      a:
        typeof university.acceptanceRate === "number"
          ? `${uniName} has an estimated acceptance rate of around ${university.acceptanceRate}%. Admission for ${courseTitle} depends on your academic profile, test scores, and application strength.`
          : `Acceptance rates vary by program at ${uniName}. Our counselors can assess your profile against ${courseTitle}'s typical admission requirements.`,
    },
    {
      q: `How much does ${courseTitle} cost at ${uniName}?`,
      a: course.fees
        ? `Tuition fees for ${courseTitle} typically start around ${course.fees}${university.tuitionFee ? `, and ${uniName}'s overall tuition is ${university.tuitionFee}` : ""}. Talk to our counselors for a personalised cost breakdown.`
        : university.tuitionFee
          ? `${uniName}'s tuition is ${university.tuitionFee}. Exact fees for ${courseTitle} vary — our counselors can get you the program-specific figure.`
          : `Tuition fees for ${courseTitle} at ${uniName} vary by intake and student profile. Our counselors can give you a personalised cost breakdown.`,
    },
    {
      q: `When can I apply to ${courseTitle} at ${uniName}?`,
      a:
        university.intakes?.length > 0
          ? `${uniName} typically has intakes in ${university.intakes.join(", ")}. Application deadlines vary by intake — our counselors can help you plan your timeline.`
          : `Intake dates for ${courseTitle} at ${uniName} vary — our counselors can confirm the next available intake and deadline for you.`,
    },
  ];

  const entryRequirements = formatList(
    (course.entryRequirements || []).map((r) => r?.title).filter(Boolean),
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/programs/universities" className="hover:text-blue-600">
          Universities
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/programs/universities/${university.slug}`}
          className="hover:text-blue-600"
        >
          {uniName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{courseTitle}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <div className="flex items-start gap-4">
          {university.logo?.url && (
            <Image
              src={university.logo.url}
              alt={uniName}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-lg object-contain border border-gray-200 bg-white p-1"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {courseTitle} at {uniName}
            </h1>
            <p className="mt-1 text-gray-500">
              {[university.city, countryName].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-gray-600">
          {course.overviewDescription ||
            course.subtitle ||
            `Explore fees, admission requirements, and intake dates for ${courseTitle} at ${uniName}.`}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {course.duration && (
            <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              Duration: {course.duration}
            </span>
          )}
          {course.fees && (
            <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700">
              Fees: {course.fees}
            </span>
          )}
          {typeof university.qsRanking === "number" && (
            <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              QS Ranking: #{university.qsRanking}
            </span>
          )}
          {typeof university.acceptanceRate === "number" && (
            <span className="rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
              Acceptance Rate: {university.acceptanceRate}%
            </span>
          )}
        </div>

        {offersThisCourse === false && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            This program's current availability at {uniName} is being
            re-verified — contact our counselors to confirm the latest intake
            before applying.
          </p>
        )}
      </header>

      {/* Two-column facts: course + university */}
      <div className="mb-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            About {courseTitle}
          </h2>
          {(course.overviewDescription || course.subtitle) && (
            <p className="mb-3 text-gray-600">
              {course.overviewDescription || course.subtitle}
            </p>
          )}
          {entryRequirements.length > 0 && (
            <>
              <h3 className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Entry Requirements
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-600">
                {entryRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            About {uniName}
          </h2>
          <ul className="space-y-2 text-gray-600">
            {university.city && (
              <li>
                <span className="font-medium text-gray-900">Location:</span>{" "}
                {university.city}
                {countryName ? `, ${countryName}` : ""}
              </li>
            )}
            {university.tuitionFee && (
              <li>
                <span className="font-medium text-gray-900">
                  Overall Tuition:
                </span>{" "}
                {university.tuitionFee}
              </li>
            )}
            {university.intakes?.length > 0 && (
              <li>
                <span className="font-medium text-gray-900">Intakes:</span>{" "}
                {university.intakes.join(", ")}
              </li>
            )}
          </ul>
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Visit official university website →
            </a>
          )}
        </section>
      </div>

      {/* Career & Salary — FIX (Step 6): previously this page only showed
          careerProspects + popularJobRoles inline in the About column and
          never surfaced avgSalary, salaryExpectations, salariesInCountries,
          or scholarships at all, even though comboPageController.
          getUniversityCourse already fetches all of them on the `course`
          object. Shared panel with course.jsx (course.jsx uses theme="dark",
          this page is light so theme="light"). */}
      {(course.careerProspects ||
        course.popularJobRoles?.length > 0 ||
        course.avgSalary ||
        course.salaryExpectations ||
        course.salariesInCountries ||
        course.scholarships) && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Career Outcomes & Salary for {courseTitle}
          </h2>
          <div className="rounded-2xl border border-gray-200 p-6 sm:p-8">
            <CareerSalaryPanel course={course} theme="light" />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-4">
              <p className="font-medium text-gray-900">{item.q}</p>
              <p className="mt-1 text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">
          Ready to apply for {courseTitle} at {uniName}?
        </h2>
        <p className="mt-2 text-blue-100">
          Get free, personalised guidance from Khizar Overseas counselors.
        </p>
        <Link
          href="/assessment"
          className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          Get Free Counselling
        </Link>
      </section>
    </main>
  );
}
