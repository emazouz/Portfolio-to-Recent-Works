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
import {
  ExternalLink,
  Github,
  Eye,
  Loader2,
  AlertCircle,
  Sparkles,
  Filter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  gradient: string;
}

// Constants
const CATEGORY_FILTERS: CategoryFilter[] = [
  {
    key: "all",
    label: "All Projects",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    key: "web",
    label: "Web Development",
    value: "WEB_DEVELOPMENT",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "mobile",
    label: "Mobile App",
    value: "MOBILE_APP",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    key: "desktop",
    label: "Desktop App",
    value: "DESKTOP_APP",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    key: "api",
    label: "API Development",
    value: "API_DEVELOPMENT",
    gradient: "from-orange-500 to-red-500",
  },
  {
    key: "ui",
    label: "UI/UX Design",
    value: "UI_UX_DESIGN",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    key: "other",
    label: "Other",
    value: "OTHER",
    gradient: "from-purple-500 to-violet-500",
  },
];

const STATUS_VARIANTS = {
  COMPLETED: {
    variant: "default" as const,
    gradient: "from-green-500 to-emerald-500",
  },
  IN_PROGRESS: {
    variant: "secondary" as const,
    gradient: "from-blue-500 to-cyan-500",
  },
  PLANNING: {
    variant: "outline" as const,
    gradient: "from-yellow-500 to-amber-500",
  },
  ON_HOLD: {
    variant: "destructive" as const,
    gradient: "from-red-500 to-rose-500",
  },
};

// Utility Functions
const getLocalizedContent = (
  project: Project,
  language: string = "en"
): LocalizedContent => ({
  title:
    language === "ar" && project.title_ar ? project.title_ar : project.title_en,
  description:
    language === "ar" && project.description_ar
      ? project.description_ar
      : project.description_en,
});

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

// Project Card Components
interface ProjectCardProps {
  project: Project;
  language: string;
  featured?: boolean;
}

const ProjectCardComponent = ({
  project,
  language,
  featured = false,
}: ProjectCardProps) => {
  const localizedContent = getLocalizedContent(project, language);
  const statusConfig =
    STATUS_VARIANTS[project.status as keyof typeof STATUS_VARIANTS] ||
    STATUS_VARIANTS.IN_PROGRESS;

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={localizedContent.title}
          width={featured ? 600 : 400}
          height={featured ? 400 : 250}
          className={`w-full ${
            featured ? "h-64" : "h-48"
          } object-cover group-hover:scale-110 transition-transform duration-700`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            className={`bg-gradient-to-r ${statusConfig.gradient} text-white border-0`}
          >
            {getStatusText(project.status, language)}
          </Badge>
          {project.featured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardHeader className={featured ? "" : "pb-3"}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={`${
              featured ? "text-xl" : "text-lg"
            } line-clamp-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all`}
          >
            {localizedContent.title}
          </CardTitle>
          <Badge
            variant="outline"
            className="shrink-0 text-xs bg-slate-800/50 border-slate-700"
          >
            {getCategoryText(project.category, language)}
          </Badge>
        </div>
        <CardDescription
          className={`${
            featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
          } text-slate-400`}
        >
          {localizedContent.description}
        </CardDescription>
      </CardHeader>

      {/* Technologies */}
      <CardContent className={featured ? "" : "pt-0"}>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.slice(0, featured ? 6 : 3).map((tech) => (
            <Badge
              key={tech}
              className="text-xs bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 transition-all text-slate-300"
            >
              {tech}
            </Badge>
          ))}
          {project.technologies &&
            project.technologies.length > (featured ? 6 : 3) && (
              <Badge className="text-xs bg-slate-800/80 border border-slate-700 text-slate-300">
                +{project.technologies.length - (featured ? 6 : 3)}
              </Badge>
            )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className={`flex gap-2 ${featured ? "" : "pt-0"}`}>
        <Button
          size="sm"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          asChild
        >
          <Link href={`/portfolio/view/${project.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>
        {project.liveUrl && (
          <Button
            size="sm"
            variant="outline"
            className="border-slate-700 hover:bg-slate-800"
            asChild
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              {featured ? "Live Demo" : "Demo"}
            </a>
          </Button>
        )}
        {project.githubUrl && featured && (
          <Button
            size="sm"
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
              Code
            </a>
          </Button>
        )}
      </CardFooter>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700 pointer-events-none rounded-lg" />
    </Card>
  );
};

// Main Component
export default function ProjectList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentLanguage] = useState<string>("en");
  const [projects, setProjects] = useState<Project[]>([]);

  const { getProjects } = projectStore();

  const fetchProjects = useCallback(async () => {
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Loading Portfolio</h2>
          <p className="text-slate-400">Fetching latest projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold text-white">
            Unable to Load Portfolio
          </h2>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-12">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-sm">
              PORTFOLIO SHOWCASE
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            My{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Explore my latest projects and development work. Each project
            represents a unique challenge and showcases different aspects of
            modern web development.
          </p>
          {projects.length > 0 && (
            <p className="text-sm text-slate-500 mt-4">
              {projects.length} project{projects.length !== 1 ? "s" : ""} •{" "}
              {featuredProjects.length} featured
            </p>
          )}
        </div>
      </section>

      {/* Filter Section */}
      {projects.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-12 border-b border-slate-800">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold text-slate-400">
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
                      ? `bg-gradient-to-r ${category.gradient} border-0 hover:scale-105`
                      : "border-slate-700 hover:bg-slate-800 hover:scale-105"
                  }`}
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
            {filteredProjects.length !== projects.length && (
              <p className="text-center text-sm text-slate-500 mt-4">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            )}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-black text-white mb-8 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCardComponent
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
        <section className="py-16 px-4 sm:px-6 lg:px-12">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-black text-white mb-8 text-center">
              {featuredProjects.length > 0 ? "All Projects" : "Projects"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCardComponent
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
          <div className="container mx-auto max-w-md text-center p-12 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
            <h3 className="text-2xl font-black text-white mb-4">
              No Projects Found
            </h3>
            <p className="text-slate-400 mb-6">
              No projects match the selected category. Try selecting a different
              filter.
            </p>
            <Button
              onClick={() => setSelectedCategory("all")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500"
            >
              View All Projects
            </Button>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-12">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center p-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl">
            <h2 className="text-3xl font-black text-white mb-4">
              Interested in Working Together?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              I'm always open to discussing new projects and opportunities.
              Let's create something amazing together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                asChild
              >
                <Link href="/contact">Get In Touch</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
                asChild
              >
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
