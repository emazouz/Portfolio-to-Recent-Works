"use client";

import { Coffee, Code, Globe, Heart, Zap, Users, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeaderSection from "../HeaderSection";

// Helper function to map chart key to CSS variable string
const getChartGradientVar = (gradientKey: string) => {
  return `var(--${gradientKey})`;
};

// --- MAPPING HARDCODED COLORS TO CHART KEYS ---
const GRADIENT_MAP = {
  "from-amber-500 to-orange-500": "chart-4", // Yellow/Amber
  "from-green-500 to-emerald-500": "chart-5", // Green
  "from-blue-500 to-cyan-500": "chart-3", // Blue
  "from-pink-500 to-rose-500": "chart-2", // Pink
  "from-yellow-500 to-amber-500": "chart-4", // Yellow/Amber
  "from-purple-500 to-violet-500": "chart-6", // Purple/Violet
};

const funFacts = [
  {
    icon: Coffee,
    title: "Coffee Lover",
    description: "500+ cups consumed while coding",
    gradientKey: GRADIENT_MAP["from-amber-500 to-orange-500"],
    stat: "500+",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "20+ contributions to community projects",
    gradientKey: GRADIENT_MAP["from-green-500 to-emerald-500"],
    stat: "20+",
  },
  {
    icon: Globe,
    title: "Global Traveler",
    description: "Coded from 15+ countries",
    gradientKey: GRADIENT_MAP["from-blue-500 to-cyan-500"],
    stat: "15+",
  },
  {
    icon: Heart,
    title: "Mentor",
    description: "Helped 50+ developers start their journey",
    gradientKey: GRADIENT_MAP["from-pink-500 to-rose-500"],
    stat: "50+",
  },
  {
    icon: Zap,
    title: "Fast Learner",
    description: "Mastered 3 new frameworks this year",
    gradientKey: GRADIENT_MAP["from-yellow-500 to-amber-500"],
    stat: "3+",
  },
  {
    icon: Users,
    title: "Team Player",
    description: "Led 10+ cross-functional teams",
    gradientKey: GRADIENT_MAP["from-purple-500 to-violet-500"],
    stat: "10+",
  },
];

export default function FunFactsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="fun-facts"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* Header Section */}
      <HeaderSection
        icon={<Heart className="animate-pulse" />}
        badgeTitle="BEYOND THE CODE"
        title="Fun Facts About Me"
        description="What makes me tick as a developer and human being"
        hideCta={true}
      />

      {/* Enhanced Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {funFacts.map((fact, index) => {
          const Icon = fact.icon;
          const gradientVar = getChartGradientVar(fact.gradientKey);

          return (
            <div
              key={index}
              className={`group relative transition-all duration-700`}
            >
              {/* Card Container */}
              <div
                // FIX: Use theme-aware card background and border
                className={`relative h-full p-8 rounded-2xl overflow-hidden bg-card backdrop-blur-xl border border-border/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl`}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
                  // FIX: Use inline style for gradient overlay
                  style={{ backgroundImage: gradientVar }}
                />

                {/* Content */}
                <div className="relative space-y-6 text-center">
                  {/* Icon Section */}
                  <div className="relative inline-block">
                    {/* Icon Container */}
                    <div
                      className={`relative inline-flex p-5 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-lg`}
                      // FIX: Use inline style for gradient background
                      style={{ backgroundImage: gradientVar }}
                    >
                      <Icon className="h-10 w-10 text-primary-foreground group-hover:scale-105 transition-transform duration-500 z-20" />

                      {/* Rotating border effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin`}
                        // FIX: Use inline style for gradient border effect
                        style={{
                          backgroundImage: gradientVar,
                          animationDuration: "3s",
                        }}
                      />
                    </div>

                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10 scale-150`}
                      // FIX: Use inline style for gradient glow effect
                      style={{ backgroundImage: gradientVar }}
                    />

                    {/* Stat Badge */}
                    <div
                      className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-primary-foreground text-xs font-black shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110`}
                      // FIX: Use inline style for stat badge background
                      style={{ backgroundImage: gradientVar }}
                    >
                      {fact.stat}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h3
                      // FIX: Title uses foreground color, clip uses gradient
                      className={`font-bold text-xl text-foreground group-hover:text-transparent bg-clip-text transition-all duration-500`}
                      style={{ backgroundImage: gradientVar }}
                    >
                      {fact.title}
                    </h3>
                    <p
                      // FIX: Description uses muted-foreground
                      className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300"
                    >
                      {fact.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`}
                  style={{ backgroundImage: gradientVar }}
                />
                <div
                  className={`absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl`}
                  style={{ backgroundImage: gradientVar }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Fun Stats Bar */}
      <div
        className={`mt-20 transition-all duration-1000 delay-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div
          // FIX: Use theme-aware card/border
          className="relative p-8 rounded-2xl bg-card backdrop-blur-xl border border-border shadow-2xl max-w-4xl mx-auto group"
        >

          <div className="relative flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            <div className="space-y-2">
              {/* Value Text: FIX - Use theme-aware accent clip */}
              <div
                className="text-4xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: getChartGradientVar("chart-1") }}
              >
                ∞
              </div>
              {/* Label Text: FIX - Use muted-foreground */}
              <div className="text-sm text-muted-foreground font-semibold">
                Lines of Code
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="space-y-2">
              <div
                className="text-4xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: getChartGradientVar("chart-2") }}
              >
                24/7
              </div>
              <div className="text-sm text-muted-foreground font-semibold">
                Passion for Tech
              </div>
            </div>

            {/* Separator */}
            <div className="hidden md:block h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="space-y-2">
              <div
                className="text-4xl font-black text-transparent bg-clip-text"
                style={{ backgroundImage: getChartGradientVar("chart-4") }}
              >
                100%
              </div>
              <div className="text-sm text-muted-foreground font-semibold">
                Dedication
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
