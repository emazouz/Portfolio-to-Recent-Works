import { API_ROUTES } from "@/lib/server";
import { CommentType } from "@/types/CommentType";
import { CreateBlogInput } from "@/validators/blogValidated";
import axios, { AxiosError } from "axios";
import { string } from "zod";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Enhanced interfaces
export interface Blog extends CreateBlogInput {
  id?: number;
  imageUrl?: string;
  previewImages: string[];
  author?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  comments?: CommentType[];
  userLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message: string;
  error?: string;
}

export interface BlogFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}
export interface LocalizedContentType {
  title: string;
  excerpt: string;
  metaDesc: string;
  metaTitle: string;
  content: string;
}
type BlogStore = {
  // State
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  createBlog: (
    blog: CreateBlogInput,
    imageFile: File,
    previewImages: File[]
  ) => Promise<ApiResponse<Blog>>;

  updateBlog: (
    blogId: number,
    blog: CreateBlogInput,
    imageFile?: File,
    previewImages?: File[]
  ) => Promise<ApiResponse<Blog>>;

  getBlogs: (
    filters?: BlogFilters,
    pagination?: PaginationParams
  ) => Promise<{
    data?: {
      blogs: Blog[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    };
    success: boolean;
    message: string;
    error?: string;
  }>;

  getBlogById: (blogId: number) => Promise<ApiResponse<Blog>>;

  deleteBlog: (blogId: number) => Promise<ApiResponse<void>>;

  addLikeBlog: (blogId: number) => Promise<ApiResponse<void>>;

  getLocalizedContent: (
    blog: Blog,
    currentLanguage: string
  ) => LocalizedContentType;

  // Utility actions
  setCurrentBlog: (blog: Blog | null) => void;
  clearError: () => void;
  resetStore: () => void;
};

// Enhanced axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_ROUTES.BLOG,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced FormData creation with proper type handling
const createFormDataFromRequest = (
  data: CreateBlogInput,
  imageFile?: File,
  previewImages?: File[]
): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append("title_en", data.title_en.trim());
  formData.append("title_ar", data.title_ar.trim());
  formData.append("slug", data.slug.trim());
  formData.append("content_en", data.content_en.trim());
  formData.append("content_ar", data.content_ar.trim());
  formData.append("published", String(Boolean(data.published)));
  // Array and complex fields
  if (data.tags && Array.isArray(data.tags)) {
    formData.append("tags", JSON.stringify(data.tags));
  }

  if (previewImages) {
    previewImages.forEach((img) => {
      formData.append("previewImages", img, img.name);
    });
  }

  // Array and complex fields
  if (data.keywords && Array.isArray(data.keywords)) {
    formData.append("keywords", JSON.stringify(data.keywords));
  }

  // Optional fields with validation
  if (data.excerpt_en) {
    formData.append("excerpt_en", data.excerpt_en);
  }

  if (data.excerpt_ar?.trim()) {
    formData.append("excerpt_ar", data.excerpt_ar.trim());
  }

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
  if (data.publishDate) {
    formData.append("publishDate", data.publishDate?.toLocaleString());
  }

  formData.append("readTime", String(Number(data.readTime) || 0));
  // Boolean and number fields
  formData.append("featured", String(Boolean(data.featured)));

  // Image file
  if (imageFile) {
    formData.append("gallery", imageFile, imageFile.name);
  }

  return formData;
};

// Helper function to handle API errors
const handleApiError = (error: unknown): ApiResponse => {
  console.error("API Error:", error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response?.data) {
      return {
        success: false,
        message: axiosError.response.data.message || "An error occurred",
        error: axiosError.response.data.error,
      };
    }

    if (axiosError.code === "ECONNABORTED") {
      return {
        success: false,
        message: "Request timeout. Please try again.",
        error: "TIMEOUT",
      };
    }

    if (!axiosError.response) {
      return {
        success: false,
        message: "Network error. Please check your connection.",
        error: "NETWORK_ERROR",
      };
    }

    return {
      success: false,
      message: axiosError.message || "Request failed",
      error: "REQUEST_FAILED",
    };
  }

  return {
    success: false,
    message: "An unexpected error occurred",
    error: "UNKNOWN_ERROR",
  };
};

// Build query string for filters and pagination
const buildQueryString = (
  filters?: BlogFilters,
  pagination?: PaginationParams
): string => {
  const params = new URLSearchParams();

  // Add filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  // Add pagination
  if (pagination) {
    Object.entries(pagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  return params.toString();
};

export const blogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      blogs: [],
      currentBlog: null,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      // Create blog
      createBlog: async (
        blog: CreateBlogInput,
        imageFile: File,
        previewImages: File[]
      ) => {
        set({ isLoading: true, error: null });

        try {
          const formData = createFormDataFromRequest(
            blog,
            imageFile,
            previewImages
          );
          const response = await axiosInstance.post<ApiResponse<Blog>>(
            "/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success && response.data.data) {
            // Add to blogs list
            // set((state) => ({
            //   blogs: [response.data.data!, ...state.blogs],
            //   currentBlog: response.data.data!,
            // }));

            return {
              data: response.data.data,
              success: true,
              message: response.data.message || "Blog created successfully",
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to create blog",
            error: response.data.error,
          };
        } catch (error) {
          const apiError = handleApiError(error);
          set({ error: apiError.message });
          return apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update blog
      updateBlog: async (
        blogId: number,
        blog: CreateBlogInput,
        imageFile?: File,
        previewImages?: File[]
      ) => {
        set({ isLoading: true, error: null });

        try {
          const formData = createFormDataFromRequest(
            blog,
            imageFile,
            previewImages
          );
          const response = await axiosInstance.put<ApiResponse<Blog>>(
            `/${blogId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success && response.data.data) {
            // Update in blogs list and current blog

            return {
              data: response.data.data,
              success: true,
              message: response.data.message || "Blog updated successfully",
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to update blog",
            error: response.data.error,
          };
        } catch (error) {
          const apiError = handleApiError(error);
          set({ error: apiError.message });
          return apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      // Get blogs with filters and pagination
      getBlogs: async (
        filters?: BlogFilters,
        pagination?: PaginationParams
      ) => {
        set({ isLoading: true, error: null });

        try {
          const queryString = buildQueryString(filters, pagination);
          const url = queryString ? `/?${queryString}` : "/";

          const response = await axiosInstance.get<
            ApiResponse<PaginatedResponse<Blog>>
          >(url);

          if (response.data.success && response.data.data) {
            const { data: blogs, pagination: paginationData } =
              response.data.data;

            set({
              blogs,
              pagination: paginationData,
            });

            return {
              success: true,
              data: response.data.data,
              message: response.data.message,
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to fetch blogs",
            error: response.data.error,
          };
        } catch (error) {
          const apiError = handleApiError(error);
          set({ error: apiError.message });
          return apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      // Get single blog
      getBlogById: async (blogId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get<ApiResponse<Blog>>(
            `/${blogId}`
          );

          if (response.data.success && response.data.data) {
            set({ currentBlog: response.data.data });
            return response.data;
          }

          return {
            success: false,
            message: response.data.message || "Blog not found",
            error: response.data.error,
          };
        } catch (error) {
          const apiError = handleApiError(error);
          set({ error: apiError.message });
          return apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      // Delete blog
      deleteBlog: async (blogId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.delete<ApiResponse<void>>(
            `/${blogId}`
          );

          if (response.data.success) {
            return {
              success: true,
              message: response.data.message || "Blog deleted successfully",
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to delete blog",
            error: response.data.error,
          };
        } catch (error) {
          const apiError = handleApiError(error);
          set({ error: apiError.message });
          return apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      addLikeBlog: async (blogId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post<ApiResponse<Blog>>(
            `/${blogId}/like`
          );

          if (response.data.success && response.data.data) {
            return response.data;
          }

          return {
            success: false,
            message: response.data.message,
            error: response.data.error,
          };
        } catch (error) {
          const apiError = handleApiError(error);
          set({ error: apiError.message });
          return apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      getLocalizedContent: (blog: Blog, currentLanguage: string) => {
        // Ensure blog is defined and currentLanguage is valid
        if (!blog || !currentLanguage) {
          return {
            title: "",
            excerpt: "",
            metaDesc: "",
            metaTitle: "",
            content: "",
          };
        }
        return {
          title: currentLanguage === "en" ? blog.title_en : blog.title_ar,
          excerpt:
            currentLanguage === "en"
              ? blog.excerpt_en ?? ""
              : blog.excerpt_ar ?? "",
          metaDesc:
            currentLanguage === "en"
              ? blog.metaDesc_en ?? ""
              : blog.metaDesc_ar ?? "",
          metaTitle:
            currentLanguage === "en"
              ? blog.metaTitle_en ?? ""
              : blog.metaTitle_ar ?? "",
          content: currentLanguage === "en" ? blog.content_en : blog.content_ar,
        };
      },

      // Utility actions
      setCurrentBlog: (blog: Blog | null) => {
        set({ currentBlog: blog });
      },

      clearError: () => {
        set({ error: null });
      },

      resetStore: () => {
        set({
          blogs: [],
          currentBlog: null,
          isLoading: false,
          error: null,
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
          },
        });
      },
    }),
    {
      name: "blog-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        blogs: state.blogs,
        currentBlog: state.currentBlog,
        pagination: state.pagination,
      }),
      // Only rehydrate non-sensitive data
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset loading and error states on rehydration
          state.isLoading = false;
          state.error = null;
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useBlogs = () => blogStore((state) => state.blogs);
export const useCurrentBlog = () => blogStore((state) => state.currentBlog);
export const useBlogsLoading = () => blogStore((state) => state.isLoading);
export const useBlogsError = () => blogStore((state) => state.error);
export const useBlogsPagination = () => blogStore((state) => state.pagination);
