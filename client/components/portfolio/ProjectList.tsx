"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Github, Eye, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Project, projectStore } from "@/store/projectStore";
import { toast } from "@/hooks/use-toast";

// Types
interface LocalizedContent {
  title: string;
  description: string;
}

interface CategoryFilter {
  key: string;
  label: string;
  value?: string;
}

// Constants
const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Web Development", value: "WEB_DEVELOPMENT" },
  { key: "mobile", label: "Mobile App", value: "MOBILE_APP" },
  { key: "desktop", label: "Desktop App", value: "DESKTOP_APP" },
  { key: "api", label: "API Development", value: "API_DEVELOPMENT" },
  { key: "ui", label: "UI/UX Design", value: "UI_UX_DESIGN" },
  { key: "other", label: "Other", value: "OTHER" },
];

// Utility Functions
function getLocalizedContent(
  project: Project,
  language: string = "en"
): LocalizedContent {
  return {
    title:
      language === "ar" && project.title_ar
        ? project.title_ar
        : project.title_en,
    description:
      language === "ar" && project.description_ar
        ? project.description_ar
        : project.description_en,
  };
}

function getStatusText(status: string, language: string = "en"): string {
  const statusMap = {
    COMPLETED: language === "ar" ? "مكتمل" : "Completed",
    IN_PROGRESS: language === "ar" ? "قيد التطوير" : "In Progress",
    PLANNING: language === "ar" ? "في التخطيط" : "Planning",
    ON_HOLD: language === "ar" ? "متوقف مؤقتاً" : "On Hold",
  };
  return statusMap[status as keyof typeof statusMap] || status;
}

function getCategoryText(category: string, language: string = "en"): string {
  const categoryMap = {
    WEB_DEVELOPMENT: language === "ar" ? "تطوير الويب" : "Web Development",
    MOBILE_APP: language === "ar" ? "تطبيق الجوال" : "Mobile App",
    DESKTOP_APP: language === "ar" ? "تطبيق سطح المكتب" : "Desktop App",
    API_DEVELOPMENT: language === "ar" ? "تطوير API" : "API Development",
    UI_UX_DESIGN: language === "ar" ? "تصميم UI/UX" : "UI/UX Design",
    OTHER: language === "ar" ? "أخرى" : "Other",
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "PLANNING":
      return "outline";
    case "ON_HOLD":
      return "destructive";
    default:
      return "secondary";
  }
}

// Project Card Components
function FeaturedProjectCard({
  project,
  language,
}: {
  project: Project;
  language: string;
}) {
  const localizedContent = getLocalizedContent(project, language);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Image
          src={project.imageUrl || "/placeholder.svg?height=400&width=600"}
          alt={localizedContent.title}
          width={600}
          height={400}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg?height=400&width=600";
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge variant={getStatusBadgeVariant(project.status)}>
            {getStatusText(project.status, language)}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl line-clamp-2">
            {localizedContent.title}
          </CardTitle>
          <Badge variant="outline" className="shrink-0">
            {getCategoryText(project.category, language)}
          </Badge>
        </div>
        <CardDescription className="text-base line-clamp-3">
          {localizedContent.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.slice(0, 6).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies && project.technologies.length > 6 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 6} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" asChild>
          <Link href={`/portfolio/${project.slug_en || project.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>
        {project.liveUrl && (
          <Button size="sm" variant="outline" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </Button>
        )}
        {project.githubUrl && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function ProjectCard({
  project,
  language,
}: {
  project: Project;
  language: string;
}) {
  const localizedContent = getLocalizedContent(project, language);

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <Image
          src={project.imageUrl || "/placeholder.svg?height=250&width=400"}
          alt={localizedContent.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg?height=250&width=400";
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant={getStatusBadgeVariant(project.status)}
            className="text-xs"
          >
            {getStatusText(project.status, language)}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">
            {localizedContent.title}
          </CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {getCategoryText(project.category, language)}
          </Badge>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {localizedContent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {project.technologies?.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies && project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button size="sm" className="flex-1" asChild>
          <Link href={`/portfolio/view/${project.id}`}>
            <Eye className="w-3 h-3 mr-1" />
            View
          </Link>
        </Button>
        {project.liveUrl && (
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Demo
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Main Component
export default function ProjectList() {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentLanguage] = useState<string>("en"); // This could come from a language context
  
  const [projects, setProjects] = useState<Project[]>([]);
  // Store hook
  const { getProjects } = projectStore();

  // Data fetching
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProjects(
          {},
          { sortBy: "sortOrder", sortOrder: "asc" }
        );

        if (!result.success) {
          setError(result.message || "Failed to fetch projects");
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
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("An unexpected error occurred while fetching projects");
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching projects",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [getProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") {
      return projects;
    }

    const categoryValue = CATEGORY_FILTERS.find(
      (cat) => cat.key === selectedCategory
    )?.value;
    return projects.filter((project) => project.category === categoryValue);
  }, [projects, selectedCategory]);

  // Featured projects
  const featuredProjects = useMemo(() => {
    return filteredProjects.filter((project) => project.featured);
  }, [filteredProjects]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Loading Portfolio</h2>
          <p className="text-muted-foreground">Fetching latest projects...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-2xl font-semibold">Unable to Load Portfolio</h2>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            My <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Explore my latest projects and development work. Each project
            represents a unique challenge and showcases different aspects of
            modern web development.
          </p>
          {projects.length > 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              {projects.length} project{projects.length !== 1 ? "s" : ""} •{" "}
              {featuredProjects.length} featured
            </p>
          )}
        </div>
      </section>

      {/* Filter Section */}
      {projects.length > 0 && (
        <section className="py-8 px-4 border-b">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORY_FILTERS.map((category) => (
                <Button
                  key={category.key}
                  variant={
                    category.key === selectedCategory ? "default" : "outline"
                  }
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            {filteredProjects.length !== projects.length && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            )}
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {featuredProjects.map((project) => (
                <FeaturedProjectCard
                  key={project.id}
                  project={project}
                  language={currentLanguage}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects Section */}
      {filteredProjects.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {featuredProjects.length > 0 ? "All Projects" : "Projects"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  language={currentLanguage}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && projects.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-2xl font-semibold">No Projects Found</h3>
              <p className="text-muted-foreground">
                No projects match the selected category. Try selecting a
                different filter.
              </p>
              <Button
                onClick={() => setSelectedCategory("all")}
                variant="outline"
              >
                View All Projects
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* No Projects State */}
      {projects.length === 0 && !isLoading && (
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-2xl font-semibold">No Projects Yet</h3>
              <p className="text-muted-foreground">
                Projects will appear here once they're published.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Interested in Working Together?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects and opportunities. Let's
            create something amazing together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Get In Touch</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More About Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
