import Hero from "../../components/Home/HeroSection/Hero";
import Countries from "../../components/Home/Universities/universities";
import Services from "../../components/Home/Services/services";
import Stories from "../../components/Home/SuccessStories/Stories";
import WhyChooseUs from "../../components/Home/WhyChooseUs/whychooseus";
import TopPrograms from "../../components/Home/TopPrograms/topprograms";
import StudyAbroadProcess from "../../components/Home/AbroadProcess/abroadprocess";
import ScholarshipsFunding from "../../components/Home/Scholarships/scholarships";
import FinalCTASection from "../../components/Home/ReadyToStart/readytostart";


async function getUniversities() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/universities`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch universities");
  }

  const data = await res.json();


  return Array.isArray(data.universities)
    ? data.universities
    : [];
}

export default async function Page() {
  const universities = await getUniversities();
  return (
    <main >
      <Hero />
      <Countries universities={universities} />
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
