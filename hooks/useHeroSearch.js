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
import { coursesData } from "@/data/coursesData";
import { categoryData } from "@/data/coursescategory";
import { universityItems } from "@/data/universitiesData";
import { universitiesByCategory } from "@/data/universitybycatogery";

const normalize = (str = "") =>
  str.toLowerCase().trim().replace(/\s+/g, " ");

export function useHeroSearch() {
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

  const handleSearch = (query) => {
    if (!query) return;

    /* COUNTRY */
    const country = matchCountry(query, COUNTRIES);
    if (country) {
      const q = normalize(query);
      const name = normalize(country.name);

      if (q === name || q === name.replace(/\s+/g, "")) {
        router.push(`/all-countries/${name.replace(/\s+/g, "-")}`);
      } else {
        router.push(`/all-countries?search=${encodeURIComponent(query)}`);
      }
      return;
    }

    /* CATEGORY */
    const queryNorm = normalize(query);
    if (Object.keys(categoryData).includes(queryNorm)) {
      router.push(`/courses/${queryNorm}`);
      return;
    }

    /* COURSE */
    const course = matchCourse(query, courseIndex);
    if (course) {
      const title = normalize(course.title);
      if (queryNorm === title || queryNorm === title.replace(/\s+/g, "")) {
        router.push(`/courses/${title.replace(/\s+/g, "-")}`);
      } else {
        router.push(`/courses?search=${encodeURIComponent(query)}`);
      }
      return;
    }

    /* UNIVERSITY */
    const university = matchUniversity(
      query,
      universityItems,
      universitiesByCategory,
    );

    if (university) {
      router.push(`/universities?search=${encodeURIComponent(query)}`);
      return;
    }

    /* FALLBACK */
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return { handleSearch };
}
