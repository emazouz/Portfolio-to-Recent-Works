"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  ArrowUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";
import { Project, projectStore } from "@/store/projectStore";
import { CreateProjectInput } from "@/validators/projectValidate";
import { toast } from "@/hooks/use-toast";
import MarkdownRenderer, {
  TabErrorIndicator,
} from "@/components/markdown/markdown-renderer";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ProjectFormProps {
  projectId?: number;
}

interface ValidationErrors {
  [key: string]: string;
}

interface FormData {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category: string;
  status: string;
  liveUrl: string;
  githubUrl: string;
  slug_en: string;
  slug_ar: string;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDesc_en: string;
  metaDesc_ar: string;
  featured: boolean;
  sortOrder: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_FORM_DATA: FormData = {
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  category: "",
  status: "IN_PROGRESS",
  liveUrl: "",
  githubUrl: "",
  slug_en: "",
  slug_ar: "",
  metaTitle_en: "",
  metaTitle_ar: "",
  metaDesc_en: "",
  metaDesc_ar: "",
  featured: false,
  sortOrder: 0,
};

const CATEGORY_OPTIONS = [
  { value: "WEB_DEVELOPMENT", label: "Web Application" },
  { value: "MOBILE_APP", label: "Mobile App" },
  { value: "DESKTOP_APP", label: "Desktop App" },
  { value: "API_DEVELOPMENT", label: "API Development" },
  { value: "UI_UX_DESIGN", label: "UI/UX Design" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ON_HOLD", label: "On Hold" },
];

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TECHNOLOGIES = 10;
const URL_PATTERN = /^https?:\/\/.+/;

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

const useImageUpload = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string>("");

  const validateImage = useCallback((file: File, t: any): string | null => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      return t(
        "Please upload a valid image file (JPEG, PNG, WebP)",
        "validation.invalidImageType"
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return t(
        "Image size should be less than 5MB",
        "validation.imageSizeExceeded"
      );
    }

    return null;
  }, []);

  const handleImageChange = useCallback(
    (file: File, t: any) => {
      const validationError = validateImage(file, t);

      if (validationError) {
        return { success: false, error: validationError };
      }

      // Clean up previous preview
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      previewUrlRef.current = newPreviewUrl;

      setImageFile(file);
      setImagePreview(newPreviewUrl);

      return { success: true, error: null };
    },
    [validateImage]
  );

  const removeImage = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const getCurrentImageUrl = useCallback(() => {
    return imagePreview || existingImageUrl || null;
  }, [imagePreview, existingImageUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return {
    imageFile,
    imagePreview,
    existingImageUrl,
    dragActive,
    fileInputRef,
    setExistingImageUrl,
    setDragActive,
    handleImageChange,
    removeImage,
    getCurrentImageUrl,
  };
};

const useFormValidation = () => {
  const { t } = useTranslation();

  const validateForm = useCallback(
    (
      formData: FormData,
      technologies: string[],
      imageFile: File | null,
      projectId?: number
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
      if (!formData.description_en.trim()) {
        errors.description_en = t(
          "English description is required",
          "validation.descriptionEnRequired"
        );
      }
      if (!formData.description_ar.trim()) {
        errors.description_ar = t(
          "Arabic description is required",
          "validation.descriptionArRequired"
        );
      }
      if (!formData.category) {
        errors.category = t(
          "Category is required",
          "validation.categoryRequired"
        );
      }

      // URL validation
      if (formData.liveUrl && !URL_PATTERN.test(formData.liveUrl.trim())) {
        errors.liveUrl = t("Please enter a valid URL", "validation.invalidUrl");
      }
      if (formData.githubUrl && !URL_PATTERN.test(formData.githubUrl.trim())) {
        errors.githubUrl = t(
          "Please enter a valid URL",
          "validation.invalidUrl"
        );
      }

      // Image validation
      if (!projectId && !imageFile) {
        errors.image = t(
          "Project image is required",
          "validation.imageRequired"
        );
      }

      // Technologies validation
      if (technologies.length === 0) {
        errors.technologies = t(
          "At least one technology is required",
          "validation.technologiesRequired"
        );
      }

      return errors;
    },
    [t]
  );

  return { validateForm };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProjectForm({ projectId }: ProjectFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(!!projectId);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTechnology, setNewTechnology] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [activeTab, setActiveTab] = useState("basic");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const { createProject, updateProject, getProjectById } = projectStore();
  const { validateForm } = useFormValidation();
  const {
    imageFile,
    existingImageUrl,
    dragActive,
    fileInputRef,
    setExistingImageUrl,
    setDragActive,
    handleImageChange,
    removeImage,
    getCurrentImageUrl,
  } = useImageUpload();

  // ============================================================================
  // LOAD PROJECT DATA
  // ============================================================================

  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;

      try {
        setIsInitialLoading(true);
        const result = await getProjectById(projectId);

        if (!result.success) {
          toast({
            title: t("Error", "common.error"),
            description: result.message || "Failed to load project data",
            variant: "error",
          });
          router.push("/admin/projects");
          return;
        }

        if (result.data) {
          const project = result.data as Project;

          setFormData({
            title_en: project.title_en || "",
            title_ar: project.title_ar || "",
            description_en: project.description_en || "",
            description_ar: project.description_ar || "",
            category: project.category || "",
            status: project.status || "IN_PROGRESS",
            liveUrl: project.liveUrl || "",
            githubUrl: project.githubUrl || "",
            slug_en: project.slug_en || "",
            slug_ar: project.slug_ar || "",
            metaTitle_en: project.metaTitle_en || "",
            metaTitle_ar: project.metaTitle_ar || "",
            metaDesc_en: project.metaDesc_en || "",
            metaDesc_ar: project.metaDesc_ar || "",
            featured: Boolean(project.featured),
            sortOrder: Number(project.sortOrder) || 0,
          });

          if (project.technologies && Array.isArray(project.technologies)) {
            setTechnologies(project.technologies);
          }

          if (project.imageUrl) {
            setExistingImageUrl(project.imageUrl);
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          title: t("Error", "common.error"),
          description:
            "An unexpected error occurred while loading project data",
          variant: "error",
        });
        router.push("/admin/projects");
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, getProjectById, router, t, setExistingImageUrl]);

  // ============================================================================
  // TRACK UNSAVED CHANGES
  // ============================================================================

  useEffect(() => {
    if (isInitialLoading) return;

    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(INITIAL_FORM_DATA) ||
      technologies.length > 0 ||
      !!imageFile;

    setHasUnsavedChanges(hasChanges);
  }, [formData, technologies, imageFile, isInitialLoading]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | boolean | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field-specific validation error
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }

      // Auto-generate slugs
      if (field === "title_en" && typeof value === "string") {
        setFormData((prev) => ({
          ...prev,
          slug_en: generateSlug(value, false),
        }));
      }

      if (field === "title_ar" && typeof value === "string") {
        setFormData((prev) => ({
          ...prev,
          slug_ar: generateSlug(value, true),
        }));
      }
    },
    [validationErrors]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const result = handleImageChange(file, t);
        if (!result.success && result.error) {
          setValidationErrors((prev) => ({ ...prev, image: result.error! }));
        } else {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        }
      }
    },
    [handleImageChange, t]
  );

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (
          x < rect.left ||
          x >= rect.right ||
          y < rect.top ||
          y >= rect.bottom
        ) {
          setDragActive(false);
        }
      }
    },
    [setDragActive]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) =>
        VALID_IMAGE_TYPES.includes(file.type)
      );

      if (imageFile) {
        const result = handleImageChange(imageFile, t);
        if (!result.success && result.error) {
          setValidationErrors((prev) => ({ ...prev, image: result.error! }));
        } else {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        }
      } else if (files.length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          image: t(
            "Please drop a valid image file",
            "validation.invalidImageDrop"
          ),
        }));
      }
    },
    [handleImageChange, t, setDragActive]
  );

  const addTechnology = useCallback(() => {
    const tech = newTechnology.trim();

    if (!tech) return;

    if (technologies.includes(tech)) {
      toast({
        title: t("Error", "common.error"),
        description: t(
          "Technology already added",
          "validation.technologyExists"
        ),
        variant: "error",
      });
      return;
    }

    if (technologies.length >= MAX_TECHNOLOGIES) {
      toast({
        title: t("Error", "common.error"),
        description: t(
          `Maximum ${MAX_TECHNOLOGIES} technologies allowed`,
          "validation.maxTechnologies"
        ),
        variant: "error",
      });
      return;
    }

    setTechnologies((prev) => [...prev, tech]);
    setNewTechnology("");

    if (validationErrors.technologies) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.technologies;
        return newErrors;
      });
    }
  }, [newTechnology, technologies, validationErrors.technologies, t]);

  const removeTechnology = useCallback((techToRemove: string) => {
    setTechnologies((prev) => prev.filter((tech) => tech !== techToRemove));
  }, []);

  const handleTechnologyKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTechnology();
      }
    },
    [addTechnology]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(formData, technologies, imageFile, projectId);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      const tabsWithErrors = {
        basic: ["title_en", "title_ar", "category", "image"],
        content: ["description_en", "description_ar", "technologies"],
        links: ["liveUrl", "githubUrl"],
        seo: ["slug_en", "slug_ar"],
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
      const projectData = {
        ...formData,
        technologies,
      } as CreateProjectInput;

      let result;
      if (projectId) {
        result = await updateProject(
          projectId,
          projectData,
          imageFile || undefined
        );
      } else {
        if (!imageFile) {
          setValidationErrors({
            image: t("Project image is required", "validation.imageRequired"),
          });
          setActiveTab("basic");
          setIsLoading(false);
          return;
        }
        result = await createProject(projectData, imageFile);
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
          (projectId
            ? "Project updated successfully"
            : "Project created successfully"),
      });

      setHasUnsavedChanges(false);
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error saving project:", error);
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
            {t("Loading project data...", "admin.form.loadingProject")}
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
            : projectId
            ? t("Update Project", "admin.form.updateProject")
            : t("Save Project", "admin.form.saveProject")}
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
              "description_en",
              "description_ar",
              "technologies",
            ]) && <TabErrorIndicator />}
          </TabsTrigger>
          <TabsTrigger value="links" className="relative">
            {t("Links", "admin.form.links")}
            {hasErrorsInTab(["liveUrl", "githubUrl"]) && <TabErrorIndicator />}
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
                  "Enter the basic details for your project",
                  "admin.form.projectBasicDescription"
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Project Image", "admin.form.projectImage")}{" "}
                  {!projectId && "*"}
                </Label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : validationErrors.image
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label={t(
                    "Upload project image",
                    "admin.form.uploadImage"
                  )}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept={VALID_IMAGE_TYPES.join(",")}
                    className="hidden"
                    aria-describedby={
                      validationErrors.image ? "image-error" : undefined
                    }
                  />

                  {currentImageUrl ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <Image
                          width={400}
                          height={200}
                          src={currentImageUrl}
                          alt="Project preview"
                          className="w-full max-h-64 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/placeholder.svg?height=200&width=400";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                          >
                            {t("Change", "common.change")}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ArrowUp
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-700 font-medium mb-2">
                        {t(
                          "Drag and drop your image here, or click to browse",
                          "admin.form.dragDropImage"
                        )}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        {t(
                          "Supports JPEG, PNG, WebP (Max 5MB)",
                          "admin.form.supportedFormats"
                        )}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        {t("Choose Image", "admin.form.chooseImage")}
                      </Button>
                    </div>
                  )}
                </div>
                {validationErrors.image && (
                  <p id="image-error" className="text-sm text-red-500">
                    {validationErrors.image}
                  </p>
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
                  "admin.form.projectContentDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description_en" className="text-sm font-medium">
                  {t("Description (English)", "admin.form.descriptionEn")} *
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
                  className={
                    validationErrors.description_en ? "border-red-500" : ""
                  }
                  aria-invalid={!!validationErrors.description_en}
                />
                {validationErrors.description_en && (
                  <p className="text-sm text-red-500">
                    {validationErrors.description_en}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_ar" className="text-sm font-medium">
                  {t("Description (Arabic)", "admin.form.descriptionAr")} *
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
                  className={
                    validationErrors.description_ar ? "border-red-500" : ""
                  }
                  aria-invalid={!!validationErrors.description_ar}
                />
                {validationErrors.description_ar && (
                  <p className="text-sm text-red-500">
                    {validationErrors.description_ar}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("Technologies", "admin.form.technologies")} *
                  <span className="text-gray-500 text-xs ml-2">
                    ({technologies.length}/{MAX_TECHNOLOGIES})
                  </span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder={t(
                      "Add a technology",
                      "admin.form.addTechnology"
                    )}
                    onKeyPress={handleTechnologyKeyPress}
                    className={
                      validationErrors.technologies ? "border-red-500" : ""
                    }
                    disabled={technologies.length >= MAX_TECHNOLOGIES}
                  />
                  <Button
                    type="button"
                    onClick={addTechnology}
                    variant="outline"
                    disabled={
                      !newTechnology.trim() ||
                      technologies.length >= MAX_TECHNOLOGIES
                    }
                  >
                    {t("Add", "admin.form.add")}
                  </Button>
                </div>
                {validationErrors.technologies && (
                  <p className="text-sm text-red-500">
                    {validationErrors.technologies}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {tech}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTechnology(tech)}
                        aria-label={t(
                          "Remove technology",
                          "admin.form.removeTechnology"
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

        {/* LINKS TAB */}
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Project Links", "admin.form.projectLinks")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Add links to live demo and source code",
                  "admin.form.linksDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="liveUrl" className="text-sm font-medium">
                  {t("Live URL", "admin.form.liveUrl")}
                </Label>
                <Input
                  id="liveUrl"
                  value={formData.liveUrl}
                  onChange={(e) => handleInputChange("liveUrl", e.target.value)}
                  placeholder="https://myproject.com"
                  type="url"
                  className={validationErrors.liveUrl ? "border-red-500" : ""}
                  aria-invalid={!!validationErrors.liveUrl}
                />
                {validationErrors.liveUrl && (
                  <p className="text-sm text-red-500">
                    {validationErrors.liveUrl}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-sm font-medium">
                  {t("GitHub URL", "admin.form.githubUrl")}
                </Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    handleInputChange("githubUrl", e.target.value)
                  }
                  placeholder="https://github.com/username/project"
                  type="url"
                  className={validationErrors.githubUrl ? "border-red-500" : ""}
                  aria-invalid={!!validationErrors.githubUrl}
                />
                {validationErrors.githubUrl && (
                  <p className="text-sm text-red-500">
                    {validationErrors.githubUrl}
                  </p>
                )}
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
                  <Label htmlFor="slug_en" className="text-sm font-medium">
                    {t("Slug (English)", "admin.form.slugEn")}
                  </Label>
                  <Input
                    id="slug_en"
                    value={formData.slug_en}
                    onChange={(e) =>
                      handleInputChange("slug_en", e.target.value)
                    }
                    placeholder="ecommerce-platform"
                    pattern="[a-z0-9-]+"
                    className={validationErrors.slug_en ? "border-red-500" : ""}
                  />
                  {validationErrors.slug_en && (
                    <p className="text-sm text-red-500">
                      {validationErrors.slug_en}
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
                  <Label htmlFor="slug_ar" className="text-sm font-medium">
                    {t("Slug (Arabic)", "admin.form.slugAr")}
                  </Label>
                  <Input
                    id="slug_ar"
                    value={formData.slug_ar}
                    onChange={(e) =>
                      handleInputChange("slug_ar", e.target.value)
                    }
                    placeholder="منصة-التجارة-الإلكترونية"
                    dir="rtl"
                    className={validationErrors.slug_ar ? "border-red-500" : ""}
                  />
                  {validationErrors.slug_ar && (
                    <p className="text-sm text-red-500">
                      {validationErrors.slug_ar}
                    </p>
                  )}
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
                {t("Project Settings", "admin.form.projectSettings")}
              </CardTitle>
              <CardDescription>
                {t(
                  "Configure project visibility and ordering",
                  "admin.form.projectSettingsDescription"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-sm font-medium">
                  {t("Sort Order", "admin.form.sortOrder")}
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    handleInputChange(
                      "sortOrder",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  {t(
                    "Lower numbers appear first",
                    "admin.form.sortOrderDescription"
                  )}
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-sm font-medium">
                    {t("Featured Project", "admin.form.featuredProject")}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "Show this project in featured sections",
                      "admin.form.featuredProjectDescription"
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
            : projectId
            ? t("Update", "admin.form.update")
            : t("Save", "admin.form.save")}
        </Button>
      </div>
    </form>
  );
}
