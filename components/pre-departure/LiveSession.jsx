import Link from "next/link";

export default function LiveSession() {
  return (
    <section className="py-20 px-6 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white">
          Live Pre-Departure Sessions
        </h2>

        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Weekly expert-led sessions covering travel, immigration,
          accommodation, finance & real student experiences.
        </p>

        <Link
          href="/assessment"
          className="inline-block mt-8 px-8 py-4 bg-[#32CD32] text-black font-semibold rounded-xl hover:opacity-90"
        >
          Reserve Your Seat
        </Link>
      </div>
    </section>
  );
}
