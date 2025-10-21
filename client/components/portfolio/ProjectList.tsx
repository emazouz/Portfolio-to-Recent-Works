"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ExternalLink,
  Github,
  Eye,
  Loader2,
  AlertCircle,
  Sparkles,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { projectStore, Project } from "@/store/projectStore";
import Link from "next/link";

interface CategoryFilter {
  key: string;
  label: string;
  value?: string;
  gradient: string;
}

const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: "all", label: "All Projects", gradient: "chart-1" },
  {
    key: "web",
    label: "Web Development",
    value: "WEB_DEVELOPMENT",
    gradient: "chart-3",
  },
  {
    key: "mobile",
    label: "Mobile App",
    value: "MOBILE_APP",
    gradient: "chart-5",
  },
  {
    key: "desktop",
    label: "Desktop App",
    value: "DESKTOP_APP",
    gradient: "chart-4",
  },
  {
    key: "api",
    label: "API Development",
    value: "API_DEVELOPMENT",
    gradient: "chart-7",
  },
  {
    key: "ui",
    label: "UI/UX Design",
    value: "UI_UX_DESIGN",
    gradient: "chart-2",
  },
  { key: "other", label: "Other", value: "OTHER", gradient: "chart-6" },
];

const STATUS_VARIANTS = {
  COMPLETED: { variant: "default" as const, gradient: "chart-5" },
  IN_PROGRESS: { variant: "secondary" as const, gradient: "chart-3" },
  PLANNING: { variant: "outline" as const, gradient: "chart-4" },
  ON_HOLD: { variant: "destructive" as const, gradient: "chart-7" },
};

const STATUS_MAP = {
  COMPLETED: { en: "Completed", ar: "مكتمل" },
  IN_PROGRESS: { en: "In Progress", ar: "قيد التطوير" },
  PLANNING: { en: "Planning", ar: "في التخطيط" },
  ON_HOLD: { en: "On Hold", ar: "متوقف مؤقتاً" },
};

const CATEGORY_MAP = {
  WEB_DEVELOPMENT: { en: "Web Development", ar: "تطوير الويب" },
  MOBILE_APP: { en: "Mobile App", ar: "تطبيق الجوال" },
  DESKTOP_APP: { en: "Desktop App", ar: "تطبيق سطح المكتب" },
  API_DEVELOPMENT: { en: "API Development", ar: "تطوير API" },
  UI_UX_DESIGN: { en: "UI/UX Design", ar: "تصميم UI/UX" },
  OTHER: { en: "Other", ar: "أخرى" },
};

const getLocalizedContent = (project: Project, language: string = "en") => ({
  title:
    language === "ar" && project.title_ar ? project.title_ar : project.title_en,
  description:
    language === "ar" && project.description_ar
      ? project.description_ar
      : project.description_en,
});

const getStatusText = (status: string, language: string = "en"): string => {
  return (
    STATUS_MAP[status as keyof typeof STATUS_MAP]?.[language as "en" | "ar"] ||
    status
  );
};

const getCategoryText = (category: string, language: string = "en"): string => {
  return (
    CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]?.[
      language as "en" | "ar"
    ] || category
  );
};

interface ProjectCardProps {
  project: Project;
  language: string;
  featured?: boolean;
}

function ProjectCard({
  project,
  language,
  featured = false,
}: ProjectCardProps) {
  const localizedContent = getLocalizedContent(project, language);
  const statusConfig =
    STATUS_VARIANTS[project.status] || STATUS_VARIANTS.IN_PROGRESS;

  return (
    <div className="group relative transition-all duration-700 hover:-translate-y-2">
      <Card className="relative h-full overflow-hidden border-2 border-border hover:border-transparent transition-all duration-500">
        {/* Animated Gradient Border */}
        <div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `var(--${statusConfig.gradient})`,
            filter: "blur(16px)",
          }}
          aria-hidden="true"
        />

        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={project.imageUrl}
            alt={localizedContent.title}
            className={`w-full ${
              featured ? "h-64" : "h-48"
            } object-cover group-hover:scale-110 transition-transform duration-700`}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <Badge
              className="text-white border-0 shadow-lg"
              style={{ background: `var(--${statusConfig.gradient})` }}
            >
              {getStatusText(project.status, language)}
            </Badge>
            {project.featured && (
              <Badge
                className="text-white border-0 animate-pulse shadow-lg"
                style={{ background: `var(--chart-4)` }}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <CardHeader className={featured ? "pb-4" : "pb-3"}>
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              className={`${
                featured ? "text-xl" : "text-lg"
              } line-clamp-2 group-hover:text-transparent bg-clip-text transition-all`}
              style={{ backgroundImage: `var(--chart-1)` }}
            >
              {localizedContent.title}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              {getCategoryText(project.category, language)}
            </Badge>
          </div>
          <CardDescription
            className={`${
              featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
            }`}
          >
            {localizedContent.description}
          </CardDescription>
        </CardHeader>

        {/* Technologies */}
        <CardContent className={featured ? "pb-4" : "pt-0 pb-4"}>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, featured ? 6 : 3).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs hover:border-primary/50 transition-all"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies &&
              project.technologies.length > (featured ? 6 : 3) && (
                <Badge variant="secondary" className="text-xs">
                  +{project.technologies.length - (featured ? 6 : 3)}
                </Badge>
              )}
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className={`flex gap-2 ${featured ? "pt-0" : "pt-0"}`}>
          <Button size="sm" className="flex-1" asChild>
            <Link href={`/portfolio/view/${project.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </Button>
          {project.liveUrl && (
            <Button size="sm" variant="outline" asChild>
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </Link>
            </Button>
          )}
          {project.githubUrl && featured && (
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

        {/* Bottom Accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: `var(--${statusConfig.gradient})` }}
          aria-hidden="true"
        />
      </Card>
    </div>
  );
}

export default function ProjectList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentLanguage] = useState<string>("en");
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
    } catch (error) {
      console.error("Error fetching projects:", error);
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

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    const categoryValue = CATEGORY_FILTERS.find(
      (cat) => cat.key === selectedCategory
    )?.value;
    return projects.filter((project) => project.category === categoryValue);
  }, [projects, selectedCategory]);

  const featuredProjects = useMemo(() => {
    return filteredProjects.filter((project) => project.featured);
  }, [filteredProjects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Loading Portfolio
          </h2>
          <p className="text-muted-foreground">Fetching latest projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">
            Unable to Load Portfolio
          </h2>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 px-5 py-2.5">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            PORTFOLIO SHOWCASE
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-foreground">
            My{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--chart-1)" }}
            >
              Portfolio
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Explore my latest projects and development work. Each project
            represents a unique challenge and showcases different aspects of
            modern web development.
          </p>

          {projects.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {projects.length} project{projects.length !== 1 ? "s" : ""} •{" "}
              {featuredProjects.length} featured
            </p>
          )}
        </div>
      </section>

      {/* Filter Section */}
      {projects.length > 0 && (
        <section className="mb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-foreground">
                Filter by Category
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORY_FILTERS.map((category) => (
                <Button
                  key={category.key}
                  variant={
                    category.key === selectedCategory ? "default" : "outline"
                  }
                  size="sm"
                  className={`rounded-full transition-all ${
                    category.key === selectedCategory
                      ? "text-white border-0 hover:scale-105"
                      : ""
                  }`}
                  style={
                    category.key === selectedCategory
                      ? { background: `var(--${category.gradient})` }
                      : {}
                  }
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-foreground mb-8 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  language={currentLanguage}
                  featured
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      {filteredProjects.length > 0 && (
        <section className="mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-foreground mb-8 text-center">
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
        <section className="mb-16">
          <div className="max-w-7xl mx-auto text-center p-12 rounded-2xl bg-card border border-border">
            <h3 className="text-2xl font-black text-foreground mb-4">
              No Projects Found
            </h3>
            <p className="text-muted-foreground mb-6">
              No projects match the selected category. Try selecting a different
              filter.
            </p>
            <Button onClick={() => setSelectedCategory("all")}>
              View All Projects
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section>
        <div className="max-w-7xl mx-auto">
          <div className="text-center p-12 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-xl">
            <h2 className="text-3xl font-black text-foreground mb-4">
              Interested in Working Together?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects and opportunities.
              Let's create something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">Get In Touch</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/about">Learn More About Me</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
