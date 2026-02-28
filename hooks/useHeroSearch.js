"use client";

import { useRouter } from "next/navigation";

export function useHeroSearch() {
  const router = useRouter();

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${encodeURIComponent(trimmed)}`,
      );

      if (!res.ok) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        return;
      }

      const data = await res.json();

      if (data.type === "country") {
        router.push(`/all-countries/${data.data.slug}`);
        return;
      }

      if (data.type === "university") {
        router.push(`/universities/${data.data.slug}`);
        return;
      }

      if (data.type === "course") {
        router.push(
          `/universities/${data.data.university.slug}?course=${encodeURIComponent(
            data.data.course,
          )}`,
        );
        return;
      }

      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } catch (error) {
      console.error("Search error:", error);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return { handleSearch };
}
