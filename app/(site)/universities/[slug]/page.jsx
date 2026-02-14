import UniversityDetailLayout from "@/components/UniversityDetail/UniversityDetailLayout";

export default async function Page({ params }) {
  const { slug } = params; // ✅ Next.js 16

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/get-universities`,
      {
        cache: "no-store", // always fresh
      },
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Failed to fetch universities");
    }

    const uni = data.universities.find(
      (u) => u.slug?.toLowerCase() === slug.toLowerCase(),
    );

    if (!uni) {
      return (
        <div className="min-h-screen flex items-center justify-center text-xl">
          University not found
        </div>
      );
    }

    return <UniversityDetailLayout uni={uni} />;
  } catch (error) {
    console.error("University fetch error:", error);

    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Something went wrong
      </div>
    );
  }
}
