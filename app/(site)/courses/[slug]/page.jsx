import CourseDetailPage from "./course";

export default async function ProgramPage({ params }) {
  const { slug } = await params;

  return <CourseDetailPage slug={slug} />;
}
