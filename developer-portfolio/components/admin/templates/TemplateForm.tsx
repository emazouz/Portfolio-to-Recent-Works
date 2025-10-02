"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, ArrowLeft, X } from "lucide-react";

interface TemplateFormProps {
  templateId?: string;
}

export function TemplateForm({ templateId }: TemplateFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    price: "",
    originalPrice: "",
    category: "",
    difficulty: "",
    imageUrl: "",
    previewImages: [] as string[],
    previewUrl: "",
    downloadUrl: "",
    fileSize: "",
    slug_en: "",
    slug_ar: "",
    metaTitle_en: "",
    metaTitle_ar: "",
    metaDesc_en: "",
    metaDesc_ar: "",
    version: "1.0.0",
    changelog: "",
    featured: false,
    isActive: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slugs
    if (field === "title_en" && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        slug_en: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
    if (field === "title_ar" && typeof value === "string") {
      setFormData((prev) => ({
        ...prev,
        slug_ar: value.replace(/\s+/g, "-"),
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would submit the form data to your API
      console.log("Form data:", { ...formData, tags });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/admin/templates");
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back", "admin.form.back")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading
            ? t("Saving...", "admin.form.saving")
            : t("Save Template", "admin.form.save")}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">
            {t("Basic Info", "admin.form.basic")}
          </TabsTrigger>
          <TabsTrigger value="content">
            {t("Content", "admin.form.content")}
          </TabsTrigger>
          <TabsTrigger value="media">
            {t("Media", "admin.form.media")}
          </TabsTrigger>
          <TabsTrigger value="seo">{t("SEO", "admin.form.seo")}</TabsTrigger>
          <TabsTrigger value="settings">
            {t("Settings", "admin.form.settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Basic Information", "admin.form.basicInfo")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Enter the basic details for your template",
                  "admin.form.basicDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en">
                    {t("Title (English)", "admin.form.titleEn")}
                  </Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) =>
                      handleInputChange("title_en", e.target.value)
                    }
                    placeholder={t(
                      "Enter English title",
                      "admin.form.titleEnPlaceholder"
                    )}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar">
                    {t("Title (Arabic)", "admin.form.titleAr")}
                  </Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) =>
                      handleInputChange("title_ar", e.target.value)
                    }
                    placeholder={t(
                      "Enter Arabic title",
                      "admin.form.titleArPlaceholder"
                    )}
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {t("Price ($)", "admin.form.price")}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="49"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">
                    {t("Original Price ($)", "admin.form.originalPrice")}
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      handleInputChange("originalPrice", e.target.value)
                    }
                    placeholder="79"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileSize">
                    {t("File Size (MB)", "admin.form.fileSize")}
                  </Label>
                  <Input
                    id="fileSize"
                    value={formData.fileSize}
                    onChange={(e) =>
                      handleInputChange("fileSize", e.target.value)
                    }
                    placeholder="15.2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    {t("Category", "admin.form.category")}
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "Select category",
                          "admin.form.selectCategory"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="landing-page">Landing Page</SelectItem>
                      <SelectItem value="e-commerce">E-commerce</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">
                    {t("Difficulty", "admin.form.difficulty")}
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      handleInputChange("difficulty", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "Select difficulty",
                          "admin.form.selectDifficulty"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Content & Description", "admin.form.content")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Add detailed descriptions and tags",
                  "admin.form.contentDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description_en">
                  {t("Description (English)", "admin.form.descriptionEn")}
                </Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) =>
                    handleInputChange("description_en", e.target.value)
                  }
                  placeholder={t(
                    "Enter detailed English description",
                    "admin.form.descriptionEnPlaceholder"
                  )}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description_ar">
                  {t("Description (Arabic)", "admin.form.descriptionAr")}
                </Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar}
                  onChange={(e) =>
                    handleInputChange("description_ar", e.target.value)
                  }
                  placeholder={t(
                    "Enter detailed Arabic description",
                    "admin.form.descriptionArPlaceholder"
                  )}
                  rows={4}
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>{t("Tags", "admin.form.tags")}</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={t("Add a tag", "admin.form.addTag")}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    {t("Add", "admin.form.add")}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="changelog">
                  {t("Changelog", "admin.form.changelog")}
                </Label>
                <Textarea
                  id="changelog"
                  value={formData.changelog}
                  onChange={(e) =>
                    handleInputChange("changelog", e.target.value)
                  }
                  placeholder={t(
                    "What's new in this version?",
                    "admin.form.changelogPlaceholder"
                  )}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Media & Files", "admin.form.media")}</CardTitle>
              <CardDescription>
                {t(
                  "Upload images and set file URLs",
                  "admin.form.mediaDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">
                  {t("Main Image URL", "admin.form.imageUrl")}
                </Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    handleInputChange("imageUrl", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewUrl">
                  {t("Preview URL", "admin.form.previewUrl")}
                </Label>
                <Input
                  id="previewUrl"
                  value={formData.previewUrl}
                  onChange={(e) =>
                    handleInputChange("previewUrl", e.target.value)
                  }
                  placeholder="https://preview.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl">
                  {t("Download URL", "admin.form.downloadUrl")}
                </Label>
                <Input
                  id="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={(e) =>
                    handleInputChange("downloadUrl", e.target.value)
                  }
                  placeholder="https://download.example.com/template.zip"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("SEO Settings", "admin.form.seo")}</CardTitle>
              <CardDescription>
                {t("Optimize for search engines", "admin.form.seoDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug_en">
                    {t("Slug (English)", "admin.form.slugEn")}
                  </Label>
                  <Input
                    id="slug_en"
                    value={formData.slug_en}
                    onChange={(e) =>
                      handleInputChange("slug_en", e.target.value)
                    }
                    placeholder="modern-dashboard-template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug_ar">
                    {t("Slug (Arabic)", "admin.form.slugAr")}
                  </Label>
                  <Input
                    id="slug_ar"
                    value={formData.slug_ar}
                    onChange={(e) =>
                      handleInputChange("slug_ar", e.target.value)
                    }
                    placeholder="قالب-لوحة-تحكم-حديثة"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle_en">
                    {t("Meta Title (English)", "admin.form.metaTitleEn")}
                  </Label>
                  <Input
                    id="metaTitle_en"
                    value={formData.metaTitle_en}
                    onChange={(e) =>
                      handleInputChange("metaTitle_en", e.target.value)
                    }
                    placeholder={t(
                      "SEO optimized title",
                      "admin.form.metaTitlePlaceholder"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle_ar">
                    {t("Meta Title (Arabic)", "admin.form.metaTitleAr")}
                  </Label>
                  <Input
                    id="metaTitle_ar"
                    value={formData.metaTitle_ar}
                    onChange={(e) =>
                      handleInputChange("metaTitle_ar", e.target.value)
                    }
                    placeholder={t(
                      "SEO optimized title in Arabic",
                      "admin.form.metaTitleArPlaceholder"
                    )}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDesc_en">
                  {t("Meta Description (English)", "admin.form.metaDescEn")}
                </Label>
                <Textarea
                  id="metaDesc_en"
                  value={formData.metaDesc_en}
                  onChange={(e) =>
                    handleInputChange("metaDesc_en", e.target.value)
                  }
                  placeholder={t(
                    "SEO description for search results",
                    "admin.form.metaDescPlaceholder"
                  )}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDesc_ar">
                  {t("Meta Description (Arabic)", "admin.form.metaDescAr")}
                </Label>
                <Textarea
                  id="metaDesc_ar"
                  value={formData.metaDesc_ar}
                  onChange={(e) =>
                    handleInputChange("metaDesc_ar", e.target.value)
                  }
                  placeholder={t(
                    "SEO description in Arabic",
                    "admin.form.metaDescArPlaceholder"
                  )}
                  rows={3}
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Template Settings", "admin.form.settings")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Configure template visibility and features",
                  "admin.form.settingsDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="version">
                  {t("Version", "admin.form.version")}
                </Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => handleInputChange("version", e.target.value)}
                  placeholder="1.0.0"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">
                    {t("Featured Template", "admin.form.featured")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Show this template in featured sections",
                      "admin.form.featuredDescription"
                    )}
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">
                    {t("Active", "admin.form.active")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Make this template available for purchase",
                      "admin.form.activeDescription"
                    )}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleInputChange("isActive", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
