"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Award, TrendingUp } from "lucide-react";

const projects = [
  {
    title: "Build a Spotify Connected App",
    description:
      "Comprehensive video course teaching web app development with the Spotify Web API. Master REST API principles, authentication flows, and modern full-stack technologies.",
    tech: ["React", "Express", "Node.js", "Spotify API"],
    link: "#",
    github: "#",
    image: "/project-spotify.png",
    category: "Full Stack",
    featured: true,
  },
  {
    title: "Halcyon Theme",
    description:
      "A beautifully crafted minimal dark blue theme for developers. Available across multiple platforms including VS Code, Sublime Text, Atom, and iTerm with thousands of downloads.",
    tech: ["VS Code", "Sublime Text", "Atom", "iTerm"],
    link: "#",
    github: "#",
    image: "/project-halcyon.png",
    category: "Design System",
    featured: true,
  },
  {
    title: "Spotify Profile",
    description:
      "Interactive web application for visualizing personalized Spotify data. Discover your top artists, tracks, listening history, and dive deep into audio analytics.",
    tech: ["React", "Express", "Spotify API", "Heroku"],
    link: "#",
    github: "#",
    image: "/project-profile.png",
    category: "Data Visualization",
    featured: false,
  },
];

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            className={`text-center mb-20 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm mb-6">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 font-semibold text-sm">
                Featured Work
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                Projects & Skills
              </span>
            </h2>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              A selection of projects showcasing expertise in modern web
              development, API integration, and developer tools
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-8 mb-12">
            {projects.map((project, index) => (
              <div
                key={index}
                className={`group transition-all duration-700 delay-${
                  index * 100
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative">
                  {/* Card */}
                  <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

                    <div className="relative flex flex-col md:flex-row">
                      {/* Image Section */}
                      <div className="md:w-2/5 relative overflow-hidden">
                        <div className="aspect-video md:aspect-square relative">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent opacity-60" />

                          {/* Category badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-slate-300 text-xs font-semibold rounded-full">
                              {project.category}
                            </span>
                          </div>

                          {/* Featured badge */}
                          {project.featured && (
                            <div className="absolute top-4 right-4">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-full">
                                <TrendingUp className="w-3 h-3 text-white" />
                                <span className="text-white text-xs font-bold">
                                  Featured
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="md:w-3/5 p-8">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
                            {project.title}
                          </h3>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                            <a
                              href={project.link}
                              className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-500/20 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 group/btn"
                              aria-label="View project"
                            >
                              <ExternalLink className="w-4 h-4 text-slate-400 group-hover/btn:text-indigo-400" />
                            </a>
                            <a
                              href={project.github}
                              className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-500/20 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 group/btn"
                              aria-label="View source code"
                            >
                              <Github className="w-4 h-4 text-slate-400 group-hover/btn:text-indigo-400" />
                            </a>
                          </div>
                        </div>

                        <p className="text-slate-400 leading-relaxed mb-6 text-base">
                          {project.description}
                        </p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-4 py-2 bg-slate-800/50 hover:bg-indigo-500/10 border border-slate-700/50 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-300 text-sm font-medium rounded-lg transition-all duration-300 cursor-default"
                              style={{ transitionDelay: `${techIndex * 50}ms` }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Glow effect */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10 ${
                      hoveredIndex === index ? "opacity-20" : ""
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* View More CTA */}
          <div
            className={`text-center transition-all duration-1000 delay-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="#"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:from-indigo-500/20 hover:to-purple-500/20 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl text-slate-300 hover:text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20"
            >
              <span>View Full Project Archive</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </a>
          </div>

          {/* Stats Section */}
          <div
            className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {[
              { label: "Projects Completed", value: "50+" },
              { label: "Technologies Mastered", value: "25+" },
              { label: "Years Experience", value: "8+" },
              { label: "Client Satisfaction", value: "100%" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300 text-center group"
              >
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
