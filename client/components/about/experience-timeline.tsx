"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Briefcase, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import HeaderSection from "../header-section";
import { experiences } from "@/constants/about.constants";

export function ExperienceTimeline() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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
      id="experience"
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20"
    >
      <HeaderSection
        icon={<Sparkles className="animate-pulse" />}
        badgeTitle="PROFESSIONAL JOURNEY"
        title="Work Experience"
        description="Building exceptional digital experiences across leading tech companies"
        ctaText="View Full Résumé"
        ctaHref="/resume.pdf"
      />

      <div className="relative">
        {/* Timeline Line - Hidden on very small mobile, visible on sm+ */}
        <div className="hidden sm:block absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-purple-400 to-amber-500 opacity-30" />
        <div
          className="hidden sm:block absolute left-4 sm:left-8 top-0 w-0.5 bg-gradient-to-b from-purple-600 via-purple-400 to-amber-500 transition-all duration-2000 ease-out"
          style={{
            height:
              visibleItems.length > 0
                ? `${(visibleItems.length / experiences.length) * 100}%`
                : "0%",
          }}
        />

        <div className="space-y-8 sm:space-y-12">
          {experiences.map((experience, index) => {
            const isVisible = visibleItems.includes(index);
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`relative transition-all duration-1000 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : `${
                        isEven
                          ? "-translate-x-10 sm:-translate-x-20"
                          : "translate-x-10 sm:translate-x-20"
                      } opacity-0`
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Timeline Dot - Hidden on very small mobile, visible on sm+ */}
                <div className="hidden sm:block absolute left-2.5 sm:left-6 top-6 sm:top-8 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full border-2 sm:border-4 border-background shadow-lg">
                  {isVisible && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full animate-ping" />
                  )}
                </div>

                <div className="sm:ml-12 lg:ml-20">
                  <Card className="hover:shadow-xl transition-all duration-500 group hover:scale-[1.01] sm:hover:scale-[1.02]">
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="space-y-2">
                          <CardTitle className="text-lg sm:text-xl break-words group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                            <Briefcase className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                            <span>{experience.title}</span>
                          </CardTitle>
                          <CardDescription className="text-base sm:text-lg font-medium text-purple-600 dark:text-purple-400">
                            {experience.company}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{experience.period}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>{experience.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {experience.description}
                      </p>

                      <div>
                        <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-purple-600 dark:text-purple-400">
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {experience.achievements.map(
                            (achievement, achievementIndex) => (
                              <li
                                key={achievementIndex}
                                className="flex items-start gap-2 text-xs sm:text-sm"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 mt-1.5 sm:mt-2 flex-shrink-0" />
                                <span className="break-words">
                                  {achievement}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-purple-600 dark:text-purple-400">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {experience.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/50 dark:hover:text-purple-300 transition-colors duration-300"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
