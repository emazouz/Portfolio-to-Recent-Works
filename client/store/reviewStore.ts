import { API_ROUTES } from "@/lib/api";
import { ResponseType } from "@/types/response.types";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GetReviewsOptions = {
  page?: number;
  limit?: number;
  minRating?: number;
  maxRating?: number;
  userId?: string; // Changed to string to match Prisma schema
  projectId?: number;
  verifiedOnly?: boolean | string;
};

export interface ReviewType {
  id: number;
  projectId: number;
  userId: string;
  rating: number;
  comment: string;
  comment_ar?: string;
  verified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  project: {
    title_en: string;
    title_ar: string;
    rating: number;
  };
}

type ReviewStoreType = {
  reviews: ReviewType[] | [];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: false;
    hasPrev: false;
  } | null;
  isLoading: boolean;
  error: string | null;

  addReviews: (
    projectId: number,
    rating: number,
    comment: string
  ) => Promise<ResponseType>;

  updateReview: (
    reviewId: number,
    rating: number,
    comment: string
  ) => Promise<ResponseType>;

  getProjectReviews: (projectId: number) => Promise<ResponseType>;

  getAllReviews: (options?: GetReviewsOptions | {}) => Promise<ResponseType>;
  deleteReview: (reviewId: number) => Promise<ResponseType>;
  toggleVerified: (
    reviewId: number,
    isVerified: boolean
  ) => Promise<{ success: boolean; message: string }>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.REVIEWS,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const reviewStore = create<ReviewStoreType>()(
  persist(
    (set, get) => ({
      reviews: [],
      pagination: null,
      isLoading: false,
      error: null,

      addReviews: async (
        projectId: number,
        rating: number,
        comment: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post(`/${projectId}`, {
            rating,
            comment: comment.trim(),
          });

          if (!response.data.success) {
            return {
              success: false,
              message: response.data.message,
            };
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

      getProjectReviews: async (projectId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/${projectId}`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ reviews: response.data.data.reviews });
          return {
            success: true,
            message: response.data.message,
            data: response.data.data.reviews || [],
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

      getAllReviews: async (options?: GetReviewsOptions | {}) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get("/admin/all", {
            params: options,
          });

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({
            reviews: response.data.data,
            pagination: response.data.meta?.pagination,
          });
          return {
            success: true,
            message: response.data.message,
            data: response.data.data || [],
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

      deleteReview: async (reviewId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.delete(`/${reviewId}`);

          if (!response.data.success) {
            set({ error: response.data.message });
            return {
              success: false,
              message: response.data.message,
            };
          }

          set({ reviews: response.data.data.reviews });
          return {
            success: true,
            message: response.data.message,
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
          };
        } finally {
          set({ isLoading: false });
        }
      },

      updateReview: async (
        reviewId: number,
        rating: number,
        comment: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.put(`/${reviewId}`, {
            rating,
            comment: comment.trim(),
          });

          if (!response.data.success) {
            return {
              success: false,
              message: response.data.message,
            };
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

      toggleVerified: async (reviewId: number, isVerified: boolean) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.put(`/${reviewId}/verified`, {
            isVerified,
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
          };
        } catch (error) {
          return {
            success: false,
            message: "Failed to update verification status",
          };
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "project-storage",
      partialize: (state) => ({
        // Only persist projects list, not loading states or errors
        projects: state.reviews,
      }),
    }
  )
);
