import { API_ROUTES } from "@/lib/api";
import { CommentType } from "@/types/comment.types";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommentInput {
  blogId: number;
  name: string;
  email: string;
  content: string;
  parentId: number | null;
}

type CommentStoreType = {
  comments: CommentType[] | [];
  isLoading: boolean;
  errorMsg?: string | null;
  successMsg?: string | null;
  //   fetchComments: (blogId: number) => Promise<boolean>;
  addComment: ({
    blogId,
    name,
    email,
    content,
    parentId,
  }: CommentInput) => Promise<boolean>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.COMMENT,
  withCredentials: true,
});

export const commentStore = create<CommentStoreType>()(
  persist(
    (set, get) => ({
      comments: [],
      isLoading: false,
      errorMsg: null,
      successMsg: null,
      addComment: async ({
        blogId,
        name,
        email,
        content,
        parentId,
      }: CommentInput) => {
        set({ isLoading: true, errorMsg: null, successMsg: null });

        console.log("formData :", blogId, name, email, content, parentId);

        try {
          const response = await axiosInstance.post(`/${blogId}`, {
            name,
            email,
            content,
            parentId: parentId || null,
          });

          if (!response.data.success) {
            set({
              errorMsg: response.data.message,
            });
            return false;
          }
          set({
            successMsg: response.data.message,
            comments: response.data.data,
          });
          return true;
        } catch (error) {
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "blog-storage",
    }
  )
);
