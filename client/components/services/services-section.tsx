import { Package } from "lucide-react";
import { services } from "@/constants/services.constants";
import HeaderSection from "../header-section";
import StatCard from "../state-card";

export function ServicesSection() {
  return (
    <section className="wrapper">
      <HeaderSection
        icon={<Package className="animate-pulse" />}
        badgeTitle="Services"
        title="Services & Expertise"
        description="Comprehensive development services to bring your digital vision to
            life"
        ctaText="View All 6+ Services"
        ctaHref="/services"
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <StatCard key={index} feature={service} index={index} />
        ))}
      </div>
    </section>
  );
}
