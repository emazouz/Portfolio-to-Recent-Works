import { API_ROUTES } from "@/lib/server";
import { CreateProjectInput } from "@/validators/projectValidate";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Enhanced interfaces
export interface Project extends CreateProjectInput {
  id: number;
  imageUrl?: string;
  ratingsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message: string;
  error?: string;
}

export interface ProjectFilters {
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

type ProjectStore = {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  createProject: (
    project: CreateProjectInput,
    imageFile: File
  ) => Promise<ApiResponse<Project>>;

  updateProject: (
    projectId: number,
    project: CreateProjectInput,
    imageFile?: File
  ) => Promise<ApiResponse<Project>>;

  getProjects: (
    filters?: ProjectFilters,
    pagination?: PaginationParams
  ) => Promise<ApiResponse<PaginatedResponse<Project>>>;

  getProjectById: (projectId: number) => Promise<ApiResponse<Project>>;

  deleteProject: (projectId: number) => Promise<ApiResponse<void>>;

  // Utility actions
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
  resetStore: () => void;
};

// Enhanced axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_ROUTES.PROJECT,
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("auth-token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Enhanced FormData creation with proper type handling
const createFormDataFromRequest = (
  data: CreateProjectInput,
  imageFile?: File
): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append("title_en", data.title_en.trim());
  formData.append("title_ar", data.title_ar.trim());
  formData.append("description_en", data.description_en.trim());
  formData.append("description_ar", data.description_ar.trim());
  formData.append("category", data.category);
  formData.append("status", data.status);

  // Optional fields with validation
  formData.append("liveUrl", data.liveUrl?.trim() || "");
  formData.append("githubUrl", data.githubUrl?.trim() || "");

  // SEO fields
  formData.append("slug_en", data.slug_en?.trim() || "");
  formData.append("slug_ar", data.slug_ar?.trim() || "");
  formData.append("metaTitle_en", data.metaTitle_en?.trim() || "");
  formData.append("metaTitle_ar", data.metaTitle_ar?.trim() || "");
  formData.append("metaDesc_en", data.metaDesc_en?.trim() || "");
  formData.append("metaDesc_ar", data.metaDesc_ar?.trim() || "");

  // Array and complex fields
  if (data.technologies && Array.isArray(data.technologies)) {
    // Send as JSON string or individual items based on your API
    formData.append("technologies", JSON.stringify(data.technologies));
  }

  // Boolean and number fields
  formData.append("featured", String(Boolean(data.featured)));
  formData.append("sortOrder", String(Number(data.sortOrder) || 0));

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
  filters?: ProjectFilters,
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

export const projectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },

      // Create project
      createProject: async (project: CreateProjectInput, imageFile: File) => {
        set({ isLoading: true, error: null });

        try {
          const formData = createFormDataFromRequest(project, imageFile);
          const response = await axiosInstance.post<ApiResponse<Project>>(
            "/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("response.data :", response.data);
          if (response.data.success && response.data.data) {
            // Add to projects list
            console.log("xxxxxxx :");

            // set((state) => ({
            //   projects: [response.data.data!, ...state.projects],
            //   currentProject: response.data.data!,
            // }));
            // console.log("xxxxxxx :");

            return {
              data: response.data.data,
              success: true,
              message: response.data.message || "Project created successfully",
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to create project",
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

      // Update project
      updateProject: async (
        projectId: number,
        project: CreateProjectInput,
        imageFile?: File
      ) => {
        set({ isLoading: true, error: null });

        try {
          const formData = createFormDataFromRequest(project, imageFile);

          const response = await axiosInstance.put<ApiResponse<Project>>(
            `/${projectId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success && response.data.data) {
            // Update in projects list and current project
            set((state) => ({
              projects: state.projects.map((p) =>
                p.id === projectId ? response.data.data! : p
              ),
              currentProject:
                state.currentProject?.id === projectId
                  ? response.data.data!
                  : state.currentProject,
            }));

            return {
              data: response.data.data,
              success: true,
              message: response.data.message || "Project updated successfully",
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to update project",
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

      // Get projects with filters and pagination
      getProjects: async (
        filters?: ProjectFilters,
        pagination?: PaginationParams
      ) => {
        set({ isLoading: true, error: null });

        try {
          const queryString = buildQueryString(filters, pagination);
          const url = queryString ? `/?${queryString}` : "/";

          const response = await axiosInstance.get<
            ApiResponse<PaginatedResponse<Project>>
          >(url);

          if (response.data.success && response.data.data) {
            const { data: projects, pagination: paginationData } =
              response.data.data;

            set({
              projects,
              pagination: paginationData,
            });

            return response.data;
          }

          return {
            success: false,
            message: response.data.message || "Failed to fetch projects",
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

      // Get single project
      getProjectById: async (projectId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get<ApiResponse<Project>>(
            `/${projectId}`
          );

          if (response.data.success && response.data.data) {
            set({ currentProject: response.data.data });
            return response.data;
          }

          return {
            success: false,
            message: response.data.message || "Project not found",
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

      // Delete project
      deleteProject: async (projectId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.delete<ApiResponse<void>>(
            `/${projectId}`
          );

          if (response.data.success) {
            return {
              success: true,
              message: response.data.message || "Project deleted successfully",
            };
          }

          return {
            success: false,
            message: response.data.message || "Failed to delete project",
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

      // Utility actions
      setCurrentProject: (project: Project | null) => {
        set({ currentProject: project });
      },

      clearError: () => {
        set({ error: null });
      },

      resetStore: () => {
        set({
          projects: [],
          currentProject: null,
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
      name: "project-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        projects: state.projects,
        currentProject: state.currentProject,
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
export const useProjects = () => projectStore((state) => state.projects);
export const useCurrentProject = () =>
  projectStore((state) => state.currentProject);
export const useProjectsLoading = () =>
  projectStore((state) => state.isLoading);
export const useProjectsError = () => projectStore((state) => state.error);
export const useProjectsPagination = () =>
  projectStore((state) => state.pagination);
