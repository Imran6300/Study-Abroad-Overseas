"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold">
        Search results for:
        <span className="text-green-600"> {query}</span>
      </h1>

      <p className="mt-4 text-gray-600">Showing results related to "{query}"</p>
    </div>
  );
}
