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
import Loader from "@/components/ui/Loader";
import { MarkdownContent } from "@/components/markdown/markdown-content";
import { ProjectReviews } from "./ProjectReviews";

// Types
interface LocalizedContent {
  title: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  slug: string;
}

// Helper functions
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
  COMPLETED: { en: "Completed", ar: "مكتمل", variant: "default" as const },
  IN_PROGRESS: {
    en: "In Progress",
    ar: "قيد التطوير",
    variant: "secondary" as const,
  },
  PLANNING: { en: "Planning", ar: "في التخطيط", variant: "outline" as const },
  ON_HOLD: { en: "On Hold", ar: "متوقف", variant: "outline" as const },
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

export default function ProjectDetails({ id }: { id: number }) {
  const { getProjectById } = projectStore();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLanguage = "en"; // Get from context if needed

  const fetchProject = useCallback(async () => {
    if (!id) {
      setError("Invalid project ID");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await getProjectById(id);

      if (!result.success || !result.data) {
        const errorMsg = result.message || "Project not found";
        setError(errorMsg);
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
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
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

  if (isLoading) return <Loader />;
  if (error || !project || !localizedContent) return <NotFound error={error} />;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="container py-6">
        <Button variant="ghost" asChild className="hover:bg-slate-800">
          <Link href="/portfolio">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="py-8 space-y-4">
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

      <Separator className="my-12 bg-slate-800" />

      {/* Detailed Content */}
      <ProjectContent
        localizedContent={localizedContent}
        project={project}
        currentLanguage={currentLanguage}
      />

      <Separator className="my-12 bg-slate-800" />

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

// Sub-components
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
}: ProjectHeaderProps) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline" className="bg-slate-800/50 border-slate-700">
        {getCategoryText(project.category, currentLanguage)}
      </Badge>
      <Badge
        variant={statusVariant}
        className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50"
      >
        {getStatusText(project.status, currentLanguage)}
      </Badge>
      {project.featured && (
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
          <Sparkles className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      )}
    </div>

    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
      {localizedContent.title}
    </h1>

    <div className="text-xl text-slate-400 prose prose-lg dark:prose-invert max-w-none">
      <MarkdownContent content={localizedContent.description} />
    </div>
  </div>
);

interface ProjectActionsProps {
  project: Project;
  localizedContent: LocalizedContent;
}

const ProjectActions = ({ project, localizedContent }: ProjectActionsProps) => (
  <div className="flex flex-wrap gap-3">
    {project.liveUrl && (
      <Button
        size="lg"
        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
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
        className="border-slate-700 hover:bg-slate-800"
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
    <div className="space-y-3 p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
      <h3 className="text-lg font-black text-white">Technologies Used</h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech, index) => (
          <Badge
            key={`${tech}-${index}`}
            variant="secondary"
            className="bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 transition-all"
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
  <div className="space-y-3 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-black text-white">Project Progress</h3>
      <span className="text-sm font-bold text-indigo-400">
        {progressPercentage}%
      </span>
    </div>
    <Progress value={progressPercentage} className="w-full h-2" />
  </div>
);

interface ProjectMetaProps {
  project: Project;
  currentLanguage: string;
}

const ProjectMeta = ({ project }: ProjectMetaProps) => (
  <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
    <div className="flex items-center gap-6 text-sm text-slate-400 flex-wrap">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-indigo-400" />
        <span>Created: {formatDate(project.createdAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-purple-400" />
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
                index < project.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-slate-600"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-slate-400">
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
    <div className="relative overflow-hidden rounded-2xl shadow-2xl group border border-slate-700">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={title}
        width={800}
        height={600}
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  </div>
);

interface ProjectContentProps {
  localizedContent: LocalizedContent;
  project: Project;
  currentLanguage: string;
}

const ProjectContent = ({
  localizedContent,
  project,
  currentLanguage,
}: ProjectContentProps) => (
  <section>
    <div className="prose prose-lg prose-invert max-w-none space-y-8">
      {/* Project Overview */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
        <h2 className="text-3xl font-black text-white mb-4">
          Project Overview
        </h2>
        <div className="text-lg leading-relaxed text-slate-300">
          <MarkdownContent content={localizedContent.description} />
        </div>
      </div>

      {localizedContent.metaDesc && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
          <h2 className="text-3xl font-black text-white mb-4">
            Detailed Information
          </h2>
          <div className="text-slate-300">
            <MarkdownContent content={localizedContent.metaDesc} />
          </div>
        </div>
      )}

      {/* Project Links */}
      {(project.liveUrl || project.githubUrl) && (
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
          <h2 className="text-3xl font-black text-white mb-4">Project Links</h2>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <Button
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
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
                className="border-slate-700 hover:bg-slate-800"
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
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
        <h2 className="text-3xl font-black text-white mb-6">Project Reviews</h2>
        <ProjectReviews projectId={project.id} />
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section>
    <div className="container mx-auto max-w-4xl">
      <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl">
        <h2 className="text-3xl font-black text-white mb-4">
          Interested in Similar Work?
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          I'd love to discuss how I can help bring your project ideas to life
          with the same attention to detail and quality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            asChild
          >
            <Link href="/contact">Start a Project</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            asChild
          >
            <Link href="/portfolio">View More Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
