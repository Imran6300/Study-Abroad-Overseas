import { notFound } from "next/navigation";
import ProgramClient from "./ProgramClient";
import { categoryData } from "@/data/coursescategory";

export async function generateStaticParams() {
  return Object.entries(categoryData).flatMap(
    ([category, catData]) => {
      const allPrograms = [
        ...(catData.tabs?.bachelor || []),
        ...(catData.tabs?.master || []),
        ...(catData.tabs?.phd || []),
      ];

      return allPrograms
        .filter(p => p.slug)
        .map(p => ({
          category: category.toLowerCase(),
          program: p.slug,
        }));
    }
  );
}

export default async function ProgramPage({ params }) {
  // ✅ UNWRAP PARAMS (REQUIRED IN NEXT 16)
  const { category, program } = await params;

  const categorySlug = category?.toLowerCase();
  const programSlug = program;

  if (!categorySlug || !programSlug) {
    notFound();
  }

  const catData = categoryData[categorySlug];
  if (!catData) notFound();

  const programData = [
    ...(catData.tabs?.bachelor || []),
    ...(catData.tabs?.master || []),
    ...(catData.tabs?.phd || []),
  ].find(p => p.slug === programSlug);

  if (!programData) notFound();

  return (
    <ProgramClient
      category={categorySlug}
      program={programData}
    />
  );
}
