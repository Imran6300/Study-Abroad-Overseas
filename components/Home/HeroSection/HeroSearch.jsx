"use client";
import { IoSearch } from "react-icons/io5";

export default function HeroSearch() {
  return (
    <form
      action="/hero-search"
      method="POST"
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

      {/* Search Row */}
      <div
        className="
          flex h-[60px] w-[120%]
          max-[480px]:h-[45px]
        "
      >
        {/* Input */}
        <input
          id="search"
          type="text"
          required
          placeholder="Search countries, courses, colleges, etc"
          className="
            flex-1 min-w-0 h-full pl-[15px] text-[1.25rem]
            outline-none border-2 border-[#32cd32] border-r-0
            rounded-l-[10px] cursor-text relative z-[2]
            max-[480px]:text-[14px]
          "
        />

        {/* Button */}
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
