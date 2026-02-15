"use client";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { matchCountry, matchCourse, buildCourseIndex } from "@/lib/searchUtils";
import { COUNTRY_PAGE_DATA } from "@/data/countrydetail";
import { COUNTRIES } from "@/data/countries";
import { categoryData } from "@/data/coursescategory";
import { useSelector } from "react-redux";

// Normalize function (same as before)
const normalize = (str = "") => str.toLowerCase().trim().replace(/\s+/g, " ");

export default function HeroSearch() {
  const universities = useSelector((state) => state.universities.list);

  const router = useRouter();

  const courseIndex = useMemo(
    () =>
      buildCourseIndex({
        popularCourses: COUNTRY_PAGE_DATA.popularCourses || [],
        categoryData,
      }),
    [],
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const query = e.target.search.value.trim();
    if (!query) return;

    const normalizedQuery = normalize(query);

    // 1. COUNTRY
    const country = matchCountry(query, COUNTRIES);
    if (country) {
      const countryNameNorm = normalize(country.name);
      if (
        normalizedQuery === countryNameNorm ||
        normalizedQuery === countryNameNorm.replace(/\s+/g, "")
      ) {
        const slug = countryNameNorm.replace(/\s+/g, "-");
        router.push(`/all-countries/${slug}`);
      } else {
        router.push(`/all-countries?search=${encodeURIComponent(query)}`);
      }
      return;
    }

    // 2. CATEGORY (direct match)
    if (Object.keys(categoryData).includes(normalizedQuery)) {
      router.push(`/courses/${normalizedQuery}`);
      return;
    }

    // 3. COURSE (updated: courseName is now a string)
    const courseName = matchCourse(query, courseIndex);
    if (courseName) {
      const titleNorm = normalize(courseName);

      // Find matching program to get category + slug
      let foundCategory = null;
      let foundSlug = null;

      Object.entries(categoryData).forEach(([catKey, cat]) => {
        Object.values(cat.tabs || {}).forEach((level) => {
          const match = level.find(
            (item) => normalize(item.name) === titleNorm && item.slug,
          );
          if (match) {
            foundCategory = catKey;
            foundSlug = match.slug;
          }
        });
      });

      // ✅ EXACT COURSE → DETAIL PAGE
      if (foundCategory && foundSlug) {
        router.push(`/courses/${foundCategory}/${foundSlug}`);
      } else {
        // Partial / no slug → list page
        router.push(`/courses?search=${encodeURIComponent(query)}`);
      }
      return;
    }

    // 4. UNIVERSITY
    // 4. UNIVERSITY (Dynamic from Backend)
    const university =
      universities?.find((uni) => normalize(uni.name) === normalizedQuery) ||
      universities?.find((uni) =>
        normalize(uni.name).startsWith(normalizedQuery),
      ) ||
      universities?.find((uni) =>
        normalize(uni.name).includes(normalizedQuery),
      );

    if (university) {
      router.push(`/universities/${university.slug}`);
      return;
    }

    // 5. FALLBACK
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
