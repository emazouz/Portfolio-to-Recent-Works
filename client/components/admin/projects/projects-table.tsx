"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Github,
  Calendar,
} from "lucide-react";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown-menu";
import { projectStore } from "@/store/projectStore";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
import { PageNotFound } from "@/components/ui/NotFound";
import { Project } from "@/types/project.types";

export function ProjectsTable() {
  const { t } = useTranslation();
  const { getProjects, deleteProject, isLoading } = projectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mockProjects, setMockProjects] = useState<Project[] | []>([]);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const result = await getProjects();
        if (!result.success) {
          toast({
            title: "Error",
            description: result.message,
            variant: "error",
          });
          return;
        }
        if (result.data?.data) {
          setMockProjects(result.data?.data);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description:
            "An unexpected error occurred while fetching the project",
          variant: "error",
        });
      }
    };
    fetchAllProjects();
  }, [getProjects]);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.title_ar.includes(searchTerm);
    const matchesCategory =
      categoryFilter === "all" || project.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (projectId: number) => {
    if (!projectId) return;

    const confirmMessage = t(
      "Are you sure you want to delete this project? This action cannot be undone.",
      "admin.projects.deleteConfirm"
    );

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const result = await deleteProject(projectId);

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to delete project",
          variant: "error",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      await getProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the project",
        variant: "error",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!mockProjects) {
    return <PageNotFound />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Projects", "admin.projects.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage your project portfolio", "admin.projects.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/add">
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Project", "admin.projects.add")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("All Projects", "admin.projects.all")}</CardTitle>
          <CardDescription>
            {t(
              "View and manage all projects in your portfolio",
              "admin.projects.description"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search projects...", "admin.projects.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("Category", "admin.projects.category")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Categories", "admin.projects.allCategories")}
                </SelectItem>
                <SelectItem value="WEB_DEVELOPMENT">Web Application</SelectItem>
                <SelectItem value="MOBILE_APP">Mobile App</SelectItem>
                <SelectItem value="DESKTOP_APP">Desktop App</SelectItem>
                <SelectItem value="API_DEVELOPMENT">API Development</SelectItem>
                <SelectItem value="UI_UX_DESIGN">UI/UX Design</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("Status", "admin.projects.status")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Status", "admin.projects.allStatus")}
                </SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="PLANNING">Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20 overflow-hidden pt-0"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {project.featured && (
                      <Badge variant="default" className="text-xs shadow-sm">
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={
                        project.status === "COMPLETED"
                          ? "default"
                          : project.status === "IN_PROGRESS"
                          ? "secondary"
                          : project.status === "ON_HOLD"
                          ? "outline"
                          : "destructive"
                      }
                      className="text-xs shadow-sm"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <CustomDropdown
                      align="end"
                      trigger={
                        <Button variant="ghost" className="h-8 w-8 p-0 bg-secondary">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                      className="mt-2 absolute"
                    >
                      <DropdownItem asChild>
                        <Link href={`/admin/projects/view/${project.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("View", "admin.projects.view")}
                        </Link>
                      </DropdownItem>
                      <DropdownItem asChild>
                        <Link href={`/admin/projects/edit/${project.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("Edit", "admin.projects.edit")}
                        </Link>
                      </DropdownItem>
                      <DropdownItem className="text-destructive">
                        <span
                          className="flex gap-2 items-center"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("Delete", "admin.projects.delete")}
                        </span>
                      </DropdownItem>
                    </CustomDropdown>
                  </div>
                </div>
                <CardHeader>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs w-fit">
                      {project.category}
                    </Badge>
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {project.title_en}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.title_ar}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={project.liveUrl} target="_blank">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Live
                            </Link>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={project.githubUrl} target="_blank">
                              <Github className="h-3 w-3 mr-1" />
                              Code
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                      <Calendar className="h-3 w-3" />
                      <span>Created {project.createdAt}</span>
                      <span className="ml-2">
                        • Updated {project.updatedAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
