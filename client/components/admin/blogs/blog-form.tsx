"use client";

import { useCallback, useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Save,
  ArrowLeft,
  X,
  AlertCircle,
  Loader2,
  ImageIcon,
  Upload,
} from "lucide-react";
import Image from "next/image";
import MarkdownEditor from "react-markdown-editor-lite";
import { Blog, blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import MarkdownRenderer, {
  TabErrorIndicator,
} from "@/components/markdown/markdown-renderer";
import z from "zod";
import { useImageUpload } from "@/hooks/use-Image-upload";

interface BlogFormProps {
  blogId?: number;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormData {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  slug: string;
  category: string;
  published: string;
  featured: boolean;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDesc_en: string;
  metaDesc_ar: string;
  readTime: number;
  status: string;
  tags: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_FORM_DATA: FormData = {
  title_en: "",
  title_ar: "",
  content_en: "",
  content_ar: "",
  excerpt_en: "",
  excerpt_ar: "",
  slug: "",
  category: "",
  published: "",
  featured: false,
  metaTitle_en: "",
  metaTitle_ar: "",
  metaDesc_en: "",
  metaDesc_ar: "",
  readTime: 0,
  status: "DRAFT",
  tags: [],
};

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TECH = 10;
const URL_PATTERN = /^https?:\/\/.+/;

const CATEGORY_OPTIONS = [
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "MOBILE_DEVELOPMENT", label: "Mobile Development" },
  { value: "UI_UX_DESIGN", label: "UI/UX Design" },
  { value: "PROGRAMMING_TIPS", label: "Programming Tips" },
  { value: "TUTORIALS", label: "Tutorials" },
  { value: "NEWS", label: "News" },
  { value: "PERSONAL", label: "Personal" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
  { value: "IN_PROGRESS", label: "In Progress" },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateSlug = (text: string, isArabic: boolean = false): string => {
  if (isArabic) {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useFormValidation = () => {
  const { t } = useTranslation();

  const validateForm = useCallback(
    (
      formData: FormData,
      imageFile: File | null,
      blogId?: number
    ): ValidationErrors => {
      const errors: ValidationErrors = {};

      // Required fields
      if (!formData.title_en.trim()) {
        errors.title_en = t(
          "English title is required",
          "validation.titleEnRequired"
        );
      }
      if (!formData.title_ar.trim()) {
        errors.title_ar = t(
          "Arabic title is required",
          "validation.titleArRequired"
        );
      }
      if (!formData.excerpt_en.trim()) {
        errors.excerpt_en = t(
          "English excerpt is required",
          "validation.excerptEnRequired"
        );
      }
      if (!formData.excerpt_ar.trim()) {
        errors.excerpt_ar = t(
          "Arabic excerpt is required",
          "validation.excerptArRequired"
        );
      }
      if (!formData.category) {
        errors.category = t(
          "Category is required",
          "validation.categoryRequired"
        );
      }

      // Image validation
      if (!blogId && !imageFile) {
        errors.image = t("Blog image is required", "validation.imageRequired");
      }

      return errors;
    },
    [t]
  );

  const clearFieldError = useCallback(
    (
      field: string,
      setValidationErrors: React.Dispatch<
        React.SetStateAction<ValidationErrors>
      >
    ) => {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    },
    []
  );

  return { validateForm, clearFieldError };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BlogForm({ blogId }: BlogFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(!!blogId);
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newTechnology, setNewTechnology] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const [activeTab, setActiveTab] = useState("basic");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const { createBlog, updateBlog, getBlogById } = blogStore();
  const { validateForm, clearFieldError } = useFormValidation();
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

  // ============================================================================
  // LOAD BLOG DATA
  // ============================================================================

  useEffect(() => {
    const loadBlogData = async () => {
      if (!blogId) return;

      try {
        setIsInitialLoading(true);
        const result = await getBlogById(blogId);

        if (!result.success) {
          toast({
            title: t("Error", "common.error"),
            description: result.message || "Failed to load blog data",
            variant: "error",
          });
          router.push("/admin/blogs");
          return;
        }

        if (result.data) {
          const blog = result.data as unknown as Blog;

          setFormData({
            title_en: blog.title_en || "",
            title_ar: blog.title_ar || "",
            content_en: blog.content_en || "",
            content_ar: blog.content_ar || "",
            excerpt_en: blog.excerpt_en || "",
            excerpt_ar: blog.excerpt_ar || "",
            slug: blog.slug || "",
            category: blog.category || "",
            published:
              blog.published !== undefined ? String(blog.published) : "",
            featured: Boolean(blog.featured),
            metaTitle_en: blog.metaTitle_en || "",
            metaTitle_ar: blog.metaTitle_ar || "",
            metaDesc_en: blog.metaDesc_en || "",
            metaDesc_ar: blog.metaDesc_ar || "",
            readTime: blog.readTime || 0,
            status: blog.status || "DRAFT",
            tags: blog.tags || [],
          });

          if (blog.tags && Array.isArray(blog.tags)) {
            setTags(blog.tags);
          }

          if (blog.keywords && Array.isArray(blog.keywords)) {
            setKeywords(blog.keywords);
          }

          if (blog.imageUrl) {
            setExistingImageUrl(blog.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error loading blog:", error);
        toast({
          title: t("Error", "common.error"),
          description: "An unexpected error occurred while loading blog data",
          variant: "error",
        });
        router.push("/admin/blogs");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadBlogData();
  }, [blogId, getBlogById, router, t, setExistingImageUrl]);

  // ============================================================================
  // TRACK UNSAVED CHANGES
  // ============================================================================

  useEffect(() => {
    if (isInitialLoading) return;

    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(INITIAL_FORM_DATA) ||
      !!imageFile;

    setHasUnsavedChanges(hasChanges);
  }, [formData, imageFile, isInitialLoading]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | boolean | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field-specific validation error
      if (validationErrors[field]) {
        clearFieldError(field, setValidationErrors);
      }

      // Auto-generate slugs
      if (field === "title_en" && typeof value === "string") {
        setFormData((prev) => ({
          ...prev,
          slug: generateSlug(value, false),
        }));
      }
    },
    [validationErrors, clearFieldError]
  );

  // Tag management functions
  const addTag = useCallback(() => {
    const tag = newTag.trim();

    if (!tag) return;

    if (tags.includes(tag)) {
      toast({
        title: t("Error", "common.error"),
        description: t("Tag already added", "validation.tagExists"),
        variant: "error",
      });
      return;
    }

    if (tags.length >= MAX_TECH) {
      toast({
        title: t("Error", "common.error"),
        description: t(
          `Maximum ${MAX_TECH} tags allowed`,
          "validation.maxTags"
        ),
        variant: "error",
      });
      return;
    }

    setTags((prev) => [...prev, tag]);
    setNewTag("");
  }, [newTag, tags, t]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleTagKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      }
    },
    [addTag]
  );

  // Keyword management functions
  const addKeyword = useCallback(() => {
    const keyword = newKeyword.trim();

    if (!keyword) return;

    if (keywords.includes(keyword)) {
      toast({
        title: t("Error", "common.error"),
        description: t("Keyword already added", "validation.keywordExists"),
        variant: "error",
      });
      return;
    }

    if (keywords.length >= MAX_TECH) {
      toast({
        title: t("Error", "common.error"),
        description: t(
          `Maximum ${MAX_TECH} keywords allowed`,
          "validation.maxKeywords"
        ),
        variant: "error",
      });
      return;
    }

    setKeywords((prev) => [...prev, keyword]);
    setNewKeyword("");
  }, [newKeyword, keywords, t]);

  const removeKeyword = useCallback((keywordToRemove: string) => {
    setKeywords((prev) =>
      prev.filter((keyword) => keyword !== keywordToRemove)
    );
  }, []);

  const handleKeywordKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addKeyword();
      }
    },
    [addKeyword]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData, imageFile, blogId);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const tabsWithErrors = {
        basic: ["title_en", "title_ar", "category", "image"],
        content: ["excerpt_en", "excerpt_ar", "content_en", "content_ar"],
        seo: ["slug", "metaTitle_en", "metaTitle_ar"],
        settings: [],
      };

      for (const [tab, fields] of Object.entries(tabsWithErrors)) {
        if (fields.some((field) => errors[field])) {
          setActiveTab(tab);
          break;
        }
      }

      toast({
        title: t("Validation Error", "common.validationError"),
        description: t(
          "Please fix the errors before submitting",
          "validation.fixErrors"
        ),
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const blogData = {
        ...formData,
        tags,
        keywords,
      } as any;

      if (!imageFile && !images.length && !existingImageUrl) {
        toast({
          title: t("Error", "common.error"),
          description: t("Please select a Media", "admin.form.media"),
          variant: "error",
        });
        setIsLoading(false);
        return;
      }

      let result;
      if (blogId) {
        result = await updateBlog(
          blogId,
          blogData,
          imageFile || undefined,
          images?.map((img) => img.file).filter(Boolean) || undefined
        );
      } else {
        if (!imageFile) {
          setValidationErrors({
            image: t("Blog image is required", "validation.imageRequired"),
          });
          setActiveTab("basic");
          setIsLoading(false);
          return;
        }
        result = await createBlog(
          blogData,
          imageFile,
          images?.map((img) => img.file).filter(Boolean) || undefined
        );
      }

      if (!result.success) {
        toast({
          title: t("Error", "common.error"),
          description: result.message || "Operation failed",
          variant: "error",
        });
        return;
      }

      toast({
        title: t("Success", "common.success"),
        description:
          result.message ||
          (blogId ? "Blog updated successfully" : "Blog created successfully"),
      });

      setHasUnsavedChanges(false);
      router.push("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: t("Error", "common.error"),
        description: t(
          "An unexpected error occurred",
          "common.unexpectedError"
        ),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        t(
          "You have unsaved changes. Are you sure you want to leave?",
          "common.unsavedChanges"
        )
      );
      if (!confirmed) return;
    }
    router.back();
  }, [hasUnsavedChanges, router, t]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            {t("Loading blog data...", "admin.form.loadingBlog")}
          </p>
        </div>
      </div>
    );
  }

  const currentImageUrl = getCurrentImageUrl();
  const hasErrorsInTab = (tabFields: string[]) =>
    tabFields.some((field) => validationErrors[field]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back", "admin.form.back")}
          </Button>
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-amber-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {t("Unsaved changes", "common.unsavedChanges")}
            </Badge>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isLoading
            ? t("Saving...", "admin.form.saving")
            : blogId
            ? t("Update Blog", "admin.form.updateBlog")
            : t("Save Blog", "admin.form.saveBlog")}
        </Button>
      </div>

      {/* Global Error Alert */}
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t(
              "Please fix the validation errors below",
              "validation.fixErrors"
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="relative">
            {t("Basic Info", "admin.form.basic")}
            {hasErrorsInTab(["title_en", "title_ar", "category", "image"]) && (
              <TabErrorIndicator />
            )}
          </TabsTrigger>
          <TabsTrigger value="content" className="relative">
            {t("Content", "admin.form.content")}
            {hasErrorsInTab([
              "excerpt_en",
              "excerpt_ar",
              "content_en",
              "content_ar",
            ]) && <TabErrorIndicator />}
          </TabsTrigger>
          <TabsTrigger value="media">
            {t("Media", "admin.form.media")}
          </TabsTrigger>
          <TabsTrigger value="seo">{t("SEO", "admin.form.seo")}</TabsTrigger>
          <TabsTrigger value="settings">
            {t("Settings", "admin.form.settings")}
          </TabsTrigger>
        </TabsList>

        {/* BASIC INFO TAB */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Basic Information", "admin.form.basicInfo")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Enter the basic details for your blog",
                  "admin.form.blogBasicDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_en" className="text-sm font-medium">
                    {t("Title (English)", "admin.form.titleEn")} *
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
                    className={
                      validationErrors.title_en ? "border-red-500" : ""
                    }
                    aria-invalid={!!validationErrors.title_en}
                    aria-describedby={
                      validationErrors.title_en ? "title_en-error" : undefined
                    }
                  />
                  {validationErrors.title_en && (
                    <p id="title_en-error" className="text-sm text-red-500">
                      {validationErrors.title_en}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_ar" className="text-sm font-medium">
                    {t("Title (Arabic)", "admin.form.titleAr")} *
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
                    className={
                      validationErrors.title_ar ? "border-red-500" : ""
                    }
                    aria-invalid={!!validationErrors.title_ar}
                    aria-describedby={
                      validationErrors.title_ar ? "title_ar-error" : undefined
                    }
                  />
                  {validationErrors.title_ar && (
                    <p id="title_ar-error" className="text-sm text-red-500">
                      {validationErrors.title_ar}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    {t("Category", "admin.form.category")} *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        validationErrors.category ? "border-red-500" : ""
                      }
                    >
                      <SelectValue
                        placeholder={t(
                          "Select category",
                          "admin.form.selectCategory"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.category && (
                    <p className="text-sm text-red-500">
                      {validationErrors.category}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    {t("Status", "admin.form.status")}
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "Select status",
                          "admin.form.selectStatus"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MEDIA TAB */}
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
                          imagePreview || existingImageUrl || "/placeholder.svg"
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
                          document.getElementById("main-image-upload")?.click()
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
                          : t("Maximum images reached", "admin.form.maxImages")}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENT TAB */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Content & Description", "admin.form.content")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Add detailed descriptions and technologies",
                  "admin.form.blogContentDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excerpt_en" className="text-sm font-medium">
                  {t("Excerpt (English)", "admin.form.excerptEn")} *
                </Label>
                <Textarea
                  id="excerpt_en"
                  value={formData.excerpt_en}
                  onChange={(e) =>
                    handleInputChange("excerpt_en", e.target.value)
                  }
                  placeholder={t(
                    "Enter detailed English excerpt",
                    "admin.form.excerptEnPlaceholder"
                  )}
                  rows={4}
                  className={
                    validationErrors.excerpt_en ? "border-red-500" : ""
                  }
                  aria-invalid={!!validationErrors.excerpt_en}
                />
                {validationErrors.excerpt_en && (
                  <p className="text-sm text-red-500">
                    {validationErrors.excerpt_en}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt_ar" className="text-sm font-medium">
                  {t("Excerpt (Arabic)", "admin.form.excerptAr")} *
                </Label>
                <Textarea
                  id="excerpt_ar"
                  value={formData.excerpt_ar}
                  onChange={(e) =>
                    handleInputChange("excerpt_ar", e.target.value)
                  }
                  placeholder={t(
                    "Enter detailed Arabic excerpt",
                    "admin.form.excerptArPlaceholder"
                  )}
                  rows={4}
                  dir="rtl"
                  className={
                    validationErrors.excerpt_ar ? "border-red-500" : ""
                  }
                  aria-invalid={!!validationErrors.excerpt_ar}
                />
                {validationErrors.excerpt_ar && (
                  <p className="text-sm text-red-500">
                    {validationErrors.excerpt_ar}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_en" className="text-sm font-medium">
                  {t("Content (English)", "admin.form.contentEn")} *
                  <span className="text-blue-600 text-xs ml-2 font-normal">
                    Markdown Editor
                  </span>
                </Label>
                <MarkdownEditor
                  value={formData.content_en}
                  onChange={(ev) => handleInputChange("content_en", ev.text)}
                  style={{
                    width: "100%",
                    height: "400px",
                  }}
                  renderHTML={(text) => <MarkdownRenderer text={text} />}
                />
                {validationErrors.content_en && (
                  <p className="text-sm text-red-500">
                    {validationErrors.content_en}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content_ar" className="text-sm font-medium">
                  {t("Content (Arabic)", "admin.form.contentAr")} *
                  <span className="text-blue-600 text-xs ml-2 font-normal">
                    Markdown Editor
                  </span>
                </Label>
                <MarkdownEditor
                  value={formData.content_ar}
                  onChange={(ev) => handleInputChange("content_ar", ev.text)}
                  style={{
                    width: "100%",
                    height: "400px",
                  }}
                  renderHTML={(text) => <MarkdownRenderer text={text} />}
                />
                {validationErrors.content_ar && (
                  <p className="text-sm text-red-500">
                    {validationErrors.content_ar}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Tags", "admin.form.tags")}
                  <span className="text-gray-500 text-xs ml-2">
                    ({tags.length}/{MAX_TECH})
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder={t("Add a tag", "admin.form.addTag")}
                    onKeyPress={handleTagKeyPress}
                    className={validationErrors.tags ? "border-red-500" : ""}
                    disabled={tags.length >= MAX_TECH}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    disabled={!newTag.trim() || tags.length >= MAX_TECH}
                  >
                    {t("Add", "admin.form.add")}
                  </Button>
                </div>
                {validationErrors.tags && (
                  <p className="text-sm text-red-500">
                    {validationErrors.tags}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                        aria-label={t("Remove tag", "admin.form.removeTag")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Keywords", "admin.form.keywords")}
                  <span className="text-gray-500 text-xs ml-2">
                    ({keywords.length}/{MAX_TECH})
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder={t("Add a keyword", "admin.form.addKeyword")}
                    onKeyPress={handleKeywordKeyPress}
                    className={
                      validationErrors.keywords ? "border-red-500" : ""
                    }
                    disabled={keywords.length >= MAX_TECH}
                  />
                  <Button
                    type="button"
                    onClick={addKeyword}
                    variant="outline"
                    disabled={!newKeyword.trim() || keywords.length >= MAX_TECH}
                  >
                    {t("Add", "admin.form.add")}
                  </Button>
                </div>
                {validationErrors.keywords && (
                  <p className="text-sm text-red-500">
                    {validationErrors.keywords}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {keyword}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeKeyword(keyword)}
                        aria-label={t(
                          "Remove keyword",
                          "admin.form.removeKeyword"
                        )}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO TAB */}
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
                  <Label htmlFor="slug" className="text-sm font-medium">
                    {t("Slug", "admin.form.slug")}
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    placeholder="my-blog-post"
                    pattern="[a-z0-9-]+"
                    className={validationErrors.slug ? "border-red-500" : ""}
                  />
                  {validationErrors.slug && (
                    <p className="text-sm text-red-500">
                      {validationErrors.slug}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {t(
                      "URL-friendly version of the title",
                      "admin.form.slugDescription"
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-sm font-medium">
                    {t("Read Time (minutes)", "admin.form.readTime")}
                  </Label>
                  <Input
                    id="readTime"
                    type="number"
                    min="0"
                    value={formData.readTime}
                    onChange={(e) =>
                      handleInputChange(
                        "readTime",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="5"
                    className="w-32"
                  />
                  <p className="text-xs text-gray-500">
                    {t(
                      "Estimated reading time in minutes",
                      "admin.form.readTimeDescription"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle_en" className="text-sm font-medium">
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
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.metaTitle_en.length}/60{" "}
                    {t("characters", "common.characters")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle_ar" className="text-sm font-medium">
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
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {formData.metaTitle_ar.length}/60{" "}
                    {t("characters", "common.characters")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDesc_en" className="text-sm font-medium">
                  {t("Meta Description (English)", "admin.form.metaDescEn")}
                  <span className="text-blue-600 text-xs ml-2 font-normal">
                    Markdown Editor
                  </span>
                </Label>
                <MarkdownEditor
                  value={formData.metaDesc_en}
                  onChange={(ev) => handleInputChange("metaDesc_en", ev.text)}
                  style={{
                    width: "100%",
                    height: "300px",
                  }}
                  renderHTML={(text) => <MarkdownRenderer text={text} />}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDesc_ar" className="text-sm font-medium">
                  {t("Meta Description (Arabic)", "admin.form.metaDescAr")}
                  <span className="text-blue-600 text-xs ml-2 font-normal">
                    Markdown Editor
                  </span>
                </Label>
                <MarkdownEditor
                  value={formData.metaDesc_ar}
                  onChange={(ev) => handleInputChange("metaDesc_ar", ev.text)}
                  style={{
                    width: "100%",
                    height: "300px",
                  }}
                  renderHTML={(text) => <MarkdownRenderer text={text} />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Blog Settings", "admin.form.blogSettings")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Configure blog visibility and ordering",
                  "admin.form.blogSettingsDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-sm font-medium">
                    {t("Featured Blog", "admin.form.featuredBlog")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Show this blog in featured sections",
                      "admin.form.featuredBlogDescription"
                    )}
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked)
                  }
                  aria-describedby="featured-description"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Save Button for Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button
          type="submit"
          disabled={isLoading}
          className="shadow-lg"
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isLoading
            ? t("Saving...", "admin.form.saving")
            : blogId
            ? t("Update", "admin.form.update")
            : t("Save", "admin.form.save")}
        </Button>
      </div>
    </form>
  );
}
