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
          h-[240px] flex flex-col
        "
      >
        <img
          src={uni.image}
          alt={uni.name}
          className="w-full h-32 object-cover"
        />

        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-[#CCD6F6] font-semibold mb-1 line-clamp-2">
              {uni.name}
            </h3>

            <p className="text-sm text-[#8892B0] line-clamp-1">
              {uni.location}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
