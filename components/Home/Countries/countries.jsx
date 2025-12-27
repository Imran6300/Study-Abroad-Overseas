// Countries.jsx
import CircularGallery from "./CircularGalary";
import { universityItems } from "./TopCountriesData";

const Countries = () => {
  return (
    <div
      className="
        min-h-screen w-full bg-[#f5f7ff] 
        flex flex-col items-center justify-center 
        pb-10 sm:pb-20
      "
    >
      {/* Top Heading */}
      <div className="w-full text-center mb-6 sm:mb-10 px-4">
        <h1
          className="
            text-2xl sm:text-3xl md:text-4xl font-extrabold 
            text-[#2B4FFF] tracking-wide pt-4 sm:pt-8
          "
        >
          Top Universities
        </h1>

        <div className="mt-2">
          <p className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">
            Partnered With World-Class Institutions Around the Globe
          </p>
        </div>

        {/* Stylish bottom accent line */}
        <div className="mx-auto mt-3 sm:mt-4 w-12 sm:w-16 h-1 rounded-full bg-[#2B4FFF]/80"></div>
      </div>

      {/* Gallery */}
      <div className="w-full px-4">
        <CircularGallery
          items={universityItems}
          cardWidth={400}
          borderRadius={5}
          autoSpeed={1}
          scrollEase={0.8}
        />
      </div>
    </div>
  );
};

export default Countries;
