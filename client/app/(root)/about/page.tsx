import { AboutHero } from "@/components/about/about-hero";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import FunFactsSection from "@/components/about/fun-facts-section";
import { AboutCTA } from "@/components/about/about-cta";
import CertificationsSection from "@/components/about/certifications-section";

export const metadata = {
  title: "About - Developer Portfolio",
  description:
    "Learn about my journey as a developer, skills, experience, and passion for creating exceptional digital experiences.",
};

export default function AboutPage() {
  return (
    <div className="wrapper space-y-20">
      <main>
        <AboutHero />
        <ExperienceTimeline />
        <CertificationsSection />
        <FunFactsSection />
        <AboutCTA />
      </main>
    </div>
  );
}
