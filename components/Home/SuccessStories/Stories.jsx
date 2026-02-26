import SuccessCard from "./SuccessCard";

export const revalidate = 60;

export default async function Stories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/testimonials`,
    {
      next: { revalidate: 60 },
    },
  );

  const data = await res.json();
  const students = data.success ? data.data.slice(0, 4) : [];

  return (
    <section className="min-h-screen w-full bg-[#f5f7ff] py-12 sm:py-16 px-4 sm:px-6 flex flex-col items-center">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#4169E1]">
          Success Stories
        </h1>

        <p className="text-[#2F4F4F] mt-2 text-base md:text-lg">
          Real journeys. Real transformations.
        </p>

        <div className="w-24 h-[3px] mt-3 rounded-full mx-auto bg-gradient-to-r from-[#4169E1] to-[#32CD32]" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 max-w-[1200px] w-full">
        {students.map((student) => (
          <SuccessCard key={student._id} student={student} />
        ))}
      </div>
    </section>
  );
}
