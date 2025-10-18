"use client";

import { ScrollProgressIndicatorProps } from "@/types/ScrollProgressType";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const SCROLL_VISIBILITY_THRESHOLD = 150;
const SECTION_OFFSET = 80;

export default function ScrollProgressIndicator(
  sections: ScrollProgressIndicatorProps[]
) {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - SECTION_OFFSET;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollTop / docHeight) * 100, 100);
        setScrollProgress(progress);

        setIsVisible(scrollTop > SCROLL_VISIBILITY_THRESHOLD);

        // Improved section detection - iterate from bottom to top
        let currentSection = sections[0]?.id || "";
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const element = document.getElementById(section.id);
          if (!element) continue;

          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const threshold = SECTION_OFFSET + 100;

          if (elementTop <= threshold) {
            currentSection = section.id;
            break;
          }
        }

        setActiveSection(currentSection);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, sectionId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToSection(sectionId);
      }
    },
    [scrollToSection]
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const activeSectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === activeSection),
    [sections, activeSection]
  );

  if (!sections.length) return null;

  return (
    <>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        .animate-pulse-slow { 
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; 
        }
        .animate-ping-slow { 
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; 
        }
        .animate-shimmer { 
          animation: shimmer 3s ease-in-out infinite; 
        }
      `}</style>

      {/* Toggle Button */}
      <div
        className={`fixed ${
          isExpanded ? "right-6 md:right-8" : "right-0"
        } top-24 md:top-20 z-50`}
      >
        <button
          onClick={toggleExpanded}
          className={`w-7 h-7 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/50 p-1 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 text-slate-300`}
          aria-label={isExpanded ? "Hide navigation" : "Show navigation"}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <ChevronsLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav
        className={`fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-700 ease-out ${
          isExpanded && isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-8 pointer-events-none"
        }`}
        aria-label="Page section navigation timeline"
        aria-hidden={!isExpanded || !isVisible}
      >
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl" />

          {/* Background track */}
          <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-slate-700/40 via-slate-600/60 to-slate-700/40 rounded-full shadow-inner" />

          {/* Progress indicator */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[2px] rounded-full transition-all duration-500 ease-out"
            style={{
              height: `${scrollProgress}%`,
              maxHeight: "100%",
              background:
                "linear-gradient(180deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
              boxShadow:
                "0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)",
            }}
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page scroll progress"
          />

          {/* Navigation dots */}
          <div className="relative flex flex-col gap-3 py-3">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isPassed = activeSectionIndex > index;

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  tabIndex={0}
                  className="group relative flex items-center justify-center transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-full"
                  aria-label={`Navigate to ${section.label}`}
                  aria-current={isActive ? "location" : undefined}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Animated orbital rings for active section */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 w-10 h-10 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 pointer-events-none">
                        <div
                          className="absolute inset-0 rounded-full border border-indigo-400/30 animate-ping-slow"
                          style={{ animationDuration: "3s" }}
                        />
                        <div
                          className="absolute inset-2 rounded-full border border-purple-400/40 animate-ping-slow"
                          style={{
                            animationDuration: "2.5s",
                            animationDelay: "0.5s",
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 w-12 h-12 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow blur-md" />
                    </>
                  )}

                  {/* Main Icon Container */}
                  <div
                    className={`relative w-7 h-7 p-1 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                      isActive
                        ? `bg-gradient-to-br ${section.gradient} scale-125 rotate-0 shadow-2xl`
                        : isPassed
                        ? "bg-slate-700/60 scale-90 shadow-lg border border-slate-600/40"
                        : "bg-slate-800/50 scale-100 shadow-md border border-slate-700/30 group-hover:scale-110 group-hover:bg-slate-700/70"
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 0 30px ${
                            section.gradient.includes("indigo")
                              ? "rgba(99, 102, 241, 0.5)"
                              : section.gradient.includes("pink")
                              ? "rgba(236, 72, 153, 0.5)"
                              : "rgba(168, 85, 247, 0.5)"
                          }, 0 10px 25px -5px rgba(0, 0, 0, 0.5)`
                        : undefined,
                    }}
                  >
                    {/* Shimmer effect overlay */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent animate-shimmer" />
                      </div>
                    )}

                    <Icon
                      className={`w-4 h-4 z-10 relative transition-all duration-500 ${
                        isActive
                          ? "text-white drop-shadow-lg scale-110"
                          : isPassed
                          ? "text-slate-400"
                          : "text-slate-500 group-hover:text-indigo-300 group-hover:scale-110"
                      }`}
                      aria-hidden="true"
                    />

                    {/* Check mark for passed sections */}
                    {isPassed && !isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-emerald-400 absolute"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Label tooltip */}
                  <div
                    className={`absolute left-full ml-8 transition-all duration-500 pointer-events-none ${
                      isActive
                        ? "opacity-100 translate-x-0 scale-100"
                        : "opacity-0 -translate-x-4 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
                    }`}
                    role="tooltip"
                  >
                    <div className="relative">
                      {/* Glow effect behind tooltip */}
                      {isActive && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-20 blur-xl rounded-2xl`}
                        />
                      )}

                      <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 border border-slate-700/50 rounded-xl px-5 py-3 shadow-2xl backdrop-blur-xl">
                        {/* Arrow */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1px]">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-slate-700/50" />
                        </div>

                        <div className="flex items-center gap-3 whitespace-nowrap">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${
                              section.gradient
                            } ${isActive ? "animate-pulse" : ""}`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-sm font-semibold tracking-wide transition-colors ${
                              isActive
                                ? `bg-gradient-to-r ${section.gradient} bg-clip-text text-transparent`
                                : "text-slate-300"
                            }`}
                          >
                            {section.label}
                          </span>
                        </div>

                        {/* Animated bottom border */}
                        <div
                          className={`absolute inset-x-0 -bottom-px h-[2px] bg-gradient-to-r ${
                            section.gradient
                          } transition-all duration-500 ${
                            isActive
                              ? "opacity-100 scale-x-100"
                              : "opacity-0 scale-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Connecting line to next section */}
                  {index < sections.length - 1 && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-3 transition-all duration-500 ${
                        isPassed
                          ? "bg-gradient-to-b from-indigo-500 to-purple-500 opacity-60"
                          : "bg-slate-700/30"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Enhanced Progress percentage display */}
          <div
            className={`absolute -bottom-12 left-1/2 -translate-x-1/2 transition-all duration-500 ${
              scrollProgress > 5
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-lg rounded-lg" />

              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/60 rounded-lg px-3 py-1.5 shadow-xl backdrop-blur-md overflow-hidden">
                {/* Animated background bars */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>

                <div className="relative flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse" />
                  <span className="text-xs font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {Math.round(scrollProgress)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
