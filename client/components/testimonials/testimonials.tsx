import { testimonials } from "@/constants/testimonials.constants";
import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";
import { getChartGradientVar } from "@/handlers/index.handlers";
import { StatsSection } from "../stats-section";
import FeaturedTestimonialCard from "./featured-testimonial-card";
import TestimonialCard from "./testimonial-card";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function TestimonialsPage() {
  // Filter featured testimonials
  const featuredTestimonials = testimonials.filter((t) => t.featured);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Page title and description */}
      <section className="py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge - Uses primary colors */}
          <Badge variant="outline" className="mb-6 px-5 py-2.5">
            <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
            Client Success Stories
          </Badge>

          {/* Title - Uses foreground with primary highlight */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-foreground">
            Client{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: getChartGradientVar("chart-1") }}
            >
              Testimonials
            </span>
          </h1>

          {/* Description - Uses muted-foreground */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Don't just take my word for it. Here's what my clients have to say
            about working with me and the results we've achieved together.
          </p>
        </div>
      </section>

      {/* STATISTICS SECTION - Key metrics */}
      <StatsSection />

      {/* FEATURED TESTIMONIALS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Featured Reviews
            </h2>
            <p className="text-muted-foreground">
              Hear from clients who've experienced exceptional results
            </p>
          </div>

          {/* Featured Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <FeaturedTestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                featured
              />
            ))}
          </div>
        </div>
      </section>

      {/* ALL TESTIMONIALS SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              All Reviews
            </h2>
            <p className="text-muted-foreground">
              Every project, every success story
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CALL-TO-ACTION SECTION */}
      <section className="py-20">
        <div className="wrapper">
          {/* CTA Card with gradient border */}
          <Card className="relative overflow-hidden border-2 border-border p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                Ready to Join These Happy Clients?
              </h2>

              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let's discuss your project and see how I can help you achieve
                your goals. I'm committed to delivering exceptional results for
                every client.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <a href="/contact">Start Your Project</a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-border hover:bg-muted"
                  asChild
                >
                  <a href="/portfolio">View My Work</a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
