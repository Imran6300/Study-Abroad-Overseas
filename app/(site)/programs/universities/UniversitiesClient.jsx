"use client";

import { useState, useEffect } from "react";
import UniversityCard from "@/components/ui/UniversityCard";

const COUNTRIES = [
  "All",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "Netherlands",
  "Switzerland",
];

export default function UniversitiesClient({ universities }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");

  const [results, setResults] = useState(universities ?? []);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // SEARCH / INITIAL LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = searchTerm.trim()
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${searchTerm}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`;

        const res = await fetch(endpoint);
        const data = await res.json();

        setResults(data?.universities ?? []);
        setPage(1);
        setHasMore(true);
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const endpoint = searchTerm.trim()
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/search?q=${searchTerm}&page=${nextPage}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities?page=${nextPage}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      const newUniversities = data?.universities ?? [];

      // Deduplicate
      setResults((prev) => {
        const map = new Map();
        [...prev, ...newUniversities].forEach((u) => {
          if (!u) return;
          map.set(u._id ?? u.slug ?? JSON.stringify(u), u);
        });
        return Array.from(map.values());
      });

      setPage(nextPage);
      if (newUniversities.length === 0) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* HERO - simple fade in with CSS */}
      <div className="bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-gray-950 pt-28 pb-24 border-b border-gray-800/50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-200">
              Top Universities Abroad for Indian Students
            </h2>
            <p className="mt-6 text-xl text-gray-300 leading-relaxed">
              Find your perfect university — compare rankings, programs,
              acceptance rates & student experience.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 -mt-16">
        {/* SEARCH */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <svg
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Search university name, country, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:bg-gray-800/90 transition-all outline-none text-lg shadow-lg shadow-black/20"
          />
        </div>

        {/* RESULTS */}
        {results.length === 0 ? (
          <div className="text-center py-24 text-gray-500 text-lg">
            No universities match your search
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {results.map((uni, i) => (
                <div
                  key={uni?._id ?? uni?.slug ?? `uni-${i}`}
                  className="opacity-100 transition-all duration-500"
                >
                  <UniversityCard
                    uni={uni}
                    index={i}
                    // removed shouldReduceMotion since no motion
                  />
                </div>
              ))}
            </div>

            {/* LOAD MORE */}
            {hasMore && (
              <div className="flex justify-center mt-16 mb-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/30 disabled:opacity-50 disabled:shadow-none transition-all duration-200 text-lg"
                >
                  {loadingMore ? "Loading..." : "Load More Universities"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
