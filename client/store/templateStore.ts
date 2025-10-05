// stores/templateStore.ts

import { ImageItem } from "@/hooks/useImageUpload";
import { API_ROUTES } from "@/lib/server";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponseType } from "@/types/ResponseType";
// ============ TYPES ============

const TemplateCategory = [
  "WEBSITE_TEMPLATES",
  "ADMIN_DASHBOARDS",
  "LANDING_PAGES",
  "E_COMMERCE",
  "PORTFOLIO",
  "BLOG_THEMES",
  "MOBILE_TEMPLATES",
  "COMPONENTS",
  "OTHER",
] as const;

export type TemplateCategory = (typeof TemplateCategory)[number];

const Difficulty = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"] as const;
export type Difficulty = (typeof Difficulty)[number];

export interface Template {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  originalPrice: number;
  rating: number;
  ratingsCount: number;
  downloads: number;
  views: number;
  tags: string[];
  category: TemplateCategory;
  imageUrl: string;
  previewImages: string[];
  previewUrl: string;
  downloadUrl: string;
  fileSize?: string;
  difficulty: Difficulty;
  featured: boolean;
  isActive: boolean;
  version: string;
  changelog: string;
  slug_en: string;
  slug_ar: string;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDesc_en: string;
  metaDesc_ar: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    reviews: number;
  };
}

export interface CreateTemplateInput {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  originalPrice: number;
  tags: string[];
  category: TemplateCategory;
  imageUrl: File;
  previewImages: ImageItem[];
  previewUrl: string;
  downloadUrl: File;
  fileSize?: string;
  difficulty: Difficulty;
  featured: boolean;
  slug_en: string;
  slug_ar: string;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDesc_en: string;
  metaDesc_ar: string;
  version: string;
  changelog: string;
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {}

export interface TemplateFilters {
  page?: number;
  limit?: number;
  category?: TemplateCategory;
  difficulty?: Difficulty;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "createdAt" | "price" | "rating" | "downloads" | "views";
  sortOrder?: "asc" | "desc";
}

export interface PaginationType {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============ STORE TYPE ============

type TemplateStoreType = {
  // State
  templates: Template[];
  template: Template | null;
  pagination: PaginationType | null;
  isLoading: boolean;
  error: string | null;

  // Actions - Public
  getTemplates: (filters?: TemplateFilters) => Promise<ResponseType>;
  getTemplateById: (id: number) => Promise<ResponseType>;
  getTemplateBySlug: (
    slug: string,
    lang?: "en" | "ar"
  ) => Promise<ResponseType>;
  getFeaturedTemplates: (limit?: number) => Promise<ResponseType>;
  getPopularTemplates: (limit?: number) => Promise<ResponseType>;
  getNewTemplates: (limit?: number) => Promise<ResponseType>;
  getTopRatedTemplates: (limit?: number) => Promise<ResponseType>;
  getTemplatesByCategory: (
    category: TemplateCategory,
    page?: number,
    limit?: number
  ) => Promise<ResponseType>;
  getSimilarTemplates: (id: number, limit?: number) => Promise<ResponseType>;
  getCategoryStats: () => Promise<ResponseType>;

  // Actions - User
  downloadTemplate: (id: number) => Promise<ResponseType>;
  getMyPurchases: () => Promise<ResponseType>;

  // Actions - Admin
  createTemplate: (data: CreateTemplateInput) => Promise<ResponseType>;
  updateTemplate: (
    id: number,
    data: UpdateTemplateInput
  ) => Promise<ResponseType>;
  deleteTemplate: (id: number) => Promise<ResponseType>;
  restoreTemplate: (id: number) => Promise<ResponseType>;
  toggleFeatured: (id: number) => Promise<ResponseType>;
  bulkOperations: (
    templateIds: number[],
    operation: string
  ) => Promise<ResponseType>;
  getTemplateStats: (id: number) => Promise<ResponseType>;

  getAnalytics: () => Promise<ResponseType>;

  // Utility
  clearError: () => void;
  clearTemplate: () => void;
};

// ============ AXIOS INSTANCE ============

const axiosInstance = axios.create({
  baseURL: API_ROUTES.TEMPLATE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const createFormDataFromRequest = (data: CreateTemplateInput): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append("title_en", data.title_en.trim());
  formData.append("title_ar", data.title_ar.trim());
  formData.append("description_en", data.description_en.trim());
  formData.append("description_ar", data.description_ar.trim());
  formData.append("price", data.price.toString());
  formData.append("originalPrice", data.originalPrice.toString());
  formData.append("previewUrl", data.previewUrl.trim());
  // Array and complex fields
  if (data.tags && Array.isArray(data.tags)) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  formData.append("imageUrl", data.imageUrl);

  data.previewImages.forEach((img) => {
    formData.append("previewImages", img.file);
  });

  formData.append("zipFile", data.downloadUrl);

  if (data.category?.trim()) {
    formData.append("category", data.category.trim());
  }

  if (data.metaTitle_en?.trim()) {
    formData.append("metaTitle_en", data.metaTitle_en.trim());
  }

  if (data.metaTitle_ar?.trim()) {
    formData.append("metaTitle_ar", data.metaTitle_ar.trim());
  }

  if (data.metaDesc_en?.trim()) {
    formData.append("metaDesc_en", data.metaDesc_en.trim());
  }

  if (data.metaDesc_ar?.trim()) {
    formData.append("metaDesc_ar", data.metaDesc_ar.trim());
  }

  formData.append("difficulty", data.difficulty.trim());
  formData.append("slug_en", data.slug_en.trim());
  formData.append("slug_ar", data.slug_ar.trim());
  formData.append("version", data.version?.trim() || "1.0.0");
  formData.append("changelog", data.changelog?.trim() || "");
  // Boolean and number fields
  formData.append("featured", String(Boolean(data.featured)));

  return formData;
};
// ============ STORE ============

export const templateStore = create<TemplateStoreType>()(
  persist(
    (set, get) => ({
      // Initial State
      templates: [],
      template: null,
      pagination: null,
      isLoading: false,
      error: null,

      // ============ PUBLIC ACTIONS ============

      /**
       * Get all templates with filters
       */
      getTemplates: async (filters?: TemplateFilters) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/", { params: filters });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({
            templates: response.data.data.templates,
            pagination: response.data.data.pagination,
          });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to fetch templates"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get template by ID
       */
      getTemplateById: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/${id}`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ template: response.data.data });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to fetch template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get template by slug
       */
      getTemplateBySlug: async (slug: string, lang: "en" | "ar" = "en") => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/slug/${slug}`, {
            params: { lang },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ template: response.data.data });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to fetch template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get featured templates
       */
      getFeaturedTemplates: async (limit: number = 6) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/featured", {
            params: { limit },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ templates: response.data.data });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch featured templates"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get popular templates
       */
      getPopularTemplates: async (limit: number = 6) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/popular", {
            params: { limit },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ templates: response.data.data });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch popular templates"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get new templates
       */
      getNewTemplates: async (limit: number = 6) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/new", {
            params: { limit },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ templates: response.data.data });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to fetch new templates"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get top rated templates
       */
      getTopRatedTemplates: async (limit: number = 6) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/top-rated", {
            params: { limit },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ templates: response.data.data });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch top rated templates"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get templates by category
       */
      getTemplatesByCategory: async (
        category: TemplateCategory,
        page: number = 1,
        limit: number = 12
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/category/${category}`, {
            params: { page, limit },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({
            templates: response.data.data.templates,
            pagination: response.data.data.pagination,
          });

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch templates by category"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get similar templates
       */
      getSimilarTemplates: async (id: number, limit: number = 6) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/${id}/similar`, {
            params: { limit },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch similar templates"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get category statistics
       */
      getCategoryStats: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/categories/stats");

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch category stats"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      // ============ USER ACTIONS ============

      /**
       * Download template (requires purchase)
       */
      downloadTemplate: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post(`/${id}/download`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to download template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get user's purchased templates
       */
      getMyPurchases: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/user/purchases");

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to fetch purchases"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      // ============ ADMIN ACTIONS ============

      /**
       * Create template (Admin only)
       */
      createTemplate: async (data: CreateTemplateInput) => {
        // set({ isLoading: true, error: null });

        try {
          const formData = createFormDataFromRequest(data);

          const response = await axiosInstance.post("/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
              errors: response.data.errors,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to create template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return {
            success: false,
            message: errorMsg,
            errors:
              error instanceof AxiosError
                ? error.response?.data?.errors
                : undefined,
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Update template (Admin only)
       */
      updateTemplate: async (id: number, data: UpdateTemplateInput) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.put(`/${id}`, data);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
              errors: response.data.errors,
            };
          }

          // Update template in state if it's the current one
          if (get().template?.id === id) {
            set({ template: response.data.data });
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to update template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return {
            success: false,
            message: errorMsg,
            errors:
              error instanceof AxiosError
                ? error.response?.data?.errors
                : undefined,
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Delete template (Admin only)
       */
      deleteTemplate: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.delete(`/${id}`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          // Remove from templates array
          set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
          }));

          return {
            success: true,
            message: response.data.message,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to delete template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Restore template (Admin only)
       */
      restoreTemplate: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.patch(`/${id}/restore`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to restore template"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Toggle featured status (Admin only)
       */
      toggleFeatured: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.patch(`/${id}/featured`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          // Update in templates array
          set((state) => ({
            templates: state.templates.map((t) =>
              t.id === id ? { ...t, featured: response.data.data.featured } : t
            ),
          }));

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to toggle featured status"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Bulk operations (Admin only)
       */
      bulkOperations: async (templateIds: number[], operation: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post("/bulk", {
            templateIds,
            operation,
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to perform bulk operation"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get template statistics (Admin only)
       */
      getTemplateStats: async (id: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/${id}/stats`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message ||
                "Failed to fetch template stats"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      // reviews

      addReviews: async (
        templateId: number,
        rating: number,
        comment: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post(`/${templateId}/reviews`, {
            rating,
            comment: comment.trim(),
          });

          if (!response.data.success) {
            throw new Error(response.data.message || "Failed to add review");
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data || null,
          };
        } catch (error: any) {
          let errorMessage = "An unexpected error occurred";

          if (error instanceof Error) {
            errorMessage = error.message;
          } else if (typeof error === "string") {
            errorMessage = error;
          } else if (axios.isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Network error occurred";
          }

          set({ error: errorMessage });

          return {
            success: false,
            message: errorMessage,
            data: null,
          };
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Get analytics dashboard (Admin only)
       */
      getAnalytics: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/admin/analytics");

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          return {
            success: true,
            message: response.data.message,
            data: response.data.data,
          };
        } catch (error) {
          const errorMsg =
            error instanceof AxiosError
              ? error.response?.data?.message || "Failed to fetch analytics"
              : "An unexpected error occurred";

          set({ error: errorMsg });
          return { success: false, message: errorMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      // ============ UTILITY ACTIONS ============

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Clear current template
       */
      clearTemplate: () => {
        set({ template: null });
      },
    }),
    {
      name: "template-storage",
      partialize: (state) => ({
        // Only persist templates list, not loading states or errors
        templates: state.templates,
      }),
    }
  )
);
