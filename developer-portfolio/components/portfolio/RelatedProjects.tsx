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
import { toast } from "@/hooks/use-toast";
import { Project, projectStore } from "@/store/projectStore";
import { ExternalLink, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RelatedProjectsProps {
  currentProjectId: number;
  category: string;
}

function getLocalizedContent(project: Project, language: string) {
  return {
    title: language === "ar" ? project.title_ar : project.title_en,
    description:
      language === "ar" ? project.description_ar : project.description_en,
  };
}

function getStatusText(status: string, language: string) {
  const statusMap = {
    COMPLETED: language === "ar" ? "مكتمل" : "Completed",
    IN_PROGRESS: language === "ar" ? "قيد التطوير" : "In Progress",
    PLANNING: language === "ar" ? "في التخطيط" : "Planning",
  };
  return statusMap[status as keyof typeof statusMap] || status;
}

export function RelatedProjects({
  currentProjectId,
  category,
}: RelatedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  // Store hook
  const { getProjects } = projectStore();

  const currentLanguage = "en"; // Default to English for server component
  // Data fetching
  useEffect(() => {
    const fetchProjects = async () => {
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
    };

    fetchProjects();
  }, [getProjects]);

  const relatedProjects = projects
    .filter(
      (project) =>
        project.id !== currentProjectId &&
        project.category === category
    )
    .slice(0, 3);

  if (relatedProjects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Related Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProjects.map((project) => {
            const localizedContent = getLocalizedContent(
              project,
              currentLanguage
            );
            return (
              <Card
                key={project.id}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={localizedContent.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={
                        project.status === "COMPLETED" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {getStatusText(project.status, currentLanguage)}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {localizedContent.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {localizedContent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
