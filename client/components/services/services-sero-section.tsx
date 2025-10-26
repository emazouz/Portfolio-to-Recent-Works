import React from "react";
import {
  Award,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import HeaderSection from "../header-section";
import { StatCardProps } from "@/types/services.types";
import { getChartGradientVar } from "@/handlers/index.handlers";
import { KEY_FEATURES, STATS } from "@/constants/services.constants";

export default function ServicesHeroSection() {
  return (
    <section>
      <div className="relative wrapper">
        <div className="space-y-8">
          {/* Header Section (already theme-aware) */}
          <HeaderSection
            icon={<Sparkles className="animate-pulse" />}
            badgeTitle="PROFESSIONAL WEB DEVELOPMENT"
            title="Services That Scale"
            description="From concept to deployment - comprehensive solutions powered by Next.js, React, and TypeScript"
            hideCta={true}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {STATS.map((stat, idx) => (
              <StatCard key={idx} stat={stat} index={idx} />
            ))}
          </div>

          {/* Key Features List */}
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
            {KEY_FEATURES.map((feature, idx) => (
              <div
                key={idx}
                // FIX: Text uses muted-foreground/foreground
                className="flex items-center gap-2 text-muted-foreground group"
              >
                {/* FIX: Check icon uses secondary color */}
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              // FIX: Primary CTA uses theme primary colors
              className="group px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 flex items-center gap-2"
              aria-label="View All Services"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              // FIX: Secondary CTA uses theme border/muted colors
              className="px-8 py-4 bg-muted/50 border border-border text-foreground font-bold rounded-xl transition-all duration-300 hover:bg-muted hover:border-primary/50 hover:scale-105"
              aria-label="Free Consultation"
            >
              Free Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const StatCard = ({ stat, index }: StatCardProps) => {
  const Icon = stat.icon;
  const gradientVar = getChartGradientVar(stat.gradient);

  return (
    <div
      // FIX: Use theme-aware card/border styles
      className="group relative p-6 bg-card backdrop-blur-xl rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Gradient Overlay on Hover: FIX - Use inline style for gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        style={{ backgroundImage: gradientVar }}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-4">
        {/* Icon: FIX - Use inline style for gradient background */}
        <div
          className={`p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
          style={{ backgroundImage: gradientVar }}
        >
          <Icon
            className="w-6 h-6 text-primary-foreground"
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div>
          <div
            // FIX: Use inline style for gradient text clip
            className={`text-3xl font-black bg-clip-text text-transparent mb-1`}
            style={{ backgroundImage: gradientVar }}
          >
            {stat.value}
          </div>
          {/* FIX: Label uses muted-foreground */}
          <div className="text-sm text-muted-foreground font-semibold whitespace-nowrap">
            {stat.text}
          </div>
        </div>
      </div>

      {/* Animated Border: FIX - Use inline style for gradient */}
      <div
        className={`absolute inset-x-0 -bottom-px h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ backgroundImage: gradientVar }}
        aria-hidden="true"
      />
    </div>
  );
};
