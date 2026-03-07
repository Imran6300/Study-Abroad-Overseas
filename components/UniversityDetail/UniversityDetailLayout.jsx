"use client";
import SimilarUniversityCard from "./SimilarUniversityCard";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MessageBox from "@/components/ui/MessageBox";

export default function UniversityDetailLayout({ uni }) {
  const universities = useSelector((state) => state.universities.list);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= NORMALIZED VALUES ================= */

  const location = `${uni.city || ""}`.trim();
  const rank = uni.qsRanking ?? "—";
  const acceptance = uni.acceptanceRate ? `${uni.acceptanceRate}%` : "Top";
  const students = uni.totalStudents ?? "—";
  const tuition = uni.tuitionFee ?? "Varies by program";
  const intake = uni.intakes?.join(", ") ?? "Fall, Spring";
  const description = uni.description ?? "";
  const image = uni.images?.[0]?.url || uni.logo?.url;

  const courses = Array.isArray(uni.courses) ? uni.courses : [];
  const admissionRequirements = uni.admissionRequirements ?? [];

  /* ================= SIMILAR UNIVERSITIES ================= */
  const router = useRouter();

  const handleApply = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/application`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const text = await res.text(); // safer than res.json()

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned an unexpected response.");
      }

      if (!res.ok) {
        if (data.redirect === "/login") {
          setStatus("error");
          setMessage("Please login to continue.");
          setTimeout(() => router.push("/login"), 1200);
          return;
        }

        if (data.redirect === "/assessment") {
          setStatus("error");
          setMessage("Please complete the assessment first.");
          setTimeout(() => router.push("/assessment"), 1200);
          return;
        }

        throw new Error(data.message || "Something went wrong.");
      }

      setStatus("success");
      setMessage("Redirecting to application...");

      setTimeout(() => {
        router.push("/application");
      }, 1200);
    } catch (error) {
      console.error(error);

      setStatus("error");
      setMessage(error.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  };

  const similarUniversities = useMemo(() => {
    return universities.filter((u) => u.slug !== uni.slug).slice(0, 3);
  }, [universities, uni.slug]);

  return (
    <section className="bg-[#0A192F] text-[#CCD6F6] min-h-screen pt-32">
      <MessageBox
        status={status}
        message={message}
        onClose={() => setStatus(null)}
      />
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* ================= HEADER ================= */}
        <header className="border-b border-[#1E3A5F] pb-6 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">{uni.name}</h1>

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#8892B0]">
            <span>{location}</span>
            <span>•</span>
            <span>⭐ {acceptance} Acceptance</span>
            <span>•</span>
            <span>Rank #{rank}</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* ================= LEFT ================= */}
          <main className="lg:col-span-2 space-y-12">
            {/* IMAGE */}
            <img
              src={image}
              alt={uni.name}
              className="w-full h-[340px] object-cover rounded-xl border border-[#1E3A5F]"
            />

            {/* OVERVIEW */}
            <section>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-[#8892B0] leading-relaxed">{description}</p>
            </section>

            {/* COURSES */}
            {courses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Popular Courses</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {courses.map((course) => (
                    <Link
                      key={course._id}
                      href={`/courses/${course.slug}`}
                      className="block bg-[#112240] border border-[#1E3A5F] rounded-lg px-4 py-4 hover:border-[#4169E1] transition hover:scale-[1.02]"
                    >
                      <h3 className="font-semibold text-[#CCD6F6]">
                        {course.title}
                      </h3>

                      <div className="text-sm text-[#8892B0] mt-1 flex gap-3">
                        <span>{course.level}</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ADMISSION */}
            {admissionRequirements.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Admission Requirements
                </h2>

                <ul className="list-disc list-inside text-[#8892B0] space-y-2">
                  {admissionRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6">
            <div className="bg-[#112240] border border-[#1E3A5F] rounded-xl p-6">
              <h3 className="font-semibold mb-4">University Facts</h3>

              <Fact label="Location" value={location} />
              <Fact label="Global Rank" value={`#${rank}`} />
              <Fact label="Students" value={students} />
              <Fact label="Tuition Fees" value={tuition} />
              <Fact label="Intake" value={intake} />
            </div>

            <div className="bg-[#112240] border border-[#1E3A5F] rounded-xl p-6">
              <h3 className="text-lg font-semibold">
                Apply to this University
              </h3>

              <p className="text-sm text-[#8892B0] mt-2">
                Get expert guidance on admissions, visas & scholarships.
              </p>
              <button
                onClick={handleApply}
                disabled={loading}
                className="mt-5 w-full bg-[#32CD32] hover:bg-[#28b428]
  disabled:opacity-60 disabled:cursor-not-allowed
  text-[#0A192F] py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Checking..." : "Apply Now"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ================= SIMILAR UNIVERSITIES ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">Similar Universities</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {similarUniversities.map((similarUni) => (
            <SimilarUniversityCard
              key={similarUni.slug}
              uni={{
                slug: similarUni.slug,
                name: similarUni.name,
                image: similarUni.images?.[0]?.url || similarUni.logo?.url,
                location: `${similarUni.city}, ${similarUni.country}`,
                rank: similarUni.qsRanking,
                desc: similarUni.description,
              }}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

/* ---------- FACT COMPONENT ---------- */

function Fact({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-[#1E3A5F] last:border-none">
      <span className="text-[#8892B0]">{label}</span>
      <span className="text-[#CCD6F6] font-medium">{value}</span>
    </div>
  );
}
