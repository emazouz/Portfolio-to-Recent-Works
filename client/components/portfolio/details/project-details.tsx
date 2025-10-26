"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RelatedProjects } from "@/components/portfolio/related-projects";
import { getLocalizedContent, projectStore } from "@/store/projectStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import NotFound from "../../ui/NotFound";
import { toast } from "@/hooks/use-toast";
import { getProgressPercentage } from "@/handlers/project.handlers";
import CTASection from "./CTA-section";
import ProjectContent from "./project-content";
import {
  ProjectImage,
  ProjectMeta,
  ProjectProgress,
  ProjectTechnologies,
} from "./project-sub";
import ProjectActions from "./project-actions";
import ProjectHeader from "./project-header";
import { Project } from "@/types/project.types";
import { STATUS_MAP } from "@/constants/project.constants";

// --- Main Component ---
export default function ProjectDetails({ id }: { id: number }) {
  const { getProjectById, isLoading, error } = projectStore();
  const [project, setProject] = useState<Project | null>(null);
  const currentLanguage = "en"; // Get from context if needed

  const fetchProject = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const result = await getProjectById(id);

      if (!result.success || !result.data) {
        const errorMsg = result.message || "Project not found";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "error",
        });
        return;
      }

      setProject(result.data);
    } catch (error) {
      console.error("Error fetching project:", error);
      const errorMessage =
        "An unexpected error occurred while fetching the project";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "error",
      });
    }
  }, [id, getProjectById]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const localizedContent = useMemo(
    () => (project ? getLocalizedContent(project, currentLanguage) : null),
    [project, currentLanguage]
  );

  const progressPercentage = useMemo(
    () => (project ? getProgressPercentage(project.status) : 0),
    [project]
  );

  const statusVariant = useMemo(
    () =>
      project
        ? STATUS_MAP[project.status as keyof typeof STATUS_MAP]?.variant
        : "outline",
    [project]
  );

  if (error || !project || !localizedContent) return <NotFound error={error} />;

  return (
    // FIX: Use theme-aware background
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="container py-6">
        {/* FIX: Use theme-aware ghost button hover */}
        <Button
          variant="outline"
          asChild
          className="hover:bg-muted text-foreground"
        >
          <Link href="/portfolio">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="py-8 space-y-4 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Project Info */}
          <div className="space-y-6">
            <ProjectHeader
              project={project}
              localizedContent={localizedContent}
              currentLanguage={currentLanguage}
              statusVariant={statusVariant}
            />

            <ProjectActions
              project={project}
              localizedContent={localizedContent}
            />

            <ProjectTechnologies technologies={project.technologies} />

            {project.status === "IN_PROGRESS" && (
              <ProjectProgress progressPercentage={progressPercentage} />
            )}

            <ProjectMeta project={project} />
          </div>

          {/* Project Image */}
          <ProjectImage
            imageUrl={project.imageUrl}
            title={localizedContent.title}
          />
        </div>
      </section>

      {/* FIX: Separator uses theme-aware color */}
      <Separator className="my-12 bg-border" />

      {/* Detailed Content */}
      <ProjectContent
        localizedContent={localizedContent}
        project={project}
        currentLanguage={currentLanguage}
      />

      <Separator className="my-12 bg-border" />

      {/* Related Projects */}
      <RelatedProjects
        currentProjectId={Number(project.id)}
        category={project.category}
      />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
