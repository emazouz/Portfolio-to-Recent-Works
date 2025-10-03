import { AboutHero } from "@/components/about/about-hero";
import { PersonalIntro } from "@/components/about/personal-intro";
import { SkillsSection } from "@/components/about/skills-section";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { FunFactsSection } from "@/components/about/fun-facts-section";
import { AboutCTA } from "@/components/about/about-cta";
import { ScrollProgress } from "@/components/about/scroll-progress";

export const metadata = {
  title: "About - Developer Portfolio",
  description:
    "Learn about my journey as a developer, skills, experience, and passion for creating exceptional digital experiences.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <main>
        <AboutHero />
        <PersonalIntro />
        <SkillsSection />
        <ExperienceTimeline />
        <FunFactsSection />
        <AboutCTA />
      </main>
    </div>
  );
}
