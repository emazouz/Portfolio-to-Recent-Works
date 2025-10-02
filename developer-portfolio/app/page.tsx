import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedTemplates } from "@/components/featured-templates"
import { FeaturedProjectsSection } from "@/components/featured-projects-section"
import { LatestArticlesSection } from "@/components/latest-articles-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StatsSection } from "@/components/stats-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

export default function HomePage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <main>
          <HeroSection />
          <ServicesSection />
          <FeaturedTemplates />
          <FeaturedProjectsSection />
          <StatsSection />
          <LatestArticlesSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
      </div>
    </ThemeProvider>
  )
}
