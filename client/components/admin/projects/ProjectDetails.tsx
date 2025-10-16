"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  Globe,
  Loader2,
} from "lucide-react";
import { Project, projectStore } from "@/store/projectStore";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import Loader from "@/components/ui/Loader";
import { ProjectNotFound } from "@/components/ui/NotFound";
import { MarkdownContent } from "@/components/markdown/markdown-content";

// Status color mapping for better UX
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "PLANNING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ON_HOLD":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Category display mapping
const getCategoryDisplay = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    WEB_DEVELOPMENT: "Web Development",
    MOBILE_APP: "Mobile App",
    DESKTOP_APP: "Desktop App",
    API_DEVELOPMENT: "API Development",
    UI_UX_DESIGN: "UI/UX Design",
    OTHER: "Other",
  };
  return categoryMap[category] || category;
};

// Status display mapping
const getStatusDisplay = (status: string) => {
  const statusMap: { [key: string]: string } = {
    PLANNING: "Planning",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
  };
  return statusMap[status] || status;
};

// Format date helper
const formatDate = (dateString: string | Date) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

export function ProjectDetails({ projectId }: { projectId: number }) {
  const { t } = useTranslation();
  const { getProjectById, deleteProject, isLoading } = projectStore();
  const router = useRouter();

  // Fix: Proper state management
  const [isDeleting, setIsDeleting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  // Fix: Proper data fetching with error handling
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        return <ProjectNotFound />;
      }

      try {
        const result = await getProjectById(projectId);

        if (!result.success) {
          toast({
            title: "Error",
            description: result.message || "Failed to fetch project",
            variant: "error",
          });
          return;
        }

        if (result.data) {
          setProject(result.data);
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

    fetchProject();
  }, [projectId, getProjectById]);

  // Fix: Proper delete implementation with store integration
  const handleDelete = async () => {
    if (!project) return;

    const confirmMessage = t(
      "Are you sure you want to delete this project? This action cannot be undone.",
      "admin.projects.deleteConfirm"
    );

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);

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

      router.push("/admin/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the project",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) return <Loader />;

  // Error state
  if (!project) return <ProjectNotFound projectId={projectId} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back", "admin.form.back")}
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.title_en}
            </h1>
            {project.title_ar && (
              <p className="text-muted-foreground" dir="rtl">
                {project.title_ar}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <Button variant="outline" asChild>
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("Live Demo", "admin.projects.liveDemo")}
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/admin/projects/edit/${projectId}`}>
              <Edit className="mr-2 h-4 w-4" />
              {t("Edit", "admin.projects.edit")}
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {isDeleting
              ? t("Deleting...", "admin.projects.deleting")
              : t("Delete", "admin.projects.delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                {t("Overview", "admin.projects.overview")}
              </TabsTrigger>
              <TabsTrigger value="content">
                {t("Content", "admin.projects.content")}
              </TabsTrigger>
              <TabsTrigger value="seo">
                {t("SEO", "admin.projects.seo")}
              </TabsTrigger>
              <TabsTrigger value="technical">
                {t("Technical", "admin.projects.technical")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Project Information", "admin.projects.information")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Category", "admin.projects.category")}
                      </p>
                      <Badge variant="secondary">
                        {getCategoryDisplay(project.category)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Status", "admin.projects.status")}
                      </p>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusDisplay(project.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Sort Order", "admin.projects.sortOrder")}
                      </p>
                      <p className="text-sm">{project.sortOrder}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Featured", "admin.projects.featured")}
                      </p>
                      <Badge
                        variant={project.featured ? "default" : "secondary"}
                      >
                        {project.featured
                          ? t("Yes", "admin.projects.yes")
                          : t("No", "admin.projects.no")}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Technologies", "admin.projects.technologies")}
                    </p>
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "No technologies specified",
                          "admin.projects.noTechnologies"
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      "Content & Descriptions",
                      "admin.projects.contentDescriptions"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t(
                        "English Description",
                        "admin.projects.englishDescription"
                      )}
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {project.description_en ||
                          t(
                            "No description provided",
                            "admin.projects.noDescription"
                          )}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t(
                        "Arabic Description",
                        "admin.projects.arabicDescription"
                      )}
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg" dir="rtl">
                      <p className="text-sm leading-relaxed">
                        {project.description_ar ||
                          t(
                            "No description provided",
                            "admin.projects.noDescription"
                          )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("SEO Information", "admin.projects.seoInformation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("English Slug", "admin.projects.englishSlug")}
                      </p>
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {project.slug_en || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("Arabic Slug", "admin.projects.arabicSlug")}
                      </p>
                      <p
                        className="text-sm font-mono bg-muted px-2 py-1 rounded"
                        dir="rtl"
                      >
                        {project.slug_ar || "N/A"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t(
                          "Meta Title (English)",
                          "admin.projects.metaTitleEn"
                        )}
                      </p>
                      <div className="bg-muted/50 p-2 rounded text-sm">
                        {project.metaTitle_en ||
                          t("Not set", "admin.projects.notSet")}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("Meta Title (Arabic)", "admin.projects.metaTitleAr")}
                      </p>
                      <div
                        className="bg-muted/50 p-2 rounded text-sm"
                        dir="rtl"
                      >
                        {project.metaTitle_ar ||
                          t("Not set", "admin.projects.notSet")}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t(
                        "Meta Description (English)",
                        "admin.projects.metaDescEn"
                      )}
                    </p>

                    <div className="text-lg leading-relaxed">
                      {project.metaDesc_en && (
                        <div className="prose prose-lg py-4 md:py-6">
                          <MarkdownContent content={project.metaDesc_en} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t(
                        "Meta Description (Arabic)",
                        "admin.projects.metaDescAr"
                      )}
                    </p>
                    <div className="bg-muted/50 p-2 rounded text-sm" dir="rtl">
                      {project.metaDesc_ar ||
                        t("Not set", "admin.projects.notSet")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Technical Details", "admin.projects.technicalDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Technology Stack", "admin.projects.technologyStack")}
                    </p>
                    {project.technologies && project.technologies.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {project.technologies.map((tech: string) => (
                          <div
                            key={tech}
                            className="flex items-center gap-2 p-2 bg-muted rounded"
                          >
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "No technologies specified",
                          "admin.projects.noTechnologies"
                        )}
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("Project Type", "admin.projects.projectType")}
                      </p>
                      <p className="text-sm">
                        {getCategoryDisplay(project.category)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t(
                          "Development Status",
                          "admin.projects.developmentStatus"
                        )}
                      </p>
                      <p className="text-sm">
                        {getStatusDisplay(project.status)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Project Preview", "admin.projects.projectPreview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title_en}
                    fill
                    className="rounded-lg border object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=300&width=400";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted rounded-lg border">
                    <p className="text-muted-foreground">
                      {t("No image available", "admin.projects.noImage")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("Project Links", "admin.projects.projectLinks")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {project.liveUrl ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {t("Live Demo", "admin.projects.liveDemo")}
                  </Link>
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  {t("No live demo available", "admin.projects.noLiveDemo")}
                </div>
              )}

              {project.githubUrl ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    {t("Source Code", "admin.projects.sourceCode")}
                  </Link>
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  {t("No source code available", "admin.projects.noSourceCode")}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Dates", "admin.projects.dates")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Created", "admin.projects.created")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Last Updated", "admin.projects.lastUpdated")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(project.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
