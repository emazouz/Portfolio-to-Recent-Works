import {
  createApiClient,
  handleApiError,
} from "@/handlers/apiFactory.handlers";
import { API_ROUTES } from "@/lib/api";
import {
  Blog,
  BlogFilters,
  BlogState,
  BlogStore,
  LocalizedContentType,
  PaginationParams,
} from "@/types/blog.types";
import { ApiResponse, PaginatedResponse } from "@/types/response.types";
import { CreateBlogInput } from "@/validators/blog.validate";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ============================================================================
// CONSTANTS
// ============================================================================

const INITIAL_STATE: BlogState = {
  blogs: [],
  currentBlog: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const DEFAULT_LOCALIZED_CONTENT: LocalizedContentType = {
  title: "",
  excerpt: "",
  metaDesc: "",
  metaTitle: "",
  content: "",
};

// ============================================================================
// UTILITIES
// ============================================================================

// Create API client - note that interceptors unwrap response.data
// So axiosInstance.get/post/etc return the ApiResponse directly, not AxiosResponse
const axiosInstance = createApiClient(API_ROUTES.BLOG);

/**
 * Creates FormData for blog create/update requests
 */
const createFormDataFromBlog = (
  data: CreateBlogInput,
  imageFile?: File,
  previewImages?: File[]
): FormData => {
  const formData = new FormData();

  // Required fields
  formData.append("title_en", data.title_en.trim());
  formData.append("title_ar", data.title_ar.trim());
  formData.append("slug", data.slug.trim());
  formData.append("content_en", data.content_en.trim());
  formData.append("content_ar", data.content_ar.trim());
  formData.append("published", String(Boolean(data.published)));
  formData.append("featured", String(Boolean(data.featured)));
  formData.append("readTime", String(Number(data.readTime) || 0));

  // Array fields
  if (data.tags?.length) {
    formData.append("tags", JSON.stringify(data.tags));
  }
  if (data.keywords?.length) {
    formData.append("keywords", JSON.stringify(data.keywords));
  }

  // Optional string fields
  const optionalFields = [
    "excerpt_en",
    "excerpt_ar",
    "category",
    "metaTitle_en",
    "metaTitle_ar",
    "metaDesc_en",
    "metaDesc_ar",
  ] as const;

  optionalFields.forEach((field) => {
    const value = data[field];
    if (value?.trim()) {
      formData.append(field, value.trim());
    }
  });

  // Date field
  if (data.publishDate) {
    formData.append("publishDate", new Date(data.publishDate).toISOString());
  }

  // File uploads
  if (imageFile) {
    formData.append("gallery", imageFile, imageFile.name);
  }
  if (previewImages?.length) {
    previewImages.forEach((img) => {
      formData.append("previewImages", img, img.name);
    });
  }

  return formData;
};

/**
 * Builds query string from filters and pagination
 */
const buildQueryString = (
  filters?: BlogFilters,
  pagination?: PaginationParams
): string => {
  const params = new URLSearchParams();

  const addParams = (obj: Record<string, any>) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  };

  if (filters) addParams(filters);
  if (pagination) addParams(pagination);

  return params.toString();
};

/**
 * Generic API call wrapper with consistent error handling
 */
const executeApiCall = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  setState: (state: Partial<BlogState>) => void
): Promise<ApiResponse<T>> => {
  setState({ isLoading: true, error: null });

  try {
    const response = await apiCall();

    // Handle successful response
    if (response.success) {
      return response;
    }

    // Handle API-level failure (validation errors, etc.)
    const errorMessage = response.message || "Operation failed";
    setState({ error: errorMessage });

    return {
      ...response,
      success: false,
      data: null as T,
    };
  } catch (error) {
    // Handle network errors or unexpected failures
    const apiError = handleApiError<T>(error);
    setState({ error: apiError.message });
    return apiError;
  } finally {
    setState({ isLoading: false });
  }
};

// ============================================================================
// STORE DEFINITION
// ============================================================================

export const blogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      // ========================================================================
      // STATE
      // ========================================================================
      ...INITIAL_STATE,

      // ========================================================================
      // ACTIONS
      // ========================================================================

      createBlog: async (blog, imageFile, previewImages) => {
        return executeApiCall(async () => {
          const formData = createFormDataFromBlog(
            blog,
            imageFile,
            previewImages
          );
          // TypeScript thinks this returns AxiosResponse, but interceptor returns data directly
          const response = (await axiosInstance.post("/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })) as ApiResponse<Blog>;

          // Update local state on success
          if (response.success && response.data) {
            set((state) => ({
              blogs: [response.data!, ...state.blogs],
            }));
          }

          return response;
        }, set);
      },

      updateBlog: async (blogId, blog, imageFile, previewImages) => {
        return executeApiCall(async () => {
          const formData = createFormDataFromBlog(
            blog,
            imageFile,
            previewImages
          );
          const response = (await axiosInstance.put(`/${blogId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })) as ApiResponse<Blog>;

          // Update local state on success
          if (response.success && response.data) {
            const updatedBlog = response.data;
            set((state) => ({
              blogs: state.blogs.map((b) =>
                b.id === blogId ? updatedBlog : b
              ),
              currentBlog:
                state.currentBlog?.id === blogId
                  ? updatedBlog
                  : state.currentBlog,
            }));
          }

          return response;
        }, set);
      },

      getBlogs: async (filters, pagination) => {
        return executeApiCall(async () => {
          const queryString = buildQueryString(filters, pagination);
          const url = queryString ? `/?${queryString}` : "/";

          const response = (await axiosInstance.get(url)) as ApiResponse<
            PaginatedResponse<Blog>
          >;

          // Update local state on success
          if (response.success && response.data) {
            const { data: blogs, pagination: paginationData } = response.data;
            set({
              blogs,
              pagination: paginationData,
            });
          }

          return response;
        }, set);
      },

      getBlogById: async (blogId) => {
        return executeApiCall(async () => {
          const response = (await axiosInstance.get(
            `/${blogId}`
          )) as ApiResponse<Blog>;

          // Update local state on success
          if (response.success && response.data) {
            set({ currentBlog: response.data });
          }

          return response;
        }, set);
      },

      deleteBlog: async (blogId) => {
        return executeApiCall(async () => {
          const response = (await axiosInstance.delete(
            `/${blogId}`
          )) as ApiResponse<void>;

          // Update local state on success
          if (response.success) {
            set((state) => ({
              blogs: state.blogs.filter((b) => b.id !== blogId),
              currentBlog:
                state.currentBlog?.id === blogId ? null : state.currentBlog,
            }));
          }

          return response;
        }, set);
      },

      addLikeBlog: async (blogId) => {
        return executeApiCall(async () => {
          const response = (await axiosInstance.post(
            `/${blogId}/like`
          )) as ApiResponse<Blog>;

          // Update local state on success
          if (response.success && response.data) {
            const updatedBlog = response.data;
            set((state) => ({
              blogs: state.blogs.map((b) =>
                b.id === blogId ? updatedBlog : b
              ),
              currentBlog:
                state.currentBlog?.id === blogId
                  ? updatedBlog
                  : state.currentBlog,
            }));
          }

          return response;
        }, set);
      },

      getLocalizedContent: (blog, currentLanguage) => {
        if (!blog || !currentLanguage) {
          return DEFAULT_LOCALIZED_CONTENT;
        }

        const isEnglish = currentLanguage === "en";

        return {
          title: isEnglish ? blog.title_en : blog.title_ar,
          excerpt: isEnglish ? blog.excerpt_en ?? "" : blog.excerpt_ar ?? "",
          metaDesc: isEnglish ? blog.metaDesc_en ?? "" : blog.metaDesc_ar ?? "",
          metaTitle: isEnglish
            ? blog.metaTitle_en ?? ""
            : blog.metaTitle_ar ?? "",
          content: isEnglish ? blog.content_en : blog.content_ar,
        };
      },

      // ========================================================================
      // UTILITY ACTIONS
      // ========================================================================

      setCurrentBlog: (blog) => set({ currentBlog: blog }),

      clearError: () => set({ error: null }),

      resetStore: () => set(INITIAL_STATE),
    }),
    {
      name: "blog-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        blogs: state.blogs,
        currentBlog: state.currentBlog,
        pagination: state.pagination,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset transient state on rehydration
          state.isLoading = false;
          state.error = null;
        }
      },
    }
  )
);

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

export const useBlogs = () => blogStore((state) => state.blogs);
export const useCurrentBlog = () => blogStore((state) => state.currentBlog);
export const useBlogsLoading = () => blogStore((state) => state.isLoading);
export const useBlogsError = () => blogStore((state) => state.error);
export const useBlogsPagination = () => blogStore((state) => state.pagination);
