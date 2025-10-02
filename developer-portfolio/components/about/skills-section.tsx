"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "Build a Spotify Connected App",
    description:
      "Video course that teaches how to build a web app with the Spotify Web API. Topics covered include the principles of REST APIs, user auth flows, Node, Express, React, Styled Components, and more.",
    tech: ["React", "Express", "Node.js", "Spotify API"],
    link: "#",
    image: "/project-spotify.png",
  },
  {
    title: "Halcyon Theme",
    description:
      "A minimal, dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more. Available on Visual Studio Marketplace, Package Control, Atom Package Manager, and npm.",
    tech: ["VS Code", "Sublime Text", "Atom", "iTerm"],
    link: "#",
    image: "/project-halcyon.png",
  },
  {
    title: "Spotify Profile",
    description:
      "A web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track.",
    tech: ["React", "Express", "Spotify API", "Heroku"],
    link: "#",
    image: "/project-profile.png",
  },
];

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
    <section id="projects" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div key={index} className="group">
                <a href={project.link} className="block">
                  <div className="flex flex-col md:flex-row gap-6 p-6 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="md:w-1/3">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 md:h-32 object-cover rounded border border-border"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-3">
                      <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                        {project.title} ↗
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          <div className="pt-8">
            <a
              href="#"
              className="inline-flex items-center text-sm font-medium hover:text-accent transition-colors"
            >
              View Full Project Archive ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
