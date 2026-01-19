"use client";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  matchCountry,
  matchCourse,
  matchUniversity,
  buildCourseIndex,
} from "@/lib/searchUtils";
import { COUNTRY_PAGE_DATA } from "@/data/countrydetail";
import { COUNTRIES } from "@/data/countries";
import { coursesData } from "@/data/coursesData";
import { categoryData } from "@/data/coursescategory";
import { universityItems } from "@/data/universitiesData";
import { universitiesByCategory } from "@/data/universitybycatogery";
const normalize = (str = "") => str.toLowerCase().trim().replace(/\s+/g, " ");

export default function HeroSearch() {
  const router = useRouter();

  const courseIndex = useMemo(
    () =>
      buildCourseIndex({
        coursesData,
        popularCourses: COUNTRY_PAGE_DATA.popularCourses,
        categoryData,
      }),
    [],
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const query = e.target.search.value.trim();
    if (!query) return;

    /* ================= COUNTRY (OPTION A – SMART UX) ================= */
    const country = matchCountry(query, COUNTRIES);

    if (country) {
      const queryNorm = query.toLowerCase().trim();
      const countryNameNorm = country.name.toLowerCase();

      // ✅ Exact country → detail page
      if (
        queryNorm === countryNameNorm ||
        queryNorm === countryNameNorm.replace(/\s+/g, "")
      ) {
        const slug = country.name.toLowerCase().replace(/\s+/g, "-");
        router.push(`/all-countries/${slug}`);
        return;
      }

      // 🔍 Partial / descriptive → list page
      router.push(`/all-countries?search=${encodeURIComponent(query)}`);
      return;
    }

    /* ================= COURSE CATEGORY ================= */
    const queryNorm = normalize(query);

    // ✅ CATEGORY → CATEGORY PAGE
    if (Object.keys(categoryData).includes(queryNorm)) {
      router.push(`/courses/${queryNorm}`);
      return;
    }

    /* ================= COURSE TITLE ================= */
    const course = matchCourse(query, courseIndex);
    if (course) {
      const courseTitleNorm = course.title.toLowerCase();

      // ✅ EXACT COURSE → DETAIL PAGE
      if (
        queryNorm === courseTitleNorm ||
        queryNorm === courseTitleNorm.replace(/\s+/g, "")
      ) {
        const slug = courseTitleNorm.replace(/\s+/g, "-");
        router.push(`/courses/${slug}`);
        return;
      }

      // 🔍 PARTIAL → COURSE LIST
      router.push(`/courses?search=${encodeURIComponent(query)}`);
      return;
    }

    /* ================= UNIVERSITY ================= */
    const university = matchUniversity(
      query,
      universityItems,
      universitiesByCategory,
    );

    if (university) {
      router.push(`/universities?search=${encodeURIComponent(query)}`);
      return;
    }

    /* ================= FALLBACK ================= */
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="
        w-full max-w-[700px] flex flex-col gap-[6px]
        relative z-[1] mx-auto px-[10px]
      "
    >
      <label
        htmlFor="search"
        className="text-[16px] font-medium text-black ml-[4px]"
      >
        <i>Find your dream course</i>
      </label>

      <div
        className="
          flex h-[60px] w-[120%]
          max-[480px]:h-[45px]
        "
      >
        <input
          id="search"
          name="search"
          type="text"
          required
          placeholder="Search country, course, or university"
          className="
            flex-1 min-w-0 h-full pl-[15px] text-[1.25rem]
            outline-none border-2 border-[#32cd32] border-r-0
            rounded-l-[10px] cursor-text relative z-[2]
            max-[480px]:text-[14px]
          "
        />

        <button
          type="submit"
          className="
            flex-shrink-0 w-[60px] h-full rounded-r-[10px]
            bg-[#32cd32] flex items-center justify-center
            cursor-pointer transition-colors duration-300
            hover:bg-[#28a428] relative z-[2]
            max-[480px]:w-[50px]
          "
        >
          <div className="text-white text-[1.6rem] pointer-events-none">
            <IoSearch />
          </div>
        </button>
      </div>
    </form>
  );
}
