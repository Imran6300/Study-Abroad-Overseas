"use client";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { matchCountry, matchCourse, buildCourseIndex } from "@/lib/searchUtils";
import { useSelector, useDispatch } from "react-redux";

import { useState, useEffect } from "react";
import { fetchCourses } from "@/store/courseSlice";

// Normalize function (same as before)
const normalize = (str = "") => str.toLowerCase().trim().replace(/\s+/g, " ");

export default function HeroSearch() {
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);

  // useEffect(() => {
  //   if (!courses || courses.length === 0) {
  //     dispatch(fetchCourses());
  //   }
  // }, []);
  // useEffect(() => {
  //   async function fetchCountries() {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries`,
  //       );

  //       if (!res.ok) return;

  //       const data = await res.json();
  //       setCountries(data.data);
  //     } catch (error) {
  //       console.error("Error fetching countries:", error);
  //     }
  //   }

  //   fetchCountries();
  // }, []);

  const universities = useSelector((state) => state.universities.list);

  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = e.target.search.value.trim();
    if (!query) return;

    const normalizedQuery = normalize(query);

    // 1️⃣ COUNTRY
    const country = matchCountry(query, countries);
    if (country) {
      router.push(`/all-countries/${country.slug}`);
      return;
    }

    // 2️⃣ COURSE
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
