"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp } from "lucide-react";
import HeaderSection from "./header-section";
import { CLIENT } from "@/constants/testimonials.constants";
import { CounterProps } from "@/types/index.types";
import { STATS } from "@/constants/index.constants";

function Counter({ end, duration = 2000, startCounting }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Enhanced easing function for smoother animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(easeOutCubic(progress) * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return <span>{count.toLocaleString()}</span>;
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        // Main background is black/dark in dark mode (via bg-background which is set to black gradient)
        className="py-24 relative overflow-hidden"
      >
        {/* Animated Background Elements (Using theme primary color for glows) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Grid Pattern Overlay (Kept white for effect on dark background) */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="wrapper relative z-10">
          <HeaderSection
            icon={<TrendingUp className="animate-pulse" />}
            badgeTitle="Our Impact"
            title="Trusted by Developers"
            description="Numbers that speak for our commitment to excellence and innovation."
            hideCta={true}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {STATS.map((stat, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: isVisible
                    ? `fadeInUp 0.6s ease-out ${index * 0.15}s both`
                    : "none",
                }}
              >
                {/* Card Container */}
                <div
                  className="relative h-full p-8 rounded-3xl bg-card/10 backdrop-blur-md border border-border/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  // Added dynamic shadow for luxury effect
                  style={{
                    // This dynamic style uses the color defined in the stat object for the shadow effect
                    boxShadow: isVisible
                      ? `0 0 40px 0 ${stat.bgGlow
                          .replace("bg-", "")
                          .replace("/20", "")}`
                      : "none",
                    transition: "box-shadow 0.5s ease-in-out",
                  }}
                >
                  {/* Gradient Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg shadow-black/30`}
                    >
                      <stat.icon
                        size={28}
                        className="text-primary-foreground"
                      />
                    </div>
                    {/* Animated Ring */}
                    <div
                      className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} animate-ping opacity-20`}
                    />
                  </div>

                  {/* Counter Value */}
                  <div className="relative mb-3">
                    <div className="text-5xl md:text-6xl font-bold text-foreground">
                      <Counter end={stat.value} startCounting={isVisible} />
                      {/* Suffix uses the gradient for the gold color */}
                      <span
                        className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.suffix}
                      </span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="text-muted-foreground text-sm md:text-base font-medium tracking-wide">
                    {stat.label}
                  </div>

                  {/* Bottom Accent Line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 p-6 rounded-2xl bg-card/10 backdrop-blur-md border border-border/50">
              <div className="flex -space-x-3">
                {/* Avatar stack using Gold Primary colors for contrast */}
                {CLIENT.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`client-${i}`}
                    className="relative w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-secondar"
                  />
                ))}
              </div>
              <div className="text-left">
                <p className="text-foreground font-semibold">
                  Join 500+ Happy Clients
                </p>
                <p className="text-muted-foreground text-sm">
                  Start your journey today
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Animations & Styles */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }

          .delay-1000 {
            animation-delay: 1s;
          }

          .delay-2000 {
            animation-delay: 2s;
          }

          .bg-grid-pattern {
            background-image: linear-gradient(
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.05) 1px,
                transparent 1px
              );
            background-size: 50px 50px;
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.05);
            }
          }

          .animate-pulse {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </section>
    </>
  );
}
