"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { useImageUpload } from "@/hooks/useImageUpload";
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
import {
  Save,
  ArrowLeft,
  X,
  Upload,
  ImageIcon,
  FileArchive,
  Download,
} from "lucide-react";
import {
  Difficulty,
  TemplateCategory,
  templateStore,
} from "@/store/templateStore";
import { toast } from "@/hooks/use-toast";
import NotFound from "@/components/ui/NotFound";

interface TemplateFormProps {
  templateId?: number;
}

export function TemplateForm({ templateId }: TemplateFormProps) {
  const { t } = useTranslation();
  const { createTemplate, updateTemplate, isLoading, getTemplateById } =
    templateStore();
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [existingZipUrl, setExistingZipUrl] = useState<string>("");
  const [zipDragActive, setZipDragActive] = useState(false);
  const [sizeInMB, setSizeInMB] = useState<string>("");

  const {
    imageFile,
    imagePreview,
    existingImageUrl,
    dragActive,
    fileInputRef,
    handleImageFile,
    removeImage,
    getCurrentImageUrl,
    setExistingImageUrl,
    handleDrag,
    handleDrop,
    handleFileInputChange,
    images,
    handleMultipleImageFiles,
    removeMultipleImage,
    removeAllImages,
    maxImages,
    canAddMoreImages,
    remainingSlots,
  } = useImageUpload();

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    price: 0,
    originalPrice: 0,
    category: "" as TemplateCategory | "",
    difficulty: "" as Difficulty | "",
    previewUrl: "",
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

  useEffect(() => {
    const fetchTemplate = async (id: number) => {
      try {
        const result = await getTemplateById(id);

        if (!result.success) {
          toast({
            title: "Error",
            description: result.message as string,
            variant: "error",
          });
          return;
        }

        const template = result.data;
        if (!template) {
          return;
        }

        setFormData({
          title_en: template.title_en,
          title_ar: template.title_ar,
          description_en: template.description_en,
          description_ar: template.description_ar,
          price: template.price,
          originalPrice: template.originalPrice,
          category: template.category as TemplateCategory,
          difficulty: template.difficulty as Difficulty,
          previewUrl: template.previewUrl,
          slug_en: template.slug_en,
          slug_ar: template.slug_ar,
          metaTitle_en: template.metaTitle_en,
          metaTitle_ar: template.metaTitle_ar,
          metaDesc_en: template.metaDesc_en,
          metaDesc_ar: template.metaDesc_ar,
          version: template.version,
          changelog: template.changelog,
          featured: template.featured,
          isActive: template.isActive,
        });
        setTags(template.tags);
      } catch (error) {
        console.error("Error fetching template:", error);
        toast({
          title: "Error",
          description: "Failed to fetch template",
          variant: "error",
        });
      }
    };

    if (!templateId) return;
    fetchTemplate(templateId);
  }, [templateId]);

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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
  const handleZipFile = (file: File) => {
    if (
      file.type === "application/zip" ||
      file.type === "application/x-zip-compressed" ||
      file.name.endsWith(".zip")
    ) {
      setZipFile(file);
      // Auto-calculate file size
      const szInMB = (file.size / (1024 * 1024)).toFixed(2);
      setSizeInMB(szInMB);
    } else {
      alert(t("Please upload a ZIP file", "admin.form.zipOnly"));
    }
  };

  const removeZipFile = () => {
    setZipFile(null);
    setExistingZipUrl("");
  };

  const handleZipDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setZipDragActive(true);
    } else if (e.type === "dragleave") {
      setZipDragActive(false);
    }
  };

  const handleZipDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setZipDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleZipFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.category) {
        toast({
          title: t("Error", "common.error"),
          description: t(
            "Please select a category",
            "admin.form.selectCategory"
          ),
          variant: "error",
        });
        return;
      }
      if (!formData.difficulty) {
        toast({
          title: t("Error", "common.error"),
          description: t(
            "Please select a difficulty",
            "admin.form.selectDifficulty"
          ),
          variant: "error",
        });
        return;
      }

      let result;
      if (templateId) {
        result = await updateTemplate(templateId, {
          ...formData,
          category: formData.category as TemplateCategory,
          difficulty: formData.difficulty as Difficulty,
          tags,
        });
      } else {
        if (!imageFile && !images.length && !zipFile) {
          toast({
            title: t("Error", "common.error"),
            description: t("Please select a Media", "admin.form.media"),
            variant: "error",
          });
          return;
        }

        result = await createTemplate({
          ...formData,
          category: formData.category as TemplateCategory,
          difficulty: formData.difficulty as Difficulty,
          tags,
          imageUrl: imageFile!,
          previewImages: images,
          downloadUrl: zipFile!,
        });
      }
      if (!result.success) {
        toast({
          title: t("Error", "common.error"),
          description: result.message,
          variant: "error",
        });
        return;
      }
      toast({
        title: t("Success", "common.success"),
        description: t(
          "Template saved successfully",
          "admin.form.templateSaved"
        ),
        variant: "success",
      });
      router.push("/admin/templates");
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const addTag = () => {
    if (newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
          {!templateId && (
            <TabsTrigger value="media">
              {t("Media", "admin.form.media")}
            </TabsTrigger>
          )}
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
                    onChange={(e) =>
                      handleInputChange("price", Number(e.target.value))
                    }
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
                      handleInputChange("originalPrice", Number(e.target.value))
                    }
                    placeholder="79"
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
                      <SelectItem value="WEBSITE_TEMPLATES">
                        Website Templates
                      </SelectItem>
                      <SelectItem value="ADMIN_DASHBOARDS">
                        Admin Dashboards
                      </SelectItem>
                      <SelectItem value="LANDING_PAGES">
                        Landing Pages
                      </SelectItem>
                      <SelectItem value="E_COMMERCE">E-Commerce</SelectItem>
                      <SelectItem value="PORTFOLIO">Portfolio</SelectItem>
                      <SelectItem value="BLOG_THEMES">Blog Themes</SelectItem>
                      <SelectItem value="MOBILE_TEMPLATES">
                        Mobile Templates
                      </SelectItem>
                      <SelectItem value="COMPONENTS">Components</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
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
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                      <SelectItem value="EXPERT">Expert</SelectItem>
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

        {!templateId && (
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
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">
                    {t("Main Image", "admin.form.imageUrl")}
                  </Label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={(e) => {
                      handleDrop(e);
                      const files = Array.from(e.dataTransfer.files);
                      if (
                        files.length > 0 &&
                        files[0].type.startsWith("image/")
                      ) {
                        handleImageFile(files[0]);
                      }
                    }}
                  >
                    {imagePreview || existingImageUrl ? (
                      <div className="relative">
                        <img
                          src={
                            imagePreview ||
                            existingImageUrl ||
                            "/placeholder.svg"
                          }
                          alt="Main template preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {t(
                              "Drop image here or click to upload",
                              "admin.form.dropImage"
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "PNG, JPG, WebP up to 5MB",
                              "admin.form.imageFormats"
                            )}
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                          }}
                          id="main-image-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("main-image-upload")
                              ?.click()
                          }
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {t("Choose File", "admin.form.chooseFile")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="previewImages">
                      {t("Preview Images", "admin.form.previewImages")}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {images.length} / {maxImages}{" "}
                      {t("images", "admin.form.images")}
                    </span>
                  </div>

                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                    } ${
                      !canAddMoreImages ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {canAddMoreImages
                            ? t(
                                "Drop images here or click to upload",
                                "admin.form.dropImages"
                              )
                            : t(
                                "Maximum images reached",
                                "admin.form.maxImages"
                              )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {canAddMoreImages
                            ? t(
                                `You can add ${remainingSlots} more image(s)`,
                                "admin.form.remainingSlots"
                              )
                            : t(
                                "Remove some images to add more",
                                "admin.form.removeToAdd"
                              )}
                        </p>
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileInputChange}
                        disabled={!canAddMoreImages}
                        id="preview-images-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!canAddMoreImages}
                        onClick={() =>
                          document
                            .getElementById("preview-images-upload")
                            ?.click()
                        }
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {t("Choose Files", "admin.form.chooseFiles")}
                      </Button>
                    </div>
                  </div>

                  {images.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {t("Uploaded Images", "admin.form.uploadedImages")}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeAllImages}
                          className="text-destructive hover:text-destructive"
                        >
                          {t("Remove All", "admin.form.removeAll")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((img) => (
                          <div key={img.id} className="relative group">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                              <img
                                src={img.preview || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeMultipleImage(img.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {t("Template Files (ZIP)", "admin.form.downloadUrl")}
                    </Label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                        zipDragActive
                          ? "border-primary bg-primary/5"
                          : "border-muted-foreground/25"
                      }`}
                      onDragEnter={handleZipDrag}
                      onDragLeave={handleZipDrag}
                      onDragOver={handleZipDrag}
                      onDrop={handleZipDrop}
                    >
                      {zipFile || existingZipUrl ? (
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <FileArchive className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {zipFile?.name || "template-files.zip"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {zipFile
                                  ? `${(zipFile.size / (1024 * 1024)).toFixed(
                                      2
                                    )} MB`
                                  : sizeInMB + " MB"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {existingZipUrl && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={existingZipUrl} download>
                                  <Download className="mr-2 h-4 w-4" />
                                  {t("Download", "admin.form.download")}
                                </a>
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={removeZipFile}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-center">
                          <FileArchive className="h-12 w-12 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {t(
                                "Drop ZIP file here or click to upload",
                                "admin.form.dropZip"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t(
                                "ZIP files only, up to 100MB",
                                "admin.form.zipFormats"
                              )}
                            </p>
                          </div>
                          <Input
                            type="file"
                            accept=".zip,application/zip,application/x-zip-compressed"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleZipFile(file);
                            }}
                            id="zip-file-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("zip-file-upload")
                                ?.click()
                            }
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {t("Choose ZIP File", "admin.form.chooseZip")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
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
