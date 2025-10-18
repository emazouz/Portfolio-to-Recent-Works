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
import HeaderSection from "../HeaderSection";

const experiences = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    period: "2022 - Present",
    description:
      "Lead frontend development for a SaaS platform serving 100K+ users. Architected and implemented a component library that reduced development time by 40%. Mentored junior developers and established best practices for code quality.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    achievements: [
      "Improved application performance by 60%",
      "Led migration to TypeScript",
      "Built design system used across 5 products",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    period: "2020 - 2022",
    description:
      "Developed and maintained multiple client projects from concept to deployment. Built responsive web applications, RESTful APIs, and integrated third-party services. Collaborated directly with clients to understand requirements and deliver solutions.",
    technologies: ["Vue.js", "Node.js", "Express", "MongoDB", "AWS"],
    achievements: [
      "Delivered 15+ client projects on time",
      "Reduced server costs by 30% through optimization",
      "Implemented CI/CD pipelines",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Pro",
    location: "New York, NY",
    period: "2019 - 2020",
    description:
      "Created pixel-perfect, responsive websites for various clients including e-commerce platforms, corporate websites, and landing pages. Worked closely with designers to implement complex UI/UX designs.",
    technologies: ["HTML5", "CSS3", "JavaScript", "jQuery", "WordPress"],
    achievements: [
      "Built 25+ responsive websites",
      "Achieved 95+ PageSpeed scores",
      "Increased client conversion rates by 25%",
    ],
  },
];

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
      { threshold: 0.3 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleItems]);

  return (
    <section id="experience" ref={sectionRef} className="py-20">
      <HeaderSection
        icon={<Sparkles className="animate-pulse" />}
        badgeTitle="PROFESSIONAL JOURNEY"
        title="Work Experience"
        description="Building exceptional digital experiences across leading tech
                 companies"
        ctaText={`View Full Résumé`}
        ctaHref="/resume.pdf"
      />

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-purple-400 to-amber-500 opacity-30" />
        <div
          className="absolute left-8 top-0 w-0.5 bg-gradient-to-b from-purple-600 via-purple-400 to-amber-500 transition-all duration-2000 ease-out"
          style={{
            height:
              visibleItems.length > 0
                ? `${(visibleItems.length / experiences.length) * 100}%`
                : "0%",
          }}
        />

        <div className="space-y-12">
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
                        isEven ? "-translate-x-20" : "translate-x-20"
                      } opacity-0`
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="absolute left-6 top-8 w-4 h-4 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full border-4 border-background shadow-lg">
                  {isVisible && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full animate-ping" />
                  )}
                </div>

                <div className="ml-20">
                  <Card className="hover:shadow-xl transition-all duration-500 group hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <CardTitle className="text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                            <Briefcase className="inline-block w-5 h-5 mr-2" />
                            {experience.title}
                          </CardTitle>
                          <CardDescription className="text-lg font-medium text-purple-600 dark:text-purple-400">
                            {experience.company}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {experience.period}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {experience.location}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {experience.description}
                      </p>

                      <div>
                        <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {experience.achievements.map(
                            (achievement, achievementIndex) => (
                              <li
                                key={achievementIndex}
                                className="flex items-start gap-2 text-sm"
                              >
                                <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-purple-600 to-amber-500 mt-2 flex-shrink-0" />
                                {achievement}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/50 dark:hover:text-purple-300 transition-colors duration-300"
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
