"use client";

import { MessageSquare, Award } from "lucide-react";
import HeaderSection from "../header-section";
import StatCard from "../state-card";
import { FEATURES } from "@/constants/services.constants";

export default function WhyWorkWithMe() {
  return (
    <section>
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
            <StatCard key={feature.title} feature={feature} index={index} />
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
