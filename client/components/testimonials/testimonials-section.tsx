"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, memo, useMemo, useCallback } from "react";
import Image from "next/image";
import HeaderSection from "../header-section";
import { StarRating } from "../star-rating";
import { Testimonial } from "@/types/index.types";
import { testimonials } from "@/constants/testimonials.constants";

// --- Memoized Components ---

const CaseStudyBox = memo(
  ({ title, content }: { title: string; content: string }) => (
    <div
      className="bg-muted/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 group"
      role="region"
      aria-label={`${title}: ${content}`}
    >
      <h5 className="text-primary text-sm font-semibold mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
        {title}
      </h5>
      <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
    </div>
  )
);

CaseStudyBox.displayName = "CaseStudyBox";

const TestimonialCard = memo(
  ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
    const stars = useMemo(
      () => Array(testimonial.rating).fill(null),
      [testimonial.rating]
    );

    return (
      <div
        className="w-full flex-shrink-0"
        role="article"
        aria-labelledby={`testimonial-${index}-name`}
      >
        <Card className="bg-card rounded-2xl p-6 sm:p-8 shadow-xl border border-border hover:border-primary/30 transition-all duration-500">
          <CardContent className="p-0">
            {/* Quote Icon: Uses primary color with low opacity */}
            <div className="mb-6">
              <Quote className="w-10 h-10 text-primary/20" />
            </div>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
              {/* Avatar: Uses primary color for ring */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                <Image
                  src={testimonial.avatar}
                  alt={`${testimonial.name}'s profile`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              {/* Info & Rating */}
              <div className="flex-1 min-w-0">
                <h4
                  id={`testimonial-${index}-name`}
                  className="text-xl font-bold text-foreground mb-1"
                >
                  {testimonial.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {testimonial.role} at {testimonial.company}
                </p>

                {/* Star Rating: FIX - Use secondary color */}
                <StarRating rating={testimonial.rating} size="md" />
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-foreground/90 text-lg leading-relaxed mb-8 italic">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>

            {/* Case Study */}
            <div className="space-y-4">
              <h5 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Case Study
              </h5>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CaseStudyBox
                  title="Problem"
                  content={testimonial.caseStudy.problem}
                />
                <CaseStudyBox
                  title="Solution"
                  content={testimonial.caseStudy.solution}
                />
                <CaseStudyBox
                  title="Result"
                  content={testimonial.caseStudy.result}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

// --- Main Component ---

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  return (
    <section className="wrapper">
      <HeaderSection
        icon={<Quote className="animate-pulse" />}
        badgeTitle="Portfolio"
        title="Featured Projects"
        description="Explore my latest work and case studies showcasing innovative solutions across web development, design, and technology."
        ctaText="View All Projects"
        ctaHref="/testimonials"
      />
      {/* Carousel */}
      <div className="relative" role="region" aria-label="Testimonial carousel">
        {/* Cards Container */}
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePrev}
            className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots Indicator: Uses primary color for active dot */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={handleNext}
            className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
