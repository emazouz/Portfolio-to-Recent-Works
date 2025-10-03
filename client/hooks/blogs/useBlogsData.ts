"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Blog, blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { CreateBlogInput } from "@/validators/blogValidated";
import { INITIAL_FORM_DATA, ValidationErrors } from "@/types/BlogType";

// ============ TYPES ============

interface PaginationType {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface AddBlogParams {
  formData: Blog;
  imageFile: File | null;
  tags: string[];
  keywords: string[];
  blogId?: number;
  publishDate?: Date;
  validateForm: (
    formData: Blog,
    imageFile: File | null,
    tags: string[],
    keywords: string[],
    blogId?: number
  ) => ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
}

// ============ HOOKS ============

/**
 * Hook for managing blogs data and CRUD operations
 */
export function useBlogsData() {
  const { t } = useTranslation();
  const router = useRouter();
  const { getBlogs, deleteBlog, getBlogById, updateBlog, createBlog } =
    blogStore();

  // State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all blogs with pagination
   */
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getBlogs();

      if (!result.success) {
        const errorMsg = result.message || "Failed to fetch blogs";
        setError(errorMsg);
        toast({
          title: t("Error", "common.error"),
          description: errorMsg,
          variant: "error",
        });
        return;
      }

      if (result.data) {
        setBlogs(result.data.blogs || []);
        setPagination(result.data.pagination || null);
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred while fetching blogs";
      console.error("Error fetching blogs:", error);
      setError(errorMessage);
      toast({
        title: t("Error", "common.error"),
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getBlogs, t]);

  /**
   * Fetch a single blog by ID
   */
  const getBlog = useCallback(
    async (blogId: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getBlogById(blogId);

        if (!result.success) {
          const errorMsg = result.message || "Failed to fetch blog";
          setError(errorMsg);
          toast({
            title: t("Error", "common.error"),
            description: errorMsg,
            variant: "error",
          });
          return null;
        }

        if (result.data) {
          setBlog(result.data);
          return result.data;
        }

        return null;
      } catch (error) {
        const errorMessage = "An unexpected error occurred while fetching blog";
        console.error("Error fetching blog:", error);
        setError(errorMessage);
        toast({
          title: t("Error", "common.error"),
          description: errorMessage,
          variant: "error",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getBlogById, t]
  );

  /**
   * Delete a blog post
   */
  const handleDeleteBlog = useCallback(
    async (blogId: number, blogTitle: string) => {
      const confirmMessage = `Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`;

      if (!window.confirm(confirmMessage)) {
        return false;
      }

      try {
        setIsLoading(true);
        const result = await deleteBlog(blogId);

        if (result.success) {
          toast({
            title: t("Success", "common.success"),
            description: t(
              "Blog post deleted successfully",
              "admin.blogs.deleteSuccess"
            ),
          });

          // Refresh the blogs list
          await fetchBlogs();
          return true;
        } else {
          toast({
            title: t("Error", "common.error"),
            description:
              result.message ||
              t("Failed to delete blog post", "admin.blogs.deleteFailed"),
            variant: "error",
          });
          return false;
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast({
          title: t("Error", "common.error"),
          description: t(
            "An unexpected error occurred while deleting the blog post",
            "admin.blogs.deleteError"
          ),
          variant: "error",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [deleteBlog, fetchBlogs, t]
  );

  /**
   * Add or update a blog post
   */
  const addOrUpdateBlog = useCallback(
    async ({
      formData,
      imageFile,
      tags,
      keywords,
      blogId,
      publishDate,
      validateForm,
      setValidationErrors,
    }: AddBlogParams) => {
      // Validate form - FIXED: Pass keywords to validation
      const errors = validateForm(formData, imageFile, tags, keywords, blogId);
      setValidationErrors(errors);

      if (Object.keys(errors).length > 0) {
        toast({
          title: t("Validation Error", "common.validationError"),
          description: t(
            "Please fix the errors before submitting",
            "validation.fixErrors"
          ),
          variant: "error",
        });
        return { success: false, errors };
      }

      try {
        setIsLoading(true);

        const blogData: CreateBlogInput = {
          ...formData,
          tags,
          keywords,
          publishDate: publishDate?.toISOString() || new Date().toISOString(),
        };
        console.log(
          "blogId, blogData, imageFile :",
          blogId,
          blogData,
          imageFile
        );

        const result = blogId
          ? await updateBlog(blogId, blogData, imageFile || undefined)
          : await createBlog(blogData, imageFile!);

        if (!result.success) {
          toast({
            title: t("Error", "common.error"),
            description:
              result.message || t("Operation failed", "common.operationFailed"),
            variant: "error",
          });
          return { success: false, error: result.message };
        }

        toast({
          title: t("Success", "common.success"),
          description:
            result.message ||
            (blogId
              ? t("Blog updated successfully", "admin.blogs.updateSuccess")
              : t("Blog created successfully", "admin.blogs.createSuccess")),
        });

        router.push("/admin/blogs");
        return { success: true, data: result.data };
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
        return { success: false, error: "Unexpected error" };
      } finally {
        setIsLoading(false);
      }
    },
    [createBlog, updateBlog, router, t]
  );

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    // State
    blog,
    blogs,
    pagination,
    isLoading,
    error,

    // Methods
    getBlog,
    fetchBlogs,
    handleDeleteBlog,
    addOrUpdateBlog,
  };
}

/**
 * Hook for managing blog form state and data
 */
export function useBlogForm(
  blogId?: number,
  getBlogFn?: (id: number) => Promise<Blog | null>
) {
  const [formData, setFormData] = useState<Blog>(INITIAL_FORM_DATA);
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [publishDate, setPublishDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(!!blogId);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof Blog, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Auto-generate slug from English title
      if (field === "title_en" && typeof value === "string") {
        const slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/(^-|-$)/g, "");
        setFormData((prev) => ({ ...prev, slug }));
      }
    },
    []
  );

  // Tag management functions
  const addTag = useCallback(
    (tag: string) => {
      if (!tags.includes(tag) && tags.length < 10) {
        setTags((prev) => [...prev, tag]);
      }
    },
    [tags]
  );

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleTagChange = {
    addTag,
    removeTag,
    setTags,
  };

  // Keyword management functions
  const addKeyword = useCallback(
    (keyword: string) => {
      if (!keywords.includes(keyword) && keywords.length < 10) {
        setKeywords((prev) => [...prev, keyword]);
      }
    },
    [keywords]
  );

  const removeKeyword = useCallback((keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  }, []);

  const handleKeywordsChange = {
    addTag: addKeyword,
    removeTag: removeKeyword,
    setTags: setKeywords,
  };

  const loadBlogData = useCallback(async () => {
    if (!blogId || !getBlogFn) return;

    try {
      setIsInitialLoading(true);
      const blogData = await getBlogFn(blogId);

      if (blogData) {
        setFormData(blogData);

        // Set tags separately
        if (blogData.tags && Array.isArray(blogData.tags)) {
          setTags(blogData.tags);
        }

        // Set keywords separately
        if (blogData.keywords && Array.isArray(blogData.keywords)) {
          setKeywords(blogData.keywords);
        }

        // Set publish date
        if (blogData.publishDate) {
          setPublishDate(new Date(blogData.publishDate));
        }
      }
    } catch (error) {
      console.error("Error loading blog:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [blogId, getBlogFn]);

  // Track unsaved changes
  useEffect(() => {
    if (isInitialLoading) return;

    const currentState = {
      ...formData,
      tags,
      keywords,
      publishDate: publishDate?.toISOString(),
    };

    const initialState = {
      ...INITIAL_FORM_DATA,
      tags: [],
      keywords: [],
      publishDate: new Date().toISOString(),
    };

    const hasChanges =
      JSON.stringify(currentState) !== JSON.stringify(initialState);
    setHasUnsavedChanges(hasChanges);
  }, [formData, tags, keywords, publishDate, isInitialLoading]);

  useEffect(() => {
    loadBlogData();
  }, [loadBlogData]);

  return {
    formData,
    tags,
    keywords,
    publishDate,
    isLoading,
    isInitialLoading,
    hasUnsavedChanges,
    handleInputChange,
    handleTagChange,
    handleKeywordsChange,
    setPublishDate,
    setIsLoading,
    loadBlogData,
  };
}

/**
 * Hook for form validation
 */
export function useBlogValidation() {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const validateForm = useCallback(
    (
      formData: Blog,
      imageFile: File | null,
      tags: string[],
      keywords: string[],
      blogId?: number
    ): ValidationErrors => {
      const errors: ValidationErrors = {};

      // Required fields validation
      const requiredFields = [
        { field: "title_en", message: "English title is required" },
        { field: "title_ar", message: "Arabic title is required" },
        { field: "content_en", message: "English content is required" },
        { field: "content_ar", message: "Arabic content is required" },
        { field: "category", message: "Category is required" },
        { field: "slug", message: "URL slug is required" },
      ];

      requiredFields.forEach(({ field, message }) => {
        const value = formData[field as keyof Blog];
        if (!value || (typeof value === "string" && !value.trim())) {
          errors[field] = t(message, `validation.${field}Required`);
        }
      });

      // Image validation for new blogs only
      if (!blogId && !imageFile) {
        errors.image = t(
          "Featured image is required",
          "validation.imageRequired"
        );
      }

      // Tags validation
      if (tags.length === 0) {
        errors.tags = t(
          "At least one tag is required",
          "validation.tagsRequired"
        );
      }

      // Keywords validation - FIXED: Better message
      if (keywords.length === 0) {
        errors.keywords = t(
          "At least one keyword is required",
          "validation.keywordsRequired"
        );
      }

      return errors;
    },
    [t]
  );

  const clearFieldError = useCallback((field: string) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    validationErrors,
    validateForm,
    clearFieldError,
    setValidationErrors,
  };
}

/**
 * Hook for form navigation and preview
 */
export function useFormNavigation(
  hasUnsavedChanges: boolean,
  formData: Blog,
  tags: string[],
  keywords: string[],
  publishDate: Date | undefined,
  getCurrentImageUrl: () => string | null,
  blogId?: number
) {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

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

  const handlePreview = useCallback(() => {
    const previewData = {
      ...formData,
      tags,
      keywords,
      imageUrl: getCurrentImageUrl(),
      publishDate: publishDate?.toISOString(),
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("blogPreview", JSON.stringify(previewData));
      window.open(`/blog/preview/${blogId || "new"}`, "_blank");
    }
  }, [formData, tags, keywords, publishDate, blogId, getCurrentImageUrl]);

  const focusErrorTab = useCallback((errors: ValidationErrors) => {
    const tabsWithErrors = {
      basic: ["title_en", "title_ar", "category", "slug"],
      content: ["content_en", "content_ar", "excerpt_en", "excerpt_ar", "tags"],
      media: ["image"],
      seo: [
        "metaTitle_en",
        "metaTitle_ar",
        "metaDesc_en",
        "metaDesc_ar",
        "keywords",
      ],
      settings: [],
    };

    for (const [tab, fields] of Object.entries(tabsWithErrors)) {
      if (fields.some((field) => errors[field])) {
        setActiveTab(tab);
        break;
      }
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    handleBack,
    handlePreview,
    focusErrorTab,
  };
}
