"use client";

import { useCallback, useEffect, useState } from "react";
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
import { templateStore } from "@/store/templateStore";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/dateHelpers";

interface TemplateDetailsProps {
  templateId: number;
}


export function TemplateDetails({ templateId }: TemplateDetailsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { getTemplateById, deleteTemplate, isLoading, template } =
    templateStore();
  const fetchTemplate = useCallback(async () => {
    try {
      const result = await getTemplateById(templateId);
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        return;
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast({
        title: "Error",
        description: `Failed to fetch template: ${error}`,
        variant: "error",
      });
    }
  }, [getTemplateById]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

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
    try {
      const result = await deleteTemplate(templateId);
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        return;
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: `Failed to deleting template: ${error}`,
        variant: "error",
      });
    }
  };

  if(!template){
    return;
  }

  
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
              {template.title_en}
            </h1>
            <p className="text-muted-foreground">{template.title_ar}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={template.previewUrl} target="_blank">
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
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isLoading
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
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Difficulty", "admin.templates.difficulty")}
                      </p>
                      <Badge variant="outline">{template.difficulty}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("Version", "admin.templates.version")}
                      </p>
                      <p className="text-sm">{template.version}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {t("File Size", "admin.templates.fileSize")}
                      </p>
                      <p className="text-sm">{template.fileSize}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {t("Tags", "admin.templates.tags")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
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
                    <p className="text-sm">{template.changelog}</p>
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
                    <p className="text-sm">{template.description_en}</p>
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
                      {template.description_ar}
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
                        {template.slug_en}
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
                        {template.slug_ar}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("Meta Title (English)", "admin.templates.metaTitleEn")}
                    </p>
                    <p className="text-sm">{template.metaTitle_en}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t("Meta Title (Arabic)", "admin.templates.metaTitleAr")}
                    </p>
                    <p className="text-sm" dir="rtl">
                      {template.metaTitle_ar}
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
                    <p className="text-sm">{template.metaDesc_en}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {t(
                        "Meta Description (Arabic)",
                        "admin.templates.metaDescAr"
                      )}
                    </p>
                    <p className="text-sm" dir="rtl">
                      {template.metaDesc_ar}
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
                        {template.views.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Views", "admin.templates.views")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {template.downloads.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Downloads", "admin.templates.downloads")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        {template.rating}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t("Rating", "admin.templates.rating")}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {template.ratingsCount}
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
                src={template.imageUrl || "/placeholder.svg"}
                alt={template.title_en}
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
                  ${template.price}
                </span>
                {template.originalPrice > template.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${template.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {template.downloads}{" "}
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
                  variant={template.featured ? "default" : "secondary"}
                >
                  {template.featured
                    ? t("Yes", "admin.templates.yes")
                    : t("No", "admin.templates.no")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  {t("Active", "admin.templates.active")}
                </span>
                <Badge
                  variant={template.isActive ? "default" : "secondary"}
                >
                  {template.isActive
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
                    {formatDate(template.createdAt)}
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
                    {template.updatedAt
                      ? formatDate(template.updatedAt)
                      : t("Not Available", "admin.templates.notAvailable")}
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
                <Link href={template.previewUrl} target="_blank">
                  <Globe className="mr-2 h-4 w-4" />
                  {t("Live Preview", "admin.templates.livePreview")}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link href={template.downloadUrl} target="_blank">
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
