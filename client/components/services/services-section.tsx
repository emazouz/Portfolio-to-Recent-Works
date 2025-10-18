"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle2, ArrowRight, Package } from "lucide-react";
import { Button } from "../ui/button";
import { services } from "@/constants/services";
import { useMemo } from "react";
import HeaderSection from "../HeaderSection";

interface Service {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  // Assuming 'gradient' field in services now holds a chart number (e.g., 'chart-1')
  gradient: string;
}

// Helper function to map chart number to CSS variable name
const getChartGradientVar = (gradientKey: string) => {
  // Example: converts 'chart-1' to 'var(--chart-1)'
  return `var(--${gradientKey})`;
};

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
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const Icon = service.icon;

  // Gets the CSS variable string (e.g., 'var(--chart-1)')
  const gradientVar = useMemo(() => {
    return getChartGradientVar(service.gradient);
  }, [service.gradient]);

  return (
    <Card
      className="group card"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* 1. Gradient Glow on Hover: FIX - Use inline style for gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10"
        aria-hidden="true"
        style={{ backgroundImage: gradientVar }}
      />

      <CardHeader>
        {/* 2. Icon Container: FIX - Use inline style for gradient background */}
        <div
          className="h-14 w-14 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundImage: gradientVar }}
        >
          <Icon className="h-7 w-7 text-white" aria-hidden="true" />
        </div>

        {/* 3. Title: FIX - Use inline style for gradient on hover/clip */}
        <CardTitle
          // Text color defaults to foreground, changes to gradient clip on hover
          className="text-xl font-black text-foreground group-hover:text-transparent bg-clip-text transition-all duration-300"
          style={{
            // Apply the gradient as a background image only on hover
            backgroundImage: gradientVar,
          }}
        >
          {service.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Features List */}
        <ul className="space-y-3" role="list">
          {service.features.map((feature, featureIndex) => (
            <li
              key={featureIndex}
              // Text color uses muted-foreground
              className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
            >
              {/* 4. Check Icon: FIX - Use inline style for gradient color clip */}
              <CheckCircle2
                className={`h-5 w-5 flex-shrink-0 mt-0.5 text-transparent bg-clip-text`}
                style={{
                  backgroundImage: gradientVar,
                  filter: "brightness(1.2)",
                }}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* 5. Bottom Accent Line: FIX - Use inline style for gradient background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
        style={{ backgroundImage: gradientVar }}
      />
    </Card>
  );
};
