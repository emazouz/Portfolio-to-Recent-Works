import { API_ROUTES } from "@/lib/server";
import { ResponseType } from "@/types/ResponseType";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReviewType {
  id?: string;
  templateId: number;
  userId: string;
  rating: number;
  comment: string;
  comment_ar?: string;
  verified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  helpful?: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

type ReviewStoreType = {
  reviews: ReviewType[] | [];
  isLoading: boolean;
  error: string | null;

  addReviews: (
    templateId: number,
    rating: number,
    comment: string
  ) => Promise<ResponseType>;

  updateReview: (
    reviewId: number,
    rating: number,
    comment: string
  ) => Promise<ResponseType>;

  getTemplateReviews: (templateId: number) => Promise<ResponseType>;
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
      isLoading: false,
      error: null,

      addReviews: async (
        templateId: number,
        rating: number,
        comment: string
      ) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.post(`/${templateId}`, {
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

      getTemplateReviews: async (templateId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axiosInstance.get(`/${templateId}`);

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
    }),
    {
      name: "template-storage",
      partialize: (state) => ({
        // Only persist templates list, not loading states or errors
        templates: state.reviews,
      }),
    }
  )
);
