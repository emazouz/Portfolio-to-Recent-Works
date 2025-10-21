"use client";

import React, { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  FAQ_CATEGORIES,
  FAQCategory,
  TECH_STACK,
  TechStack,
} from "@/constants/faq";

interface TechStackSectionProps {
  techStack: TechStack[];
}

interface FAQCategoryProps {
  category: FAQCategory;
  categoryIndex: number;
}

interface TechBadgeProps {
  tech: TechStack;
}

// Helper function to map chart key to CSS variable string for inline styles
const getChartGradientVar = (gradientKey: string) => {
  // We map common color names/pairs to a specific chart gradient variable
  const map: Record<string, string> = {
    "from-cyan-500 to-blue-600": "chart-3", // Frontend/Docker
    "from-green-500 to-emerald-600": "chart-5", // Backend/MongoDB
    "from-purple-500 to-pink-600": "chart-6", // Database
    "from-orange-500 to-red-600": "chart-7", // DevOps/AWS
    "from-yellow-500 to-amber-600": "chart-4", // API/Performance
    "from-pink-500 to-rose-600": "chart-2", // UI/UX
    "from-teal-500 to-cyan-600": "chart-8", // Consulting
    "from-indigo-500 to-purple-600": "chart-1", // General Questions/Primary

    // Tech Stack details
    "from-cyan-400 to-blue-500": "chart-3",
    "from-red-400 to-rose-500": "chart-7",
    "from-blue-400 to-indigo-500": "chart-3",
    "from-blue-500 to-purple-500": "chart-1",
    "from-indigo-400 to-purple-500": "chart-1",
    "from-orange-400 to-red-500": "chart-7",
    "from-yellow-400 to-orange-500": "chart-4",
    "from-teal-400 to-cyan-500": "chart-5",
    "from-purple-400 to-pink-500": "chart-6",
    "from-sky-400 to-blue-500": "chart-3",
  };
  const chartKey = map[gradientKey] || "chart-1"; // Default to primary chart
  return `var(--${chartKey})`;
};

// --- Sub-components ---

const FAQCategoryComponent = ({
  category,
  categoryIndex,
}: FAQCategoryProps) => {
  const Icon = category.icon;
  const gradientVar = getChartGradientVar(category.gradient);

  return (
    <div
      // Theme: Uses card background and border
      className="group rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl overflow-hidden"
    >
      {/* Category Header */}
      <div
        className="px-6 py-5"
        // Theme: Apply gradient via inline style
        style={{ backgroundImage: gradientVar }}
      >
        <div className="flex items-center gap-4">
          {/* Icon Container */}
          <div
            // Theme: Icon container background uses primary-foreground/20 and icon uses primary-foreground
            className="flex items-center justify-center w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-xl text-primary-foreground shadow-lg"
          >
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2
            // Theme: Header title uses primary-foreground
            className="text-xl md:text-2xl font-black text-primary-foreground"
          >
            {category.title}
          </h2>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="px-6 py-2">
        <Accordion type="single" collapsible className="w-full">
          {category.faqs.map((faq, faqIndex) => (
            <AccordionItem
              key={faqIndex}
              value={`item-${categoryIndex}-${faqIndex}`}
              // Theme: Accordion item separator uses border/50
              className="border-b border-border/50 last:border-b-0"
            >
              <AccordionTrigger
                // Theme: Trigger text uses foreground and primary hover
                className="text-left hover:no-underline transition-colors py-5 group/item"
              >
                <span className="font-semibold text-foreground pr-4 group-hover/item:text-primary transition-colors">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent
                // Theme: Content uses muted-foreground
                className="text-muted-foreground pb-5 leading-relaxed"
              >
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

const TechStackSection = ({ techStack }: TechStackSectionProps) => {
  return (
    <div
      // Theme: Section container uses card background and border
      className="p-8 rounded-2xl bg-card border border-border"
    >
      <h3
        // Theme: Title uses foreground
        className="text-2xl md:text-3xl font-black text-foreground mb-8 text-center"
      >
        Tech Stack & Tools
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {techStack.map((tech, index) => (
          <TechBadge key={index} tech={tech} />
        ))}
      </div>
    </div>
  );
};

const TechBadge = ({ tech }: TechBadgeProps) => {
  const Icon = tech.icon;
  const gradientVar = getChartGradientVar(tech.gradient);

  return (
    <div
      // Theme: Badge container uses muted/border/card hover
      className="group relative flex items-center gap-3 bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        // Theme: Apply gradient via inline style
        style={{ backgroundImage: gradientVar }}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="relative text-transparent bg-clip-text"
        // Theme: Apply gradient to icon via inline style
        style={{
          backgroundImage: gradientVar,
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      {/* Text */}
      <span
        // Theme: Text uses muted-foreground/foreground
        className="relative text-muted-foreground font-semibold text-sm group-hover:text-foreground transition-colors"
      >
        {tech.name}
      </span>
    </div>
  );
};

const CTASection = () => {
  return (
    <div
      // Theme: CTA container uses primary/border/muted styles
      className="mt-16 text-center p-10 md:p-12 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-xl"
    >
      <h3
        // Theme: CTA title uses foreground
        className="text-3xl md:text-4xl font-black text-foreground mb-4"
      >
        Still Have Questions?
      </h3>
      <p
        // Theme: CTA description uses muted-foreground
        className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg leading-relaxed"
      >
        Let's discuss how I can help build your next web application with modern
        technologies and best practices.
      </p>
      <button
        // Theme: CTA Button uses primary colors
        className="group px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 inline-flex items-center gap-2"
        aria-label="Schedule a free consultation"
      >
        Get in Touch
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

// --- Main Component ---
const FAQPage = () => {
  return (
    // Theme: Main background uses theme background color
    <div className="min-h-screen bg-background py-20">
      <div className="wrapper">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Badge Accent */}
          <div
            // Theme: Badge background/border uses primary/10
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl mb-8"
          >
            {/* Theme: Icon uses primary color */}
            <Sparkles
              className="w-4 h-4 text-primary animate-pulse"
              aria-hidden="true"
            />
            {/* Theme: Text clip uses primary/foreground */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-foreground/80 font-bold text-sm">
              QUESTIONS & ANSWERS
            </span>
          </div>
          {/* Main Title */}
          <h1
            // Theme: Title uses foreground color
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6"
          >
            <span
              // Theme: Highlight uses primary and secondary colors
              className="bg-gradient-to-r from-primary via-secondary to-primary/80 bg-clip-text text-transparent"
            >
              Frequently Asked
            </span>
            <br />
            <span className="text-foreground">Questions</span>
          </h1>
          {/* Description */}
          <p
            // Theme: Description uses muted-foreground
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Explore answers about my full-stack development services, tech
            stack, and how I can help bring your project to life.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6 mb-16">
          {FAQ_CATEGORIES.map((category, categoryIndex) => (
            <FAQCategoryComponent
              key={categoryIndex}
              category={category}
              categoryIndex={categoryIndex}
            />
          ))}
        </div>

        {/* Tech Stack Section */}
        <TechStackSection techStack={TECH_STACK} />

        {/* CTA Section */}
        <CTASection />
      </div>
    </div>
  );
};

export default FAQPage;
