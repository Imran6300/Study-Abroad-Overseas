import CourseCategory from "./CourseCategory";
import { categoryData } from "@/data/coursescategory";
import { notFound } from "next/navigation";

/* =============================
   STATIC PARAMS (VERY IMPORTANT)
   ============================= */
export async function generateStaticParams() {
  return Object.keys(categoryData).map((slug) => ({
    category: slug,
  }));
}

/* =============================
   METADATA (NEXT.JS 16 SAFE)
   ============================= */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.category;

  // First App Router internal call
  if (!slug) return {};

  const data = categoryData[slug];

  if (!data) {
    notFound();
  }

  return {
    title: `${data.title} Courses Abroad`,
    description: data.subtitle,
  };
}

/* =============================
   PAGE
   ============================= */
export default async function CourseCategoryPage({ params }) {
  const { category } = await params;

  if (!categoryData[category]) {
    notFound();
  }

  return <CourseCategory category={category.toLowerCase()} />;
}

