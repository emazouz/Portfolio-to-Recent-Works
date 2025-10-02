"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github, ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SocialShare } from "@/components/portfolio/SocialShare";
import { RelatedProjects } from "@/components/portfolio/RelatedProjects";
import { Project, projectStore } from "@/store/projectStore";
import { useEffect, useState } from "react";
import NotFound, { ProjectNotFound } from "../ui/NotFound";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";

// Helper functions
function getLocalizedContent(project: Project, language: string) {
  return {
    title: language === "ar" ? project.title_ar : project.title_en,
    description:
      language === "ar" ? project.description_ar : project.description_en,
    metaTitle: language === "ar" ? project.metaTitle_ar : project.metaTitle_en,
    metaDesc: language === "ar" ? project.metaDesc_ar : project.metaDesc_en,
  };
}

function getStatusText(status: string, language: string) {
  const statusMap = {
    COMPLETED: language === "ar" ? "مكتمل" : "Completed",
    IN_PROGRESS: language === "ar" ? "قيد التطوير" : "In Progress",
    PLANNING: language === "ar" ? "في التخطيط" : "Planning",
    ON_HOLD: language === "ar" ? "متوقف" : "On Hold",
  };
  return statusMap[status as keyof typeof statusMap] || status;
}

function getCategoryText(category: string, language: string) {
  const categoryMap = {
    WEB_DEVELOPMENT: language === "ar" ? "تطوير الويب" : "Web Development",
    MOBILE_APP: language === "ar" ? "تطبيق الموبايل" : "Mobile App",
    DESKTOP_APP: language === "ar" ? "تطبيق سطح المكتب" : "Desktop App",
    UI_UX_DESIGN: language === "ar" ? "تصميم واجهات" : "UI/UX Design",
    API_DEVELOPMENT: language === "ar" ? "تطوير API" : "API Development",
    OTHER: language === "ar" ? "أخرى" : "Other",
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
}

function getProgressPercentage(status: string) {
  switch (status) {
    case "COMPLETED":
      return 100;
    case "IN_PROGRESS":
      return 75;
    case "PLANNING":
      return 25;
    case "ON_HOLD":
      return 50;
    default:
      return 0;
  }
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown";
  }
}

export default function ProjectDetails({ id }: { id: number }) {
  const { getProjectById } = projectStore();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      // Validate ID first
      if (!id) {
        setError("Invalid project ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const result = await getProjectById(id);

        if (!result.success) {
          setError(result.message || "Failed to fetch project");
          toast({
            title: "Error",
            description: result.message || "Failed to fetch project",
            variant: "error",
          });
          return;
        }

        if (!result.data) {
          setError("Project not found");
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
    };

    fetchProject();
  }, [id, getProjectById]);

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error or not found state
  if (error || !project) {
    return <NotFound error={error} />;
  }

  const currentLanguage = "en"; // You might want to get this from context
  const localizedContent = getLocalizedContent(project, currentLanguage);
  const progressPercentage = getProgressPercentage(project.status);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/portfolio">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Project Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {getCategoryText(project.category, currentLanguage)}
                  </Badge>
                  <Badge
                    variant={
                      project.status === "COMPLETED"
                        ? "default"
                        : project.status === "IN_PROGRESS"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {getStatusText(project.status, currentLanguage)}
                  </Badge>
                  {project.featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-balance">
                  {localizedContent.title}
                </h1>

                <p className="text-xl text-muted-foreground text-pretty">
                  {localizedContent.description}
                </p>
              </div>

              {/* Project Links */}
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <Button size="lg" asChild>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </a>
                  </Button>
                )}

                {project.githubUrl && (
                  <Button size="lg" variant="outline" asChild>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge key={`${tech}-${index}`} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar for In-Progress Projects */}
              {project.status === "IN_PROGRESS" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Project Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {progressPercentage}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                </div>
              )}

              {/* Project Meta */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Project Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg shadow-2xl group">
                <Image
                  src={project.imageUrl || "/placeholder.svg"}
                  alt={localizedContent.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Detailed Description */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>Project Overview</h2>
            <p>{localizedContent.description}</p>

            <h3>Key Features</h3>
            <ul>
              <li>Modern, responsive design optimized for all devices</li>
              <li>
                High-performance architecture with optimized loading times
              </li>
              <li>Comprehensive user experience with intuitive navigation</li>
              <li>Scalable codebase following industry best practices</li>
            </ul>

            <h3>Technical Challenges</h3>
            <p>
              This project presented several interesting technical challenges
              that required innovative solutions. The implementation focused on
              performance optimization, user experience enhancement, and
              maintainable code architecture.
            </p>

            <h3>Solutions Implemented</h3>
            <p>
              Through careful planning and iterative development, we
              successfully addressed all technical requirements while
              maintaining high code quality and performance standards.
            </p>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Related Projects */}
      <RelatedProjects
        currentProjectId={Number(project.id)}
        category={project.category}
      />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Interested in Similar Work?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'd love to discuss how I can help bring your project ideas to life
            with the same attention to detail and quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/portfolio">View More Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
