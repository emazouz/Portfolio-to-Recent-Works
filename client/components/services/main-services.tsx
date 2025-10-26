"use client";
import {
  PACKAGES,
  SECTIONS_ALTERNATIVE,
  SERVICES,
} from "@/constants/services.constants";
import { Award, Sparkles, Star, Users } from "lucide-react";
import FinalCTA from "./final-CTA";
import ProcessTimeline from "./process-timeline";
import WhyWorkWithMe from "./why-work-with-me";
import ServiceCard from "./service-card";
import PackageCard from "./package-card";
import ServicesHeroSection from "./services-sero-section";

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
    </>
  );
};
