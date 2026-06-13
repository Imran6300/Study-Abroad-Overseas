// app/(site)/study-combo/[combo]/ComboClient.jsx
//
// Renders the course x country combo page. The content that makes each
// of these pages unique (not templated/duplicate) is:
//   - the cross-referenced "universities" list (universitiesInCountry),
//     which is DIFFERENT for every course+country pair
//   - country-specific facts (visaSuccessRate, scholarships, eligibility)
//   - course-specific facts (fees, duration, entryRequirements, career)
//   - a combo-specific FAQ block combining both

import Link from "next/link";
import Image from "next/image";

function formatList(items = []) {
  return items.filter(Boolean);
}

export default function ComboClient({
  course = {},
  country = {},
  universities = [],
  combo,
}) {
  const courseTitle = course.title || "This Program";
  const countryName = country.name || "this country";

  const faqs = [
    {
      q: `What is the visa success rate for ${countryName}?`,
      a:
        typeof country.visaSuccessRate === "number"
          ? `${countryName} currently has an estimated student visa success rate of around ${country.visaSuccessRate}% for Indian applicants${
              country.visaSuccessRateEstimated ? " (estimated)" : ""
            }. Working with experienced counselors and submitting a complete application improves your chances.`
          : `Visa approval depends on your profile, financials, and the strength of your application. Our counselors at Khizar Overseas help you prepare a strong, complete application for ${countryName}.`,
    },
    {
      q: `How much does it cost to study ${courseTitle} in ${countryName}?`,
      a: course.fees
        ? `Tuition fees for ${courseTitle} typically start around ${course.fees}. Actual costs vary by university and city — talk to our counselors for a personalised cost breakdown for ${countryName}.`
        : `Tuition fees for ${courseTitle} vary by university and city in ${countryName}. Our counselors can give you a personalised cost breakdown based on the universities you're interested in.`,
    },
    {
      q: `Which universities in ${countryName} offer ${courseTitle}?`,
      a:
        universities.length > 0
          ? `${universities.length} of our partner universities in ${countryName} offer ${courseTitle}, including ${universities
              .slice(0, 3)
              .map((u) => u.name)
              .join(
                ", ",
              )}${universities.length > 3 ? " and others" : ""}. See the full list below.`
          : `We're continuously adding partner universities in ${countryName} for ${courseTitle}. Contact our counselors for the latest options and intake deadlines.`,
    },
  ];

  const entryRequirements = formatList(
    (course.entryRequirements || []).map((r) => r?.title).filter(Boolean),
  );
  const scholarships = formatList(country.scholarships);
  const eligibilityRequirements = formatList(country.eligibilityRequirements);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/study-in-${country.slug}`}
          className="hover:text-blue-600"
        >
          Study in {countryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{courseTitle}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Study {courseTitle} in {countryName}
        </h1>
        <p className="mt-3 max-w-3xl text-gray-600">
          {course.overviewDescription ||
            course.subtitle ||
            `Explore top universities, fees, eligibility, and visa guidance for pursuing ${courseTitle} in ${countryName}.`}
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
          {typeof country.visaSuccessRate === "number" && (
            <span className="rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700">
              {countryName} Visa Success Rate: {country.visaSuccessRate}%
              {country.visaSuccessRateEstimated ? " (est.)" : ""}
            </span>
          )}
          {course.avgSalary && (
            <span className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
              Avg. Salary: {course.avgSalary}
            </span>
          )}
        </div>
      </header>

      {/* Universities offering this course in this country — the unique cross-reference */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Universities offering {courseTitle} in {countryName}
        </h2>

        {universities.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {universities.map((uni) => (
              <Link
                key={uni.slug}
                href={`/programs/universities/${uni.slug}`}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:shadow-sm"
              >
                {uni.logo?.url ? (
                  <Image
                    src={uni.logo.url}
                    alt={uni.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-contain"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-400">
                    {uni.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {uni.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {[uni.city, uni.qsRanking ? `QS #${uni.qsRanking}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
            We're adding partner universities for {courseTitle} in {countryName}
            . Contact us for personalised recommendations.
          </p>
        )}
      </section>

      {/* Two-column facts: course + country */}
      <div className="mb-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            About {courseTitle}
          </h2>
          {course.careerProspects && (
            <p className="mb-3 text-gray-600">{course.careerProspects}</p>
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
            Studying in {countryName}
          </h2>
          {eligibilityRequirements.length > 0 && (
            <>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Eligibility
              </h3>
              <ul className="mb-4 list-inside list-disc space-y-1 text-gray-600">
                {eligibilityRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </>
          )}
          {scholarships.length > 0 && (
            <>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Scholarships
              </h3>
              <ul className="list-inside list-disc space-y-1 text-gray-600">
                {scholarships.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

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
          Ready to study {courseTitle} in {countryName}?
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
