import Card from "./Card";
import UniversitiesSlider from "./UniversitiesSlider";

const Countries = ({ universities }) => {
  // No duplication needed anymore
  const topUniversities = universities;

  return (
    <div className="min-h-[90vh] w-full bg-[#f5f7ff] flex flex-col items-center sm:pb-16">
      <div className="w-full text-center mb-5 sm:mb-8 px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2B4FFF] pt-3 sm:pt-6">
          Top Universities
        </h1>
        <p className="mt-2 text-gray-700 text-xs sm:text-sm md:text-base font-medium">
          Partnered With World-Class Institutions Around the Globe
        </p>
        <div className="mx-auto mt-3 sm:mt-4 w-12 sm:w-16 h-1 rounded-full bg-[#2B4FFF]/80" />
      </div>

      {/* MOBILE: Simple horizontal scroll (no duplication) */}
      <div className="md:hidden w-full overflow-x-auto no-scrollbar pb-8 px-4">
        <div className="flex gap-4 w-max">
          {topUniversities.map((item) => (
            <div
              key={item.slug}
              className="min-w-[280px] max-w-[280px] shrink-0"
            >
              <Card
                slug={item.slug}
                image={item.images?.[0]?.url}
                logo={item.logo?.url}
                name={item.name}
                location={`${item.city ? item.city + ", " : ""}${item.country?.name}`}
                rank={item.qsRanking}
                desc={item.description}
                students={item.totalStudents}
                acceptance={item.acceptanceRate}
              />
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP: Smooth Infinite Slider */}
      <div className="hidden md:block w-full px-4">
        <UniversitiesSlider items={topUniversities} />
      </div>
    </div>
  );
};

export default Countries;
