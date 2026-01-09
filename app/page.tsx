import Hero from "../components/Home/HeroSection/Hero";
import Countries from "../components/Home/Universities/universities";
import Services from "../components/Home/Services/services";
import Stories from "../components/Home/SuccessStories/Stories";
import WhyChooseUs from "../components/Home/WhyChooseUs/whychooseus";
import TopPrograms from "../components/Home/TopPrograms/topprograms";
import StudyAbroadProcess from "../components/Home/AbroadProcess/abroadprocess";
import ScholarshipsFunding from "../components/Home/Scholarships/scholarships";
import FinalCTASection from "../components/Home/ReadyToStart/readytostart";

export default function Page() {
  return (
    <main>
      <Hero />
      <Countries />
      <Services />
      <Stories />
      <WhyChooseUs />
      <TopPrograms />
      <StudyAbroadProcess />
      <ScholarshipsFunding />
      <FinalCTASection />
    </main>
  );
}
