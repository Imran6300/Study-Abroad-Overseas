import Hero from "@/components/pre-departure/Hero";
import Services from "@/components/pre-departure/Services";
import LiveSession from "@/components/pre-departure/LiveSession";
import Checklist from "@/components/pre-departure/Checklist";
import Trust from "@/components/pre-departure/Trust";
import CTA from "@/components/pre-departure/CTA";

export const metadata = {
  title: "Pre-Departure Support for Study Abroad | Overseas Guidance",
  description:
    "Complete pre-departure support for international students. Packing, travel, accommodation, airport briefing, and post-arrival guidance.",
};

export default function PreDeparturePage() {
  return (
    <main className="bg-[#0b1220] text-gray-200">
      <Hero />
      <Services />
      <LiveSession />
      <Checklist />
      <Trust />
      <CTA />
    </main>
  );
}
