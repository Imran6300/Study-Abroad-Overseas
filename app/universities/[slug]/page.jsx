import { universityItems } from "@/components/Home/Countries/TopCountriesData";
import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";

export default async function Page({ params }) {
  const { slug } = await params; // ✅ REQUIRED in Next.js 16

  const uni = universityItems.find(
    (u) => u.slug?.trim().toLowerCase() === slug.trim().toLowerCase()
  );

  if (!uni) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        University not found
      </div>
    );
  }

  return <UniversityDetailLayout uni={uni} />;
}
