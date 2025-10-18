"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function AboutCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // FIX: Main container uses theme-aware colors (primary/border)
  return (
    <section
      id="cta"
      ref={sectionRef}
      className="mt-16 text-center p-10 md:p-12 rounded-2xl bg-primary/10 border border-border backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center space-y-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="space-y-4">
            {/* Title uses text-foreground */}
            <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
              Want to build something{" "}
              {/* FIX: Highlight uses primary and secondary colors */}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                amazing together?
              </span>
            </h2>
            {/* Description uses text-muted-foreground */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Let's turn your ideas into exceptional digital experiences that
              make a real impact
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <Button
              size="lg"
              // FIX: Primary button uses theme primary colors
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 animate-bounce-subtle group px-8 py-6 text-lg text-primary-foreground"
              asChild
            >
              <a href="/portfolio">
                <Eye className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                View My Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              // FIX: Outline button uses theme primary colors for border/text/hover
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 px-8 py-6 text-lg group bg-transparent"
              asChild
            >
              <a href="/contact">
                Contact Me
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
