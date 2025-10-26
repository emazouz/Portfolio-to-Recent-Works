"use client";

import React, { useMemo } from "react";
import {
  Search,
  Palette,
  Code,
  TestTube,
  Rocket,
  Wrench,
  Clock,
} from "lucide-react";
import HeaderSection from "../header-section";
import { TimelineItemProps } from "@/types/services.types";
import { getChartGradientVar } from "@/handlers/index.handlers";
import { CHART_KEYS, TIMELINE_STEPS } from "@/constants/services.constants";

export default function ProcessTimeline() {
  return (
    <section id="processTimeline" className="wrapper">
      <HeaderSection
        icon={<Clock className="animate-pulse" />}
        badgeTitle="PROVEN WORKFLOW"
        title="My Development Process"
        description="A streamlined 6-step workflow that delivers exceptional results on
          time, every time"
        hideCta={true}
      />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical gradient line - FIX: Use inline style with chart-1 */}
        <div
          className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 md:block rounded-full shadow-lg shadow-primary/30"
          style={{ backgroundImage: getChartGradientVar("chart-1") }}
        />

        {/* Timeline Steps */}
        <div className="space-y-12">
          {TIMELINE_STEPS.map((step, index) => (
            <TimelineItem
              key={step.title}
              step={step}
              index={index}
              isLast={index === TIMELINE_STEPS.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Total Timeline Summary */}
      <div
        // FIX: Use theme-aware card/border styles
        className="mt-16 p-8 rounded-2xl bg-card border border-border text-center"
      >
        <h3 className="text-2xl font-black text-foreground mb-2">
          Total Project Timeline
        </h3>
        <p className="text-muted-foreground mb-4">
          From concept to launch in as little as
        </p>
        <div
          // FIX: Use inline style with primary chart gradient
          className="text-5xl font-black bg-clip-text text-transparent"
          style={{ backgroundImage: getChartGradientVar("chart-1") }}
        >
          6-10 Weeks
        </div>
      </div>
    </section>
  );
}

const TimelineItem = ({ step, index, isLast }: TimelineItemProps) => {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  const gradientVar = useMemo(() => {
    // Dynamically select a chart gradient key based on index
    const chartKey = CHART_KEYS[index % CHART_KEYS.length];
    return getChartGradientVar(chartKey);
  }, [index]);

  return (
    <div
      className={`relative flex items-center gap-8 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content Card */}
      <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
        <div
          // FIX: Use theme-aware card/border styles
          className="group rounded-2xl border border-border bg-card p-6 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all duration-300 hover:scale-[1.02]"
        >
          {/* Header with Icon */}
          <div
            className={`mb-4 flex items-center gap-3 ${
              isEven ? "md:justify-end" : "md:justify-start"
            }`}
          >
            {/* Icon Circle */}
            <div
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300"
              // FIX: Use inline style for gradient background
              style={{ backgroundImage: gradientVar }}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-black text-foreground">
                  {step.title}
                </h3>
              </div>
              {/* Duration Text */}
              {step.duration && (
                <p
                  // FIX: Use inline style for gradient text clip
                  className={`text-sm font-semibold bg-clip-text text-transparent`}
                  style={{ backgroundImage: gradientVar }}
                >
                  {step.duration}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Deliverables */}
          {step.deliverables && step.deliverables.length > 0 && (
            <div className={`${isEven ? "md:text-right" : "md:text-left"}`}>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Deliverables
              </h4>
              <div
                className={`flex flex-wrap gap-2 ${
                  isEven ? "md:justify-end" : "md:justify-start"
                }`}
              >
                {step.deliverables.map((deliverable) => (
                  <span
                    key={deliverable}
                    // FIX: Use theme-aware muted/border styles
                    className="px-3 py-1 bg-muted/50 border border-border text-muted-foreground text-xs font-semibold rounded-full hover:border-primary/50 transition-all"
                  >
                    {deliverable}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Number Badge - Mobile Only */}
        <div className="md:hidden mt-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full text-primary-foreground font-black text-lg shadow-lg"
            // FIX: Use inline style for gradient background
            style={{ backgroundImage: gradientVar }}
          >
            {index + 1}
          </div>
          {/* FIX: Use theme-aware border for mobile line */}
          <div className="h-[2px] flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
      </div>

      {/* Center Dot with Step Number - Desktop Only */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 md:block z-10">
        <div
          // FIX: Use primary-foreground/border for theme colors
          className={`relative flex-center h-14 w-14 rounded-full text-primary-foreground font-black text-xl shadow-xl border-4 border-background group-hover:scale-125 transition-transform duration-300`}
          // FIX: Use inline style for gradient background
          style={{ backgroundImage: gradientVar }}
        >
          <span>{index + 1}</span>
        </div>
      </div>

      {/* Spacer for Alignment - Desktop Only */}
      <div className="hidden flex-1 md:block" />
    </div>
  );
};
