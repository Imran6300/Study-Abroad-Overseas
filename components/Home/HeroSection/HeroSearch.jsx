"use client";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();

    const query = e.target.search.value.trim();
    if (!query) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`,
      );

      if (!res.ok) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        return;
      }

      const data = await res.json();
      if (data.type === "country") {
        router.push(`/all-countries/${data.data.slug}`);
        return;
      }

      if (data.type === "university") {
        router.push(`/programs/universities/${data.data.slug}`);
        return;
      }

      if (data.type === "course") {
        router.push(
          `/programs/universities/${data.data.university.slug}?course=${encodeURIComponent(
            data.data.course,
          )}`,
        );
        return;
      }

      router.push(`/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Search error:", error);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
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
