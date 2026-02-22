"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchCourses } from "@/store/courseSlice";
import { matchCountry } from "@/lib/searchUtils";

const normalize = (str = "") => str.toLowerCase().trim().replace(/\s+/g, " ");

export function useHeroSearch() {
  const [countries, setCountries] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const { courses } = useSelector((state) => state.courses);
  const universities = useSelector((state) => state.universities.list);

  useEffect(() => {
    if (!courses || courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);
  useEffect(() => {
    async function fetchCountries() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${baseUrl}/api/countries`);

        if (!res.ok) return;

        const data = await res.json();
        setCountries(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

    fetchCountries();
  }, []);

  const handleSearch = (query) => {
    if (!query?.trim()) return;

    const normalizedQuery = normalize(query);

    // 1️⃣ COUNTRY
    const country = matchCountry(query, countries);
    if (country) {
      router.push(`/all-countries/${country.slug}`);
      return;
    }

    // 2️⃣ COURSE (Dynamic from API)
    const course =
      courses?.find((c) => normalize(c.title) === normalizedQuery) ||
      courses?.find((c) => normalize(c.title).startsWith(normalizedQuery)) ||
      courses?.find((c) => normalize(c.title).includes(normalizedQuery));

    if (course) {
      router.push(`/courses/${course.slug}`);
      return;
    }

    // 3️⃣ UNIVERSITY
    const university =
      universities?.find((uni) => normalize(uni.name) === normalizedQuery) ||
      universities?.find((uni) =>
        normalize(uni.name).includes(normalizedQuery),
      );

    if (university) {
      router.push(`/universities/${university.slug}`);
      return;
    }

    // 4️⃣ FALLBACK
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return { handleSearch };
}
