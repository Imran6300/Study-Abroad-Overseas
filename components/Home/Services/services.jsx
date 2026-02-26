import ServicesCard from "./ServicesCard";
import { Data } from "./ServicesCardData";
import FadeContent from "../../Animations/FadeContent";

export default function Services() {
  return (
    <section className="w-full bg-[#1f2937] py-16 md:py-18">
      {/* Section Heading */}
      <div className="text-center mb-14 px-6">
        <FadeContent blur duration={500} easing="ease-out" initialOpacity={0}>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent drop-shadow-lg">
            Our Services
          </h1>

          <p className="text-gray-300 mt-2 text-base max-w-xl mx-auto">
            From Dreams to Destination — We’re Here to Guide Your Journey Abroad
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] mx-auto mt-4 rounded-full" />
        </FadeContent>
      </div>

      {/* Cards */}
      <div className="w-full">
        <ServicesCard Data={Data} />
      </div>
    </section>
  );
}
