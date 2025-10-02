"use client";

import { useState } from "react";
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
  Eye,
  Download,
  Star,
  Calendar,
  Globe,
} from "lucide-react";

interface TemplateDetailsProps {
  templateId: string;
}

// Mock data - replace with actual data fetching
const mockTemplate = {
  id: "1",
  imageUrl: "/placeholder.svg?height=300&width=400",
  title_en: "Modern Dashboard Template",
  title_ar: "قالب لوحة تحكم حديثة",
  description_en:
    "A comprehensive dashboard template with modern design and advanced features. Perfect for admin panels, analytics dashboards, and business applications.",
  description_ar:
    "قالب لوحة تحكم شامل بتصميم حديث وميزات متقدمة. مثالي للوحات الإدارة ولوحات التحليلات وتطبيقات الأعمال.",
  price: 49,
  originalPrice: 79,
  rating: 4.8,
  ratingsCount: 124,
  downloads: 1250,
  views: 5420,
  category: "Dashboard",
  difficulty: "Intermediate",
  tags: ["React", "TypeScript", "Tailwind CSS", "Dashboard", "Admin"],
  version: "2.1.0",
  changelog:
    "Added dark mode support, improved mobile responsiveness, new chart components",
  slug_en: "modern-dashboard-template",
  slug_ar: "قالب-لوحة-تحكم-حديثة",
  metaTitle_en: "Modern Dashboard Template - Premium React Admin Panel",
  metaTitle_ar: "قالب لوحة تحكم حديثة - لوحة إدارة React متميزة",
  metaDesc_en:
    "Professional dashboard template with modern design, built with React and TypeScript. Perfect for admin panels and business applications.",
  metaDesc_ar:
    "قالب لوحة تحكم احترافي بتصميم حديث، مبني بـ React و TypeScript. مثالي للوحات الإدارة وتطبيقات الأعمال.",
  previewUrl: "https://preview.example.com/dashboard",
  downloadUrl: "https://download.example.com/template.zip",
  fileSize: "15.2 MB",
  featured: true,
  isActive: true,
  createdAt: "2024-01-10",
  updatedAt: "2024-01-15",
  lastUpdated: "2024-01-15",
};

export function TemplateDetails({ templateId }: TemplateDetailsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        t(
          "Are you sure you want to delete this template?",
          "admin.templates.deleteConfirm"
        )
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      // Here you would call your delete API
      console.log("Deleting template:", templateId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/templates");
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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
              {mockTemplate.title_en}
            </h1>
            <p className="text-muted-foreground">{mockTemplate.title_ar}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={mockTemplate.previewUrl} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              {t("Preview", "admin.templates.preview")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/templates/edit/${templateId}`}>
              <Edit className="mr-2 h-4 w-4" />
              {t("Edit", "admin.templates.edit")}
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting
              ? t("Deleting...", "admin.templates.deleting")
              : t("Delete", "admin.templates.delete")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">
                {t("Overview", "admin.templates.overview")}
              </TabsTrigger>
              <TabsTrigger value="content">
                {t("Content", "admin.templates.content")}
              </TabsTrigger>
              <TabsTrigger value="seo">
                {t("SEO", "admin.templates.seo")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {t("Analytics", "admin.templates.analytics")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Template Information", "admin.templates.information")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Category", "admin.templates.category")}
                      </p>
                      <Badge variant="secondary">{mockTemplate.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Difficulty", "admin.templates.difficulty")}
                      </p>
                      <Badge variant="outline">{mockTemplate.difficulty}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Version", "admin.templates.version")}
                      </p>
                      <p className="text-sm">{mockTemplate.version}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("File Size", "admin.templates.fileSize")}
                      </p>
                      <p className="text-sm">{mockTemplate.fileSize}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Tags", "admin.templates.tags")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mockTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Changelog", "admin.templates.changelog")}
                    </p>
                    <p className="text-sm">{mockTemplate.changelog}</p>
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
                      "admin.templates.contentDescriptions"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t(
                        "English Description",
                        "admin.templates.englishDescription"
                      )}
                    </p>
                    <p className="text-sm">{mockTemplate.description_en}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t(
                        "Arabic Description",
                        "admin.templates.arabicDescription"
                      )}
                    </p>
                    <p className="text-sm" dir="rtl">
                      {mockTemplate.description_ar}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("SEO Information", "admin.templates.seoInformation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("English Slug", "admin.templates.englishSlug")}
                      </p>
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {mockTemplate.slug_en}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {t("Arabic Slug", "admin.templates.arabicSlug")}
                      </p>
                      <p
                        className="text-sm font-mono bg-muted px-2 py-1 rounded"
                        dir="rtl"
                      >
                        {mockTemplate.slug_ar}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("Meta Title (English)", "admin.templates.metaTitleEn")}
                    </p>
                    <p className="text-sm">{mockTemplate.metaTitle_en}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("Meta Title (Arabic)", "admin.templates.metaTitleAr")}
                    </p>
                    <p className="text-sm" dir="rtl">
                      {mockTemplate.metaTitle_ar}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t(
                        "Meta Description (English)",
                        "admin.templates.metaDescEn"
                      )}
                    </p>
                    <p className="text-sm">{mockTemplate.metaDesc_en}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t(
                        "Meta Description (Arabic)",
                        "admin.templates.metaDescAr"
                      )}
                    </p>
                    <p className="text-sm" dir="rtl">
                      {mockTemplate.metaDesc_ar}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Performance Analytics", "admin.templates.analytics")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {mockTemplate.views.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Views", "admin.templates.views")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {mockTemplate.downloads.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Downloads", "admin.templates.downloads")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        {mockTemplate.rating}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Rating", "admin.templates.rating")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {mockTemplate.ratingsCount}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Reviews", "admin.templates.reviews")}
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
                {t("Template Preview", "admin.templates.templatePreview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={mockTemplate.imageUrl || "/placeholder.svg"}
                alt={mockTemplate.title_en}
                className="w-full rounded-lg border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Pricing", "admin.templates.pricing")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ${mockTemplate.price}
                </span>
                {mockTemplate.originalPrice > mockTemplate.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${mockTemplate.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {mockTemplate.downloads}{" "}
                  {t("downloads", "admin.templates.downloads")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Status", "admin.templates.status")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("Featured", "admin.templates.featured")}
                </span>
                <Badge
                  variant={mockTemplate.featured ? "default" : "secondary"}
                >
                  {mockTemplate.featured
                    ? t("Yes", "admin.templates.yes")
                    : t("No", "admin.templates.no")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("Active", "admin.templates.active")}
                </span>
                <Badge
                  variant={mockTemplate.isActive ? "default" : "secondary"}
                >
                  {mockTemplate.isActive
                    ? t("Active", "admin.templates.active")
                    : t("Inactive", "admin.templates.inactive")}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Dates", "admin.templates.dates")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Created", "admin.templates.created")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockTemplate.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("Last Updated", "admin.templates.lastUpdated")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockTemplate.lastUpdated}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Links", "admin.templates.links")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href={mockTemplate.previewUrl} target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  {t("Live Preview", "admin.templates.livePreview")}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href={mockTemplate.downloadUrl} target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  {t("Download File", "admin.templates.downloadFile")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
