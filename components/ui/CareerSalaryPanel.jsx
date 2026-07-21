// components/ui/CareerSalaryPanel.jsx
//
// FIX (Organic Growth Audit, Step 6): "Publish the data you're already
// collecting." The Course schema already has salariesInCountries,
// salaryExpectations, careerProspects, popularJobRoles, and scholarships —
// all AI-enriched, per-course, real data — but the course detail page's
// "careers" tab was rendering hardcoded placeholder copy instead:
//
//   <p>Average starting salary (US/Europe)</p>
//   <p>Highest salaries in USA, UK, Switzerland, Australia, Singapore</p>
//
// That text was IDENTICAL on every course page regardless of which course
// it was, and course.salaryExpectations / course.salariesInCountries were
// never read anywhere in the UI. Same gap on the new university×course
// combo page from Step 5 — the fields were fetched but not fully
// surfaced.
//
// This is one shared, entity-agnostic component so both pages render the
// same real data the same way instead of two more copies to keep in sync.
// Every field is optional and independently guarded — a course missing
// salariesInCountries still renders fine with whatever fields it does have.
//
// `theme` accounts for the two pages using this component having opposite
// color schemes: the course detail page (course.jsx) is dark, the new
// university×course combo page (UniversityCourseClient.jsx) is light. A
// prop is simpler and less error-prone here than shipping two near-
// identical components that inevitably drift apart.

const THEME = {
  dark: {
    body: "text-gray-300",
    heading: "text-white",
    subheading: "text-gray-400",
    bullet: "bg-emerald-500",
    salaryFigure: "text-emerald-400",
    small: "text-gray-300",
    empty: "text-gray-400",
  },
  light: {
    body: "text-gray-600",
    heading: "text-gray-900",
    subheading: "text-gray-500",
    bullet: "bg-blue-500",
    salaryFigure: "text-green-600",
    small: "text-gray-600",
    empty: "text-gray-500",
  },
};

export default function CareerSalaryPanel({ course = {}, theme = "dark" }) {
  const c = THEME[theme] || THEME.dark;

  const hasAnyData =
    course.careerProspects ||
    course.popularJobRoles?.length > 0 ||
    course.avgSalary ||
    course.salaryExpectations ||
    course.salariesInCountries ||
    course.scholarships;

  if (!hasAnyData) return null;

  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Career prospects + job roles */}
      <div>
        {course.careerProspects && (
          <p className={`${c.body} leading-relaxed mb-6`}>
            {course.careerProspects}
          </p>
        )}

        {course.popularJobRoles?.length > 0 && (
          <>
            <h3 className={`text-2xl font-bold mb-6 ${c.heading}`}>
              Popular Job Roles
            </h3>
            <ul className="space-y-4">
              {course.popularJobRoles.slice(0, 6).map((role, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-3 text-lg ${c.body}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${c.bullet} shrink-0`}
                  />
                  {role}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Salary data */}
      <div>
        <h3 className={`text-2xl font-bold mb-6 ${c.heading}`}>
          Salary Expectations
        </h3>

        {course.avgSalary && (
          <p className={`text-4xl font-bold mb-2 ${c.salaryFigure}`}>
            ${course.avgSalary}
          </p>
        )}

        {course.salaryExpectations && (
          <p className={`${c.body} leading-relaxed`}>
            {course.salaryExpectations}
          </p>
        )}

        {course.salariesInCountries && (
          <div className="mt-6">
            <h4
              className={`text-sm font-semibold uppercase tracking-wide mb-2 ${c.subheading}`}
            >
              Salary by Destination
            </h4>
            <p className={`text-sm leading-relaxed ${c.small}`}>
              {course.salariesInCountries}
            </p>
          </div>
        )}

        {course.scholarships && (
          <div className="mt-6">
            <h4
              className={`text-sm font-semibold uppercase tracking-wide mb-2 ${c.subheading}`}
            >
              Scholarships
            </h4>
            <p className={`text-sm leading-relaxed ${c.small}`}>
              {course.scholarships}
            </p>
          </div>
        )}

        {!course.avgSalary &&
          !course.salaryExpectations &&
          !course.salariesInCountries && (
            <p className={`text-sm ${c.empty}`}>
              Salary data for this program is being verified — contact our
              counselors for current figures.
            </p>
          )}
      </div>
    </div>
  );
}
