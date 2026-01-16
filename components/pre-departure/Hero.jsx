"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
        Ready for Takeoff?{" "}
        <span className="text-[#4169E1]">We’ve Got You Covered</span>
      </h1>

      <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto">
        From packing your bags to landing safely abroad — our pre-departure
        experts prepare you for every step of your international journey.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/assessment"
          className="px-8 py-4 rounded-xl bg-[#4169E1] hover:bg-blue-600 transition text-white font-semibold"
        >
          Join Pre-Departure Session
        </Link>

        <button className="px-8 py-4 rounded-xl border border-gray-600 hover:border-[#32CD32] hover:text-[#32CD32] transition">
          Download Free Checklist
        </button>
      </div>
    </section>
  );
}
