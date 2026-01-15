import SimilarUniversityCard from "./SimilarUniversityCard";
import { universityItems } from "@/components/Home/Universities/TopUniversitiesData";

export default function UniversityDetailLayout({ uni }) {
  // ✅ SAFE FALLBACKS
  const courses = uni.courses ?? [
    "Computer Science",
    "Engineering",
    "Business Administration",
    "Data Science",
  ];

  const exams = uni.exams ?? ["IELTS", "TOEFL"];
  const intake = uni.intake ?? "Fall, Spring";
  const tuition = uni.tuition ?? "Varies by program";

  return (
    // pt-32 FIXES NAVBAR OVERLAP
    <section className="bg-[#0A192F] text-[#CCD6F6] min-h-screen pt-32">
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* ================= HEADER ================= */}
        <header className="border-b border-[#1E3A5F] pb-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#CCD6F6]">
            {uni.name}
          </h1>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#8892B0]">
            <span>{uni.location}</span>
            <span>•</span>
            <span>⭐ {uni.acceptance ?? "Top"} Acceptance</span>
            <span>•</span>
            <span>Rank #{uni.rank}</span>
          </div>
        </header>

        {/* ================= MAIN GRID ================= */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ================= LEFT CONTENT ================= */}
          <main className="lg:col-span-2 space-y-12">
            {/* IMAGE */}
            <img
              src={uni.image}
              alt={uni.name}
              className="w-full h-[340px] object-cover rounded-xl border border-[#1E3A5F]"
            />

            {/* OVERVIEW */}
            <section>
              <h2 className="text-xl font-semibold text-[#CCD6F6] mb-3">
                Overview
              </h2>
              <p className="text-[#8892B0] leading-relaxed">{uni.desc}</p>
            </section>

            {/* COURSES */}
            <section>
              <h2 className="text-xl font-semibold text-[#CCD6F6] mb-4">
                Popular Courses
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course}
                    className="bg-[#112240] border border-[#1E3A5F] rounded-lg px-4 py-3 hover:border-[#4169E1] transition"
                  >
                    {course}
                  </div>
                ))}
              </div>
            </section>

            {/* ADMISSION */}
            <section>
              <h2 className="text-xl font-semibold text-[#CCD6F6] mb-3">
                Admission Requirements
              </h2>

              <ul className="list-disc list-inside text-[#8892B0] space-y-2">
                <li>Accepted Exams: {exams.join(", ")}</li>
                <li>Intake Periods: {intake}</li>
                <li>Program-specific academic requirements apply</li>
              </ul>
            </section>
          </main>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6">
            {/* FACTS */}
            <div className="bg-[#112240] border border-[#1E3A5F] rounded-xl p-6">
              <h3 className="font-semibold text-[#CCD6F6] mb-4">
                University Facts
              </h3>

              <Fact label="Location" value={uni.location} />
              <Fact label="Global Rank" value={`#${uni.rank}`} />
              <Fact label="Students" value={uni.students ?? "—"} />
              <Fact label="Tuition Fees" value={tuition} />
              <Fact label="Intake" value={intake} />
            </div>

            {/* APPLY */}
            <div className="bg-[#112240] border border-[#1E3A5F] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#CCD6F6]">
                Apply to this University
              </h3>

              <p className="text-sm text-[#8892B0] mt-2">
                Get expert guidance on admissions, visas & scholarships.
              </p>

              <button
                className="mt-5 w-full bg-[#32CD32] hover:bg-[#28b428]
                text-[#0A192F] py-3 rounded-lg font-semibold transition"
              >
                Apply Now
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ================= SIMILAR UNIVERSITIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-[#CCD6F6] mb-6">
          Similar Universities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {universityItems
            .filter((u) => u.slug !== uni.slug)
            .slice(0, 3)
            .map((similarUni) => (
              <SimilarUniversityCard key={similarUni.slug} uni={similarUni} />
            ))}
        </div>
      </section>
    </section>
  );
}

/* ---------- SMALL COMPONENT ---------- */

function Fact({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-[#1E3A5F] last:border-none">
      <span className="text-[#8892B0]">{label}</span>
      <span className="text-[#CCD6F6] font-medium">{value}</span>
    </div>
  );
}
