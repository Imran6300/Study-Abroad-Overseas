import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities/${slug}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();

  if (!data?.success || !data?.university) {
    notFound();
  }
  return (
    <UniversityDetailLayout
      uni={{
        ...data.university,
        courses: data.courses,
      }}
    />
  );
}
