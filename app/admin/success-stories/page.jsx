import { cookies } from "next/headers";

import SuccessStoriesClient from "./storiesClient";

async function getTestimonials() {
  try {
    const cookieStore = await cookies(); // ✅ MUST await in Next 16

    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/host/testimonial`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    const data = await res.json();

    if (data.success) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("SSR fetch error:", error);
    return [];
  }
}
export default async function SuccessStoriesPage() {
  const stories = await getTestimonials();

  return <SuccessStoriesClient initialStories={stories} />;
}
