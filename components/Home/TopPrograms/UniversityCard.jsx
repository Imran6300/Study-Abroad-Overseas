import Link from "next/link";
import Image from "next/image";

export default function UniversityCard({ uni }) {
  return (
    <Link href={`/programs/universities/${uni.slug}`}>
      <div className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-[#DCDCDC]">
        <Image
          src={uni.image}
          alt={uni.name}
          width={400}
          height={200}
          className="h-48 w-full object-cover group-hover:scale-105 transition"
        />

        <div className="p-4">
          <h3 className="text-lg font-bold text-[#2F4F4F]">{uni.name}</h3>

          <p className="text-sm text-gray-600 mt-1">
            {uni.city}, {uni.country}
          </p>

          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-[#FF8C00] font-semibold">
              ⭐ {uni.rating}
            </span>
            <span className="text-sm text-[#4169E1] font-semibold">View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
