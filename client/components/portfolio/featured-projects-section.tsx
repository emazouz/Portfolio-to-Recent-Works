"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HeaderSection from "../header-section";
import ProjectCard from "./project-card";
import { projectStore } from "@/store/projectStore";
import { toast } from "@/hooks/use-toast";
import { Project } from "@/types/project.types";

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { getProjects, isLoading, error } = projectStore();

  const fetchProjects = useCallback(async () => {
    try {
      const result = await getProjects(
        {},
        { sortBy: "sortOrder", sortOrder: "asc" }
      );

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch projects",
          variant: "error",
        });
        return;
      }

      if (result.data?.data) {
        setProjects(result.data.data);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching projects",
        variant: "error",
      });
    }
  }, [getProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Error state
  if (error) {
    return (
      <section className="wrapper">
        <HeaderSection
          icon={<BriefcaseBusiness className="animate-pulse" />}
          badgeTitle="Portfolio"
          title="Featured Projects"
          description="Explore my latest work and case studies showcasing innovative solutions across web development, design, and technology."
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Unable to load projects. Please try again later.
          </p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <section className="wrapper">
        <HeaderSection
          icon={<BriefcaseBusiness className="animate-pulse" />}
          badgeTitle="Portfolio"
          title="Featured Projects"
          description="Explore my latest work and case studies showcasing innovative solutions across web development, design, and technology."
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="wrapper">
      <HeaderSection
        icon={<BriefcaseBusiness className="animate-pulse" />}
        badgeTitle="Portfolio"
        title="Featured Projects"
        description="Explore my latest work and case studies showcasing innovative solutions across web development, design, and technology."
        ctaText={`Explore All ${projects.length}+ Projects`}
        ctaHref="/projects"
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
