"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { AlertCircle, Sparkles, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { projectStore } from "@/store/projectStore";
import ProjectCard from "./project-card";
import { Project } from "@/types/project.types";
import { CATEGORY_FILTERS } from "@/constants/project.constants";
import CTASection from "./details/CTA-section";

export default function ProjectList() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const { getProjects, error } = projectStore();

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

  const filteredProjects: Project[] = useMemo(() => {
    if (selectedCategory === "all") return projects;
    const categoryValue = CATEGORY_FILTERS.find(
      (cat) => cat.key === selectedCategory
    )?.value;
    return projects.filter((project) => project.category === categoryValue);
  }, [projects, selectedCategory]);

  const featuredProjects: Project[] = useMemo(() => {
    return filteredProjects.filter((project) => project.featured);
  }, [filteredProjects]);

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
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
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
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
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
      <CTASection />
    </div>
  );
}
