"use client";

import React from "react";
import {
  Zap,
  Shield,
  Target,
  MessageSquare,
  HeadphonesIcon,
  Rocket,
  Award,
  CheckCircle2,
} from "lucide-react";
import HeaderSection from "../HeaderSection";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string; // Now holds a chart key like 'chart-4'
  benefits: string[];
}

// Helper function to map chart key to CSS variable string
const getChartGradientVar = (gradientKey: string) => {
  return `var(--${gradientKey})`;
};

// Map original hardcoded gradients to theme chart keys
const GRADIENT_MAP: Record<string, string> = {
  "from-yellow-500 to-amber-500": "chart-4",
  "from-indigo-500 to-purple-500": "chart-1",
  "from-pink-500 to-rose-500": "chart-2",
  "from-blue-500 to-cyan-500": "chart-3",
  "from-purple-500 to-violet-500": "chart-6",
  "from-green-500 to-emerald-500": "chart-5",
};

// Apply mapping to the FEATURES array (using the data structure from section 1)
const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Full-Stack Expertise",
    description:
      "One developer, complete ownership. No coordination overhead between frontend and backend teams—just seamless, unified development.",
    gradient: GRADIENT_MAP["from-yellow-500 to-amber-500"],
    benefits: [
      "50% faster delivery",
      "Zero integration issues",
      "Single point of accountability",
    ],
  },
  {
    icon: Rocket,
    title: "Modern Technology Stack",
    description:
      "Built with the latest, production-tested frameworks that major companies trust. Your project stays relevant for years, not months.",
    gradient: GRADIENT_MAP["from-indigo-500 to-purple-500"],
    benefits: [
      "Future-proof architecture",
      "Better performance",
      "Easier maintenance",
    ],
  },
  {
    icon: Target,
    title: "Business-Focused Results",
    description:
      "Code is a means to an end. I focus on metrics that matter: conversions, revenue, and user satisfaction—not just lines of code.",
    gradient: GRADIENT_MAP["from-pink-500 to-rose-500"],
    benefits: [
      "ROI-driven decisions",
      "Measurable outcomes",
      "Growth-oriented features",
    ],
  },
  {
    icon: MessageSquare,
    title: "Crystal Clear Communication",
    description:
      "No technical jargon, no ghosting. Weekly updates, transparent timelines, and honest feedback throughout the entire project.",
    gradient: GRADIENT_MAP["from-blue-500 to-cyan-500"],
    benefits: ["Weekly progress reports", "Always responsive", "No surprises"],
  },
  {
    icon: Shield,
    title: "Security & Compliance First",
    description:
      "Enterprise-grade security built in from day one. GDPR-compliant, encrypted data, and protected against common vulnerabilities.",
    gradient: GRADIENT_MAP["from-purple-500 to-violet-500"],
    benefits: ["Data encryption", "GDPR compliant", "Regular security audits"],
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Partnership",
    description:
      "I don't disappear after launch. Ongoing support, optimization, and feature development keep your platform competitive.",
    gradient: GRADIENT_MAP["from-green-500 to-emerald-500"],
    benefits: [
      "Monthly maintenance",
      "Priority support",
      "Continuous optimization",
    ],
  },
];

export default function WhyWorkWithMe() {
  return (
    <section >
      <div className="wrapper ">
        <HeaderSection
          icon={<Award className="animate-pulse" />}
          badgeTitle="YOUR SUCCESS PARTNER"
          title="Why Work With Me"
          description="Technical excellence meets exceptional client experience. Here's
            what sets me apart."
          hideCta={true}
        />

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div
          // FIX: CTA background uses theme card/border colors
          className="mt-16 p-8 md:p-12 rounded-2xl bg-card border border-border text-center hover:border-primary/50 transition-all duration-300"
        >
          <h3 className="text-3xl font-black text-foreground mb-4">
            Ready to Build Something Amazing?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss your project and create a solution that exceeds
            expectations. No pressure, just honest conversation about what's
            possible.
          </p>
          <button
            // FIX: Button uses theme primary colors
            className="group px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 inline-flex items-center gap-2"
            aria-label="Schedule a free consultation"
          >
            Schedule a Free Consultation
            <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const Icon = feature.icon;
  const gradientVar = getChartGradientVar(feature.gradient);

  return (
    <article
      // FIX: Use theme card/border colors for card body
      className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/50"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon with Gradient Background */}
      <div
        className={`inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
        // FIX: Use inline style for gradient background
        style={{ backgroundImage: gradientVar }}
      >
        <Icon className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3
        // FIX: Title uses foreground color, gradient hover uses inline style
        className="mb-3 text-xl font-black text-foreground transition-all duration-300 group-hover:text-transparent bg-clip-text"
        style={{ backgroundImage: gradientVar }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {feature.description}
      </p>

      {/* Benefits List */}
      <ul className="space-y-2" role="list">
        {feature.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-xs">
            {/* FIX: Check icon uses theme secondary color */}
            <CheckCircle2
              className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary"
              aria-hidden="true"
            />
            {/* FIX: Benefit text uses muted-foreground */}
            <span className="text-muted-foreground">{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10`}
        // FIX: Use inline style for gradient glow effect
        style={{ backgroundImage: gradientVar }}
        aria-hidden="true"
      />
    </article>
  );
};
