"use client";

import { useEffect, useState } from "react";
import {
  User,
  Code,
  Briefcase,
  Lightbulb,
  Home,
  ContactIcon,
} from "lucide-react";

const sections = [
  { id: "hero", label: "Home", icon: Home },
  { id: "intro", label: "Introduction", icon: User },
  { id: "skills", label: "Skills", icon: Code },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "fun-facts", label: "Fun Facts", icon: Lightbulb },
  { id: "cta", label: "Contacts", icon: ContactIcon },
];

export function ScrollProgress() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setScrollProgress(progress);

      // Show navigation after scrolling 100px
      setIsVisible(scrollTop > 100);

      // Find active section with better accuracy
      const sectionElements = sections
        .map((section) => ({
          id: section.id,
          element: document.getElementById(section.id),
        }))
        .filter((s) => s.element);

      let currentSection = null;
      let minDistance = Infinity;

      sectionElements.forEach(({ id, element }) => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block transition-all duration-500 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
      aria-label="Page navigation"
    >
      <div className="relative">
        {/* Background track */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-full bg-gradient-to-b from-slate-800/30 via-slate-700/30 to-slate-800/30 rounded-full" />

        {/* Progress indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg shadow-purple-500/50"
          style={{
            height: `${scrollProgress}%`,
            maxHeight: "100%",
          }}
        />

        {/* Navigation dots */}
        <div className="relative flex flex-col gap-10 py-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const activeIndex = sections.findIndex(
              (s) => s.id === activeSection
            );

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center justify-center transition-all duration-300 focus:outline-none"
                aria-label={`Navigate to ${section.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Outer ring on active */}
                {isActive && (
                  <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping" />
                  </div>
                )}

                {/* Main dot */}
                <div
                  className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/60 scale-125"
                      : "bg-slate-700/80 border-2 border-slate-600/50 group-hover:bg-slate-600 group-hover:border-indigo-400/60 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-indigo-400/40"
                  }`}
                >
                  {/* Inner glow for active state */}
                  {isActive && (
                    <div className="absolute inset-0.5 rounded-full bg-white/30" />
                  )}
                </div>

                {/* Label tooltip */}
                <div
                  className={`absolute left-full ml-6 transition-all duration-300 pointer-events-none ${
                    isActive
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                >
                  <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-sm">
                    {/* Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-slate-800" />

                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <div
                        className={`p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                            : "bg-slate-800/50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? "text-indigo-400" : "text-slate-400"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isActive ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {section.label}
                      </span>
                    </div>

                    {/* Bottom glow */}
                    {isActive && (
                      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    )}
                  </div>
                </div>

                {/* Section number indicator */}
                <span
                  className={`absolute -left-8 text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "text-indigo-400 opacity-100 scale-100"
                      : "text-slate-600 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress percentage */}
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 transition-all duration-300 ${
            scrollProgress > 5
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2"
          }`}
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 rounded-lg px-2.5 py-1 shadow-lg">
            <span className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
