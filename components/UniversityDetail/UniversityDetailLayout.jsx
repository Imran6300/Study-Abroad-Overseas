"use client";
import SimilarUniversityCard from "./SimilarUniversityCard";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MessageBox from "@/components/ui/MessageBox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { useEffect } from "react";
import * as gtag from "@/lib/gtag";

const getOptimizedUrl = (url, width) => {
  if (!url) return "";
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stopColor="#333" offset="20%" />
        <stop stopColor="#444" offset="50%" />
        <stop stopColor="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
  </svg>
`;
const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function UniversityDetailLayout({ uni, similarUniversities }) {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const similar = similarUniversities;

  useEffect(() => {
    gtag.event({
      action: "university_view",
      category: "university",
      label: uni.name,
    });
  }, [uni.name]);

  /* ================= NORMALIZED VALUES ================= */
  const location = `${uni.city || ""}`.trim();
  const rank = uni.qsRanking ?? "—";
  const acceptance = uni.acceptanceRate ? `${uni.acceptanceRate}%` : "Top";
  const students = uni.totalStudents ?? "—";
  const tuition = uni.tuitionFee ?? "Varies by program";
  const intake = uni.intakes?.join(", ") ?? "Fall, Spring";
  const description = uni.description ?? "";

  const images =
    Array.isArray(uni.images) && uni.images.length > 0
      ? uni.images.map((img) => img.url)
      : [];

  const fallbackImage =
    getOptimizedUrl(uni.logo?.url, 800) || "/images/default-university.jpg";

  const courses = Array.isArray(uni.courses) ? uni.courses : [];
  const admissionRequirements = uni.admissionRequirements ?? [];

  const router = useRouter();

  const handleApply = async (university) => {
    try {
      gtag.event({
        action: "apply_now_click",
        category: "conversion",
        label: university,
      });
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications/check-access`,
        { method: "GET", credentials: "include" },
      );

      const text = await res.text();
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
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("Redirecting to application...");
      setTimeout(
        () => router.push(`/application?university=${uni.slug}`),
        1200,
      );
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error.message || "Unable to process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#0A192F] text-[#CCD6F6] min-h-screen pt-20 md:pt-32">
      <MessageBox
        status={status}
        message={message}
        onClose={() => setStatus(null)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* ================= HEADER ================= */}
        <header className="border-b border-[#1E3A5F] pb-6 mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            {uni.name}
          </h1>
          <p>
            <Link
              href={`/all-countries/${uni.country?.slug}`}
              className="text-blue-400 underline"
            >
              Study in {uni.country?.name}
            </Link>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-[#8892B0]">
            <span>{location}</span>
            <span className="hidden sm:inline">•</span>
            <span>⭐ {acceptance} Acceptance</span>
            <span className="hidden sm:inline">•</span>
            <span>Rank #{rank}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* ================= LEFT - MAIN CONTENT ================= */}
          <main className="lg:col-span-2 space-y-8 md:space-y-10 lg:space-y-12">
            {/* ================= RESPONSIVE IMAGE CAROUSEL ================= */}
            <div className="rounded-2xl border border-[#1E3A5F] overflow-hidden bg-black shadow-2xl">
              {images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  loop={images.length > 1}
                  className="w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[420px]"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full h-full">
                        <Image
                          src={getOptimizedUrl(img, 800)}
                          alt={`slide-${index}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer(700, 475),
                          )}`}
                          priority={index === 0} // ✅ ADD THIS
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="relative w-full h-[220px] sm:h-[300px]">
                  <Image
                    src={fallbackImage}
                    alt={uni.name}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475),
                    )}`}
                    priority
                  />
                </div>
              )}
            </div>

            {/* OVERVIEW */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-[#8892B0] leading-relaxed text-[15px] md:text-base">
                {description}
              </p>
            </section>

            {/* COURSES */}
            {courses.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Popular Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {courses.map((course) => (
                    <Link
                      key={course._id}
                      href={`/courses/${course.slug}`}
                      className="block bg-[#112240] border border-[#1E3A5F] rounded-xl p-5 hover:border-[#4169E1] transition-all hover:scale-[1.02]"
                    >
                      <h3 className="font-semibold text-[#CCD6F6] text-lg break-words">
                        {course.title}
                      </h3>
                      <div className="text-sm text-[#8892B0] mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        <span>{course.level}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{course.duration}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ADMISSION REQUIREMENTS */}
            {admissionRequirements.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  Admission Requirements
                </h2>
                <ul className="list-disc list-inside text-[#8892B0] space-y-2.5 text-[15px] md:text-base">
                  {admissionRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-6 lg:space-y-8 mt-10 lg:mt-0">
            <div className="bg-[#112240] border border-[#1E3A5F] rounded-2xl p-6">
              <h3 className="font-semibold mb-5 text-lg">University Facts</h3>
              <Fact label="Location" value={location} />
              <Fact label="Global Rank" value={`#${rank}`} />
              <Fact label="Students" value={students} />
              <Fact label="Tuition Fees" value={tuition} />
              <Fact label="Intake" value={intake} />
            </div>

            <div className="bg-[#112240] border border-[#1E3A5F] rounded-2xl p-6 lg:sticky lg:top-8">
              <h3 className="text-lg font-semibold mb-2">
                Apply to this University
              </h3>
              <p className="text-sm text-[#8892B0] mt-3 leading-relaxed">
                Get expert guidance on admissions, visas & scholarships.
              </p>
              <button
                onClick={() => handleApply(uni.name)}
                disabled={loading}
                className="mt-6 w-full bg-[#32CD32] hover:bg-[#28b428] 
                  disabled:opacity-60 disabled:cursor-not-allowed
                  text-[#0A192F] py-3.5 rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
              >
                {loading ? "Checking..." : "Apply Now"}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ================= SIMILAR UNIVERSITIES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-20">
        <h2 className="text-2xl font-bold mb-6 px-2">Similar Universities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {similar && similar.length > 0 ? (
            similar.map((similarUni) => (
              <SimilarUniversityCard
                key={similarUni.slug}
                uni={{
                  slug: similarUni.slug,
                  name: similarUni.name,
                  image:
                    similarUni.images?.[0]?.url ||
                    similarUni.logo?.url ||
                    "/images/default-university.jpg",
                  location: `${similarUni.city}, ${similarUni.country?.name}`,
                }}
              />
            ))
          ) : (
            <p className="text-[#8892B0] text-sm px-2">
              No similar universities found.
            </p>
          )}
        </div>
      </section>
    </section>
  );
}

function Fact({ label, value }) {
  return (
    <div className="flex justify-between items-start text-sm py-3 border-b border-[#1E3A5F] last:border-none gap-4">
      <span className="text-[#8892B0] whitespace-nowrap">{label}</span>

      <span className="text-[#CCD6F6] text-sm font-normal text-right max-w-[60%] break-words leading-relaxed">
        {value}
      </span>
    </div>
  );
}
