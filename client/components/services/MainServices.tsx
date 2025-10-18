"use client";
import { PACKAGES, SECTIONS_ALTERNATIVE, SERVICES } from "@/constants/services";
import { Award, Sparkles, Star, Users } from "lucide-react";
import FinalCTA from "./FinalCTA";
import ProcessTimeline from "./ProcessTimeline";
import WhyWorkWithMe from "./WhyWorkWithMe";
import { ServiceCard } from "./ServiceCard";
import { PackageCard } from "./PackageCard";
import ScrollProgressIndicator from "../ScrollProgress";
import ServicesHeroSection from "./ServicesHeroSection";

export const MainContentServices = () => {
  return (
    <>
      <div className="wrapper space-y-10">
        <ServicesHeroSection />
        {/* Services */}
        <ServiceCard />
        {/* Packages */}
        <PackageCard />
        <WhyWorkWithMe />
        <ProcessTimeline />
        <FinalCTA />
      </div>
      {(ScrollProgressIndicator as unknown as any)(SECTIONS_ALTERNATIVE)}
    </>
  );
};
