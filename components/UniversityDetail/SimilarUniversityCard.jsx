import Link from "next/link";

export default function SimilarUniversityCard({ uni }) {
  return (
    <Link href={`/universities/${uni.slug}`}>
      <div
        className="
          bg-[#112240] border border-[#1E3A5F]
          rounded-xl overflow-hidden
          hover:border-[#4169E1]
          transition cursor-pointer
        "
      >
        <img
          src={uni.image}
          alt={uni.name}
          className="w-full h-40 object-cover"
        />

        <div className="p-4">
          <h3 className="text-[#CCD6F6] font-semibold mb-1">{uni.name}</h3>

          <p className="text-sm text-[#8892B0]">{uni.location}</p>
        </div>
      </div>
    </Link>
  );
}
