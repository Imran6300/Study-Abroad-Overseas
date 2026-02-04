"use client";

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
import { categoryData } from "@/data/coursescategory"; // ← your main data
import { universityItems } from "@/data/universitiesData";
import { universitiesByCategory } from "@/data/universitybycatogery";

// Optional: keep this if you have popular courses elsewhere
const popularCourses = COUNTRY_PAGE_DATA.popularCourses || [];

const normalize = (str = "") =>
  str.toLowerCase().trim().replace(/\s+/g, " ");

export function useHeroSearch() {
  const router = useRouter();

  const courseIndex = useMemo(
    () =>
      buildCourseIndex({
        popularCourses, // if you still have this array
        categoryData,   // ← this now provides all courses
      }),
    [] // dependencies empty since data is static
  );

const handleSearch = (query) => {
  if (!query?.trim()) return;

  const normalizedQuery = normalize(query);

  // 1. COUNTRY
  const country = matchCountry(query, COUNTRIES);
  if (country) {
    const nameNorm = normalize(country.name);
    if (normalizedQuery === nameNorm || normalizedQuery === nameNorm.replace(/\s+/g, "")) {
      router.push(`/all-countries/${nameNorm.replace(/\s+/g, "-")}`);
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

  // 3. COURSE (now course is a string name or undefined)
  const courseName = matchCourse(query, courseIndex);  // renamed for clarity
  if (courseName) {
    const titleNorm = normalize(courseName);  // courseName is string

    // Try to find category + slug for direct detail page
    let foundCategory = null;
    let foundSlug = null;

    Object.entries(categoryData).forEach(([catKey, cat]) => {
      Object.values(cat.tabs || {}).forEach((level) => {
        const match = level.find(
          (item) => normalize(item.name) === titleNorm && item.slug
        );
        if (match) {
          foundCategory = catKey;
          foundSlug = match.slug;
        }
      });
    });

    if (foundCategory && foundSlug) {
      // Exact match → go to detail page
      router.push(`/courses/${foundCategory}/${foundSlug}`);
    } else {
      // No slug found → fallback to search
      router.push(`/courses?search=${encodeURIComponent(query)}`);
    }
    return;
  }

  // 4. UNIVERSITY
  const university = matchUniversity(query, universityItems, universitiesByCategory);
  if (university) {
    router.push(`/universities?search=${encodeURIComponent(query)}`);
    return;
  }

  // 5. FALLBACK
  router.push(`/search?q=${encodeURIComponent(query)}`);
};

  return { handleSearch };
}