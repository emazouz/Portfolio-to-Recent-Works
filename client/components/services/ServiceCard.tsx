"use client";

import { ArrowRight, CheckCircle2, TrendingUp, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Service, SERVICES } from "@/constants/services";
import { useEffect, useRef, useState } from "react";
import HeaderSection from "../HeaderSection";

interface ServiceItemProps {
  service: Service;
  index: number;
}

function ServiceItem({ service, index }: ServiceItemProps) {
  const Icon = service.icon;
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isVisible = visibleItems.includes(index);
  const isEven = index % 2 === 0;
  
  // Check if description is long enough to need truncation
  const shouldTruncate = service.description.length > 150;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1 && !visibleItems.includes(index)) {
              setVisibleItems((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleItems]);

  return (
    <section
      id={service.id}
      key={index}
      ref={(el) => {
        itemRefs.current[index] = el as HTMLDivElement | null;
      }}
      className={`relative transition-all duration-1000 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : `${isEven ? "-translate-x-10 sm:-translate-x-20" : "translate-x-10 sm:translate-x-20"} opacity-0`
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Header */}
      <div className="flex-center sm:items-center gap-3 mb-4 sm:mb-6">
        <div
          className="p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg hover:scale-110 hover:rotate-6 transition-transform duration-300 flex-shrink-0"
          style={{ background: `var(--${service.gradient})` }}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-foreground break-words">
            {service.label}
          </h2>
          <p className={`text-sm sm:text-base font-semibold ${service.subtitle}`}>
            Professional Solutions
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="relative border-2 hover:border-transparent transition-all duration-500 overflow-hidden group">
        {/* Animated Gradient Border */}
        <div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `var(--${service.gradient})`,
            filter: "blur(20px)",
          }}
          aria-hidden="true"
        />

        <CardHeader className="p-4 sm:p-6">
          <div className="space-y-3">
            <CardDescription className="text-sm sm:text-base md:text-lg leading-relaxed">
              {shouldTruncate && !isExpanded 
                ? `${service.description.slice(0, 150)}...` 
                : service.description}
            </CardDescription>
            
            {shouldTruncate && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
                aria-label={isExpanded ? "Show less" : "Show more"}
              >
                {isExpanded ? "See Less" : "See More"}
                <ArrowRight 
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5 ${
                    isExpanded ? "rotate-90" : ""
                  }`} 
                />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Metrics Section */}
          {service.metrics && service.metrics.length > 0 && (
            <div className="p-4 sm:p-6 rounded-xl bg-muted/50 border space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Key Performance Metrics
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {service.metrics.map((metric, idx) => (
                  <Card
                    key={idx}
                    className="text-center p-3 sm:p-4 hover:border-primary/50 transition-all hover:scale-105 cursor-default"
                  >
                    <div
                      className="text-xl sm:text-2xl md:text-3xl font-black mb-1 text-transparent bg-clip-text break-words"
                      style={{ backgroundImage: `var(--${service.gradient})` }}
                    >
                      {metric.value}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {metric.label}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Benefits Section */}
          {service.benefits && service.benefits.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  Key Benefits
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                {service.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-muted/30 border hover:border-primary/50 hover:bg-muted/50 transition-all group/benefit"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5 group-hover/benefit:scale-110 transition-transform" />
                    <span className="text-foreground text-xs sm:text-sm font-medium break-words">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Technologies Section */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {service.technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-default"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default function ServiceCard() {
  return (
    <div className="min-h-screen">
      <div className="wrapper px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <HeaderSection
          icon={<Zap className="animate-pulse" />}
          badgeTitle="Our Services"
          title="Comprehensive Solutions"
          description="Tailored services to elevate your business. From concept to
            deployment, we deliver excellence at every step."
          hideCta={true}
        />

        {/* Services List */}
        <div className="space-y-12 sm:space-y-16">
          {SERVICES.map((service, index) => (
            <ServiceItem key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}