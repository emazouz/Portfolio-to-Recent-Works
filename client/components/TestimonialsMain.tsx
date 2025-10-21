"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, Sparkles, Calendar } from "lucide-react";
import { Testimonial, testimonials } from "@/constants/testimonials";
import { StatsSection } from "@/components/stats-section";

/*
|--------------------------------------------------------------------------
| UTILITY FUNCTION
|--------------------------------------------------------------------------
| Helper to convert chart key to CSS variable.
*/

const getChartGradientVar = (chartKey: string): string => {
  return `var(--${chartKey})`;
};

/*
|--------------------------------------------------------------------------
| SUB-COMPONENT: STAR RATING
|--------------------------------------------------------------------------
| Displays star rating with theme colors.
*/

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ rating, size = "md" }: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < rating
              ? "fill-secondary text-secondary" // Uses secondary color (amber)
              : "text-muted/30" // Uses muted color for empty stars
          } transition-colors`}
        />
      ))}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| SUB-COMPONENT: FEATURED TESTIMONIAL CARD
|--------------------------------------------------------------------------
| Large testimonial card for featured reviews with enhanced styling.
*/

interface TestimonialCardProps {
  testimonial: Testimonial;
  featured?: boolean;
}

const FeaturedTestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <Card className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
    {/* Decorative Quote Icon - Uses primary color with low opacity */}
    <Quote className="absolute top-4 right-4 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />

    {/* Gradient Accent Border - Uses chart gradient */}
    <div
      className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ backgroundImage: getChartGradientVar("chart-1") }}
    />

    <CardHeader className="pb-4">
      <div className="flex items-start gap-4">
        {/* Avatar with ring - Uses primary ring color */}
        <Avatar className="w-16 h-16 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all">
          <AvatarImage
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {testimonial.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Client Name - Uses foreground color */}
          <h3 className="font-bold text-lg text-foreground mb-1">
            {testimonial.name}
          </h3>

          {/* Role and Company - Uses muted-foreground */}
          <p className="text-sm text-muted-foreground mb-3">
            {testimonial.role} at{" "}
            <span className="font-semibold text-foreground">
              {testimonial.company}
            </span>
          </p>

          {/* Rating and Project Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <StarRating rating={testimonial.rating} size="md" />
            <Badge className="text-xs font-semibold bg-muted/50 border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              {testimonial.project}
            </Badge>
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      {/* Testimonial Text - Uses foreground color */}
      <blockquote className="text-base leading-relaxed text-foreground mb-4 italic">
        "{testimonial.testimonial}"
      </blockquote>

      {/* Date - Uses muted-foreground with calendar icon */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        {testimonial.date}
      </div>
    </CardContent>

    {/* Hover Glow Effect - Uses primary gradient */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
      style={{ backgroundImage: getChartGradientVar("chart-1") }}
    />
  </Card>
);

/*
|--------------------------------------------------------------------------
| SUB-COMPONENT: REGULAR TESTIMONIAL CARD
|--------------------------------------------------------------------------
| Compact testimonial card for grid layout.
*/

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => (
  <Card className="group relative h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    {/* Quote Icon - Smaller for compact cards */}
    <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/10 group-hover:text-primary/20 transition-colors" />

    <CardHeader className="pb-3">
      <div className="flex items-start gap-3">
        {/* Smaller Avatar */}
        <Avatar className="w-12 h-12 ring-2 ring-border group-hover:ring-primary/50 transition-all">
          <AvatarImage
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
            {testimonial.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">
            {testimonial.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {testimonial.role}
          </p>
          <div className="mt-1">
            <StarRating rating={testimonial.rating} size="sm" />
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="pt-0">
      {/* Truncated testimonial text */}
      <blockquote className="text-sm leading-relaxed text-muted-foreground mb-3 line-clamp-4 italic">
        "{testimonial.testimonial}"
      </blockquote>

      {/* Footer with project and date */}
      <div className="flex items-center justify-between gap-2">
        <Badge className="text-xs bg-muted/50 border border-border text-muted-foreground">
          {testimonial.project}
        </Badge>
        <p className="text-xs text-muted-foreground">{testimonial.date}</p>
      </div>
    </CardContent>
  </Card>
);

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
| The main testimonials page with all sections.
*/

export default function TestimonialsMain() {
  // Filter featured testimonials
  const featuredTestimonials = testimonials.filter((t) => t.featured);

  return (
    <div className="min-h-screen bg-background">
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
