import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-4xl font-bold text-white">
        Your Journey Abroad Starts Here
      </h2>

      <p className="mt-4 text-gray-400">
        Let us handle the preparation — you focus on your future.
      </p>

      <Link
        href="/assessment"
        className="inline-block mt-8 px-10 py-4 bg-[#FF8C00] text-black font-semibold rounded-xl hover:opacity-90"
      >
        Talk to an Expert
      </Link>
    </section>
  );
}
