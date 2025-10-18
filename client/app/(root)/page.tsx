import HeroSection from "@/components/hero-section";
import { ServicesSection } from "@/components/services/services-section";
import { FeaturedProjectsSection } from "@/components/portfolio/featured-projects-section";
import { LatestArticlesSection } from "@/components/blog/latest-articles-section";
import TestimonialsSection from "@/components/testimonials-section";
import { StatsSection } from "@/components/stats-section";
import { FAQSection } from "@/components/faq-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Emazouz developer portfolio",
};

export default function HomePage() {
  return (
    <div className=" space-x-20">
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturedProjectsSection />
        <StatsSection />
        <LatestArticlesSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
    </div>
  );
}
