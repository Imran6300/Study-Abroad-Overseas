import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = params;

  try {
    const [uniRes, similarRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`, {
        cache: "no-store",
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/similar/${slug}`,
        { cache: "no-store" },
      ),
    ]);

    if (!uniRes.ok) return notFound();

    const uniData = await uniRes.json();
    const similarData = await similarRes.json();

    if (!uniData?.success || !uniData?.university) {
      return notFound();
    }

    return (
      <UniversityDetailLayout
        uni={{
          ...uniData.university,
          courses: uniData.courses,
        }}
        similarUniversities={similarData?.universities || []}
      />
    );
  } catch (err) {
    return notFound();
  }
}
