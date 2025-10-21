"use client";

import { useEffect, useState, useRef } from "react";
import { Award, Users, Calendar, ShoppingBag } from "lucide-react";
import { Separator } from "./ui/separator";

const stats = [
  { label: "Projects Completed", value: 150, suffix: "+", icon: Award },
  { label: "Happy Clients", value: 500, suffix: "+", icon: Users },
  { label: "Years Experience", value: 5, suffix: "+", icon: Calendar },
  { label: "Templates Sold", value: 2500, suffix: "+", icon: ShoppingBag },
];

function Counter({
  end,
  duration = 2000,
  startCounting,
}: {
  end: number;
  duration?: number;
  startCounting: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      setCount(Math.floor(easeOutQuad(progress) * end));

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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>

      <Separator className="my-20 wrapper" />
      <section
        ref={sectionRef}
        className="py-20 my-20 relative overflow-hidden text-primary-foreground" // text-white -> text-primary-foreground
        // FIX: Use inline style for the main gradient background (var(--chart-7))
        style={{ backgroundImage: "var(--chart-7)" }}
      >
        {/* Decorative background elements: Use theme-aware colors (card/primary/secondary) */}
        <div className="absolute inset-0 opacity-10">
          <div
            // FIX: Use primary-foreground/secondary colors for decorative elements
            className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl"
          />
          <div
            // FIX: Use secondary color for decorative elements
            className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/50 rounded-full blur-3xl"
          />
        </div>

        <div className="wrapper relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
              Trusted by Developers Worldwide
            </h2>
            <p
              // FIX: Use primary-foreground/80 for descriptive text over primary background
              className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Numbers that speak for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  animation: isVisible
                    ? `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    : "none",
                }}
              >
                {/* Icon Container: Use white/primary-foreground for icons */}
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary-foreground/20">
                  <stat.icon size={32} className="text-primary-foreground" />
                </div>

                {/* Counter Value */}
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  <Counter end={stat.value} startCounting={isVisible} />
                  {/* FIX: Use secondary color for the suffix (e.g., lime -> secondary) */}
                  <span className="text-secondary">{stat.suffix}</span>
                </div>

                {/* Label */}
                <div
                  // FIX: Use primary-foreground/80 for the label text
                  className="text-primary-foreground/80 text-sm md:text-base font-medium"
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inline styles for custom animations (unchanged) */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
        `}</style>
      </section>
    </>
  );
}
