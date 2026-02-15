"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { matchCountry, matchCourse, buildCourseIndex } from "@/lib/searchUtils";
import { COUNTRY_PAGE_DATA } from "@/data/countrydetail";
import { COUNTRIES } from "@/data/countries";
import { categoryData } from "@/data/coursescategory";

const popularCourses = COUNTRY_PAGE_DATA.popularCourses || [];

const normalize = (str = "") => str.toLowerCase().trim().replace(/\s+/g, " ");

export function useHeroSearch() {
  const router = useRouter();

  const universities = useSelector((state) => state.universities.list);

  const courseIndex = useMemo(
    () =>
      buildCourseIndex({
        popularCourses,
        categoryData,
      }),
    [],
  );

  const handleSearch = (query) => {
    if (!query?.trim()) return;

    const normalizedQuery = normalize(query);

    // 1. COUNTRY
    const country = matchCountry(query, COUNTRIES);
    if (country) {
      const nameNorm = normalize(country.name);
      if (
        normalizedQuery === nameNorm ||
        normalizedQuery === nameNorm.replace(/\s+/g, "")
      ) {
        router.push(`/all-countries/${nameNorm.replace(/\s+/g, "-")}`);
      } else {
        router.push(`/all-countries?search=${encodeURIComponent(query)}`);
      }
      return;
    }

    // 2. CATEGORY
    if (Object.keys(categoryData).includes(normalizedQuery)) {
      router.push(`/courses/${normalizedQuery}`);
      return;
    }

    // 3. COURSE
    const courseName = matchCourse(query, courseIndex);
    if (courseName) {
      router.push(`/courses?search=${encodeURIComponent(query)}`);
      return;
    }

    // 4. UNIVERSITY (Dynamic from Redux)
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

  return { handleSearch };
}
