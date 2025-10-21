"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  Calendar,
  Clock,
  Star,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialShare } from "@/components/portfolio/SocialShare";
import { RelatedProjects } from "@/components/portfolio/RelatedProjects";
import { Project, projectStore } from "@/store/projectStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import NotFound from "../ui/NotFound";
import { toast } from "@/hooks/use-toast";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { ProjectReviews } from "./ProjectReviews";

// --- Theme Mapping ---
// Helper function to map chart key to CSS variable string
const getChartGradientVar = (gradientKey: string) => {
  return `var(--${gradientKey})`;
};

interface ProjectContentProps {
  localizedContent: LocalizedContent;
  project: Project;
  currentLanguage: string;
}

const CHART_GRADIENT_PRIMARY = getChartGradientVar("chart-1");
const CHART_GRADIENT_SECONDARY = getChartGradientVar("chart-4"); // Amber/Orange for featured

// Types & Utility Functions (UNCHANGED)
interface LocalizedContent {
  title: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  slug: string;
}

const getLocalizedContent = (
  project: Project,
  language: string
): LocalizedContent => ({
  title: language === "ar" ? project.title_ar : project.title_en,
  description:
    language === "ar" ? project.description_ar : project.description_en,
  metaTitle: language === "ar" ? project.metaTitle_ar : project.metaTitle_en,
  metaDesc: language === "ar" ? project.metaDesc_ar : project.metaDesc_en,
  slug: language === "ar" ? project.slug_ar : project.slug_en,
});

const STATUS_MAP = {
  COMPLETED: {
    en: "Completed",
    ar: "مكتمل",
    variant: "default" as const,
    gradient: "chart-5",
  },
  IN_PROGRESS: {
    en: "In Progress",
    ar: "قيد التطوير",
    variant: "secondary" as const,
    gradient: "chart-3",
  },
  PLANNING: {
    en: "Planning",
    ar: "في التخطيط",
    variant: "outline" as const,
    gradient: "chart-4",
  },
  ON_HOLD: {
    en: "On Hold",
    ar: "متوقف",
    variant: "outline" as const,
    gradient: "chart-7",
  },
};

const CATEGORY_MAP = {
  WEB_DEVELOPMENT: { en: "Web Development", ar: "تطوير الويب" },
  MOBILE_APP: { en: "Mobile App", ar: "تطبيق الموبايل" },
  DESKTOP_APP: { en: "Desktop App", ar: "تطبيق سطح المكتب" },
  UI_UX_DESIGN: { en: "UI/UX Design", ar: "تصميم واجهات" },
  API_DEVELOPMENT: { en: "API Development", ar: "تطوير API" },
  OTHER: { en: "Other", ar: "أخرى" },
};

const STATUS_PROGRESS = {
  COMPLETED: 100,
  IN_PROGRESS: 75,
  PLANNING: 25,
  ON_HOLD: 50,
};

const getStatusText = (status: string, language: string): string => {
  return (
    STATUS_MAP[status as keyof typeof STATUS_MAP]?.[language as "en" | "ar"] ||
    status
  );
};

const getCategoryText = (category: string, language: string): string => {
  return (
    CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]?.[
      language as "en" | "ar"
    ] || category
  );
};

const getProgressPercentage = (status: string): number => {
  return STATUS_PROGRESS[status as keyof typeof STATUS_PROGRESS] || 0;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
};

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
          variant="ghost"
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

            <ProjectMeta project={project} currentLanguage={currentLanguage} />
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

// --- Sub-components ---

interface ProjectHeaderProps {
  project: Project;
  localizedContent: LocalizedContent;
  currentLanguage: string;
  statusVariant: "default" | "secondary" | "outline";
}

const ProjectHeader = ({
  project,
  localizedContent,
  currentLanguage,
  statusVariant,
}: ProjectHeaderProps) => {
  // Get the gradient variable for the status badge
  const statusGradientKey =
    STATUS_MAP[project.status as keyof typeof STATUS_MAP]?.gradient;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Category Badge: FIX - Use theme-aware muted/border */}
        <Badge
          variant="outline"
          className="bg-muted/50 border-border text-muted-foreground"
        >
          {getCategoryText(project.category, currentLanguage)}
        </Badge>
        {/* Status Badge: FIX - Use inline style for gradient color */}
        <Badge
          variant={statusVariant}
          className="text-primary-foreground border-0"
          style={{ backgroundImage: getChartGradientVar(statusGradientKey) }}
        >
          {getStatusText(project.status, currentLanguage)}
        </Badge>
        {project.featured && (
          // Featured Badge: FIX - Use inline style for gradient color
          <Badge
            className="text-primary-foreground border-0 animate-pulse"
            style={{ backgroundImage: CHART_GRADIENT_SECONDARY }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>

      {/* Title: FIX - Use foreground color */}
      <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
        {localizedContent.title}
      </h1>

      {/* Description: FIX - Use muted-foreground */}
      <div className="text-xl text-muted-foreground prose prose-lg dark:prose-invert max-w-none">
        <MarkdownContent content={localizedContent.description} />
      </div>
    </div>
  );
};

interface ProjectActionsProps {
  project: Project;
  localizedContent: LocalizedContent;
}

const ProjectActions = ({ project, localizedContent }: ProjectActionsProps) => (
  <div className="flex flex-wrap gap-3">
    {project.liveUrl && (
      <Button
        size="lg"
        // FIX: Primary button uses theme primary colors
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        asChild
      >
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Live
        </a>
      </Button>
    )}

    {project.githubUrl && (
      <Button
        size="lg"
        variant="outline"
        // FIX: Outline button uses theme border/muted hover
        className="border-border hover:bg-muted text-foreground"
        asChild
      >
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <Github className="w-4 h-4 mr-2" />
          View Code
        </a>
      </Button>
    )}

    <SocialShare
      title={localizedContent.title}
      url={`/portfolio/view/${project.id}`}
    />
  </div>
);

const ProjectTechnologies = ({ technologies }: { technologies?: string[] }) => {
  if (!technologies || technologies.length === 0) return null;

  return (
    // FIX: Use theme-aware card/border styles
    <div className="space-y-3 p-6 rounded-2xl bg-card border border-border">
      {/* FIX: Title uses foreground color */}
      <h3 className="text-lg font-black text-foreground">Technologies Used</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          // FIX: Tech badges use muted/border/foreground colors
          <Badge
            key={`${tech}-${index}`}
            variant="secondary"
            className="bg-muted/50 border border-border hover:border-primary/50 transition-all text-muted-foreground"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ProjectProgress = ({
  progressPercentage,
}: {
  progressPercentage: number;
}) => (
  // FIX: Use theme-aware card/border styles
  <div className="space-y-3 p-6 rounded-2xl bg-card border border-border">
    <div className="flex items-center justify-between">
      {/* FIX: Title uses foreground color */}
      <h3 className="text-lg font-black text-foreground">Project Progress</h3>
      {/* FIX: Progress text uses primary color */}
      <span className="text-sm font-bold text-primary">
        {progressPercentage}%
      </span>
    </div>
    {/* Progress bar relies on shadcn-ui's theme handling for coloring */}
    <Progress value={progressPercentage} className="w-full h-2" />
  </div>
);

interface ProjectMetaProps {
  project: Project;
  currentLanguage: string;
}

const ProjectMeta = ({ project }: ProjectMetaProps) => (
  // FIX: Use theme-aware card/border styles
  <div className="space-y-4 p-6 rounded-2xl bg-card border border-border">
    {/* Meta text uses muted-foreground */}
    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
      <div className="flex items-center gap-2">
        {/* FIX: Icon uses primary color */}
        <Calendar className="w-4 h-4 text-primary" />
        <span>Created: {formatDate(project.createdAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* FIX: Icon uses primary color (Clock uses the same theme color as Calendar) */}
        <Clock className="w-4 h-4 text-primary" />
        <span>Updated: {formatDate(project.updatedAt)}</span>
      </div>
    </div>

    {project.rating && (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                // FIX: Star rating uses secondary color
                index < project.rating
                  ? "text-secondary fill-secondary"
                  : "text-muted-foreground/50"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {project.rating.toFixed(1)}
          {project.ratingsCount && ` (${project.ratingsCount} reviews)`}
        </span>
      </div>
    )}
  </div>
);

const ProjectImage = ({
  imageUrl,
  title,
}: {
  imageUrl?: string;
  title: string;
}) => (
  <div className="relative">
    {/* FIX: Image container uses theme-aware border */}
    <div className="relative overflow-hidden rounded-2xl shadow-2xl group border border-border">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        width={800}
        height={600}
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
        priority
      />
      {/* Overlay: FIX - Uses background color for fade effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  </div>
);

const ProjectContent = ({
  localizedContent,
  project,
  currentLanguage,
}: ProjectContentProps) => (
  <section className="container">
    {/* FIX: Use theme-aware styles for content container */}
    <div className="prose prose-lg prose-invert max-w-none space-y-8">
      {/* Project Overview */}
      <div className="p-8 rounded-2xl bg-card border border-border">
        <h2 className="text-3xl font-black text-foreground mb-4">
          Project Overview
        </h2>
        <div className="text-lg leading-relaxed text-muted-foreground">
          <MarkdownContent content={localizedContent.description} />
        </div>
      </div>

      {localizedContent.metaDesc && (
        <div className="p-8 rounded-2xl bg-card border border-border">
          <h2 className="text-3xl font-black text-foreground mb-4">
            Detailed Information
          </h2>
          <div className="text-muted-foreground">
            <MarkdownContent content={localizedContent.metaDesc} />
          </div>
        </div>
      )}

      {/* Project Links */}
      {(project.liveUrl || project.githubUrl) && (
        <div className="p-8 rounded-2xl bg-card border border-border">
          <h2 className="text-3xl font-black text-foreground mb-4">
            Project Links
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button
                variant="outline"
                className="border-border hover:bg-muted text-foreground"
                asChild
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="outline"
                className="border-border hover:bg-muted text-foreground"
                asChild
              >
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Source Code
                </a>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Project Reviews */}
      <div className="p-8 rounded-2xl bg-card border border-border">
        <h2 className="text-3xl font-black text-foreground mb-6">
          Project Reviews
        </h2>
        <ProjectReviews projectId={project.id} />
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="container">
    <div className="wrapper">
      {/* FIX: Use theme-aware primary/border styles */}
      <div className="text-center p-12 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-xl">
        <h2 className="text-3xl font-black text-foreground mb-4">
          Interested in Similar Work?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          I'd love to discuss how I can help bring your project ideas to life
          with the same attention to detail and quality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href="/contact">Start a Project</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted text-foreground"
            asChild
          >
            <Link href="/portfolio">View More Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
