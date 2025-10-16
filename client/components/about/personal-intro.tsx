"use client";

import { useEffect, useRef, useState } from "react";

export function PersonalIntro() {
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

  return (
    <section id="intro" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            <div className="space-y-12">
              <div className="flex items-start gap-4 group">
                <div className="text-sm text-muted-foreground mt-1 w-32 flex-shrink-0">
                  2024 — PRESENT
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    Senior Frontend Engineer, Accessibility · TechCorp ↗
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Build and maintain critical components used to construct
                    TechCorp's frontend, across the whole product. Work closely
                    with cross- functional teams, including developers,
                    designers, and product managers, to implement and advocate
                    for best practices in web accessibility.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      JavaScript
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      React
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      Storybook
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="text-sm text-muted-foreground mt-1 w-32 flex-shrink-0">
                  2021 — 2024
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    Full-Stack Developer · StartupXYZ ↗
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Developed and shipped highly interactive web applications
                    for millions of users. Collaborated with designers and
                    product managers to deliver pixel-perfect, performant
                    experiences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      React
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      Node.js
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      PostgreSQL
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      AWS
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="text-sm text-muted-foreground mt-1 w-32 flex-shrink-0">
                  2019 — 2021
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
                    Frontend Developer · Digital Agency ↗
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Built responsive websites and web applications for various
                    clients across different industries. Focused on performance
                    optimization and cross-browser compatibility.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      HTML
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      CSS
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      JavaScript
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      Vue.js
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium hover:text-accent transition-colors"
              >
                View Full Résumé ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
