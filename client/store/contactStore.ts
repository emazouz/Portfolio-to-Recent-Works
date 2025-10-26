import { API_ROUTES } from "@/lib/api";
import { CreateContactInput } from "@/validators/contact.validate";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ContactStoreType = {
  isLoading: boolean;
  error: string | null;

  createContact: ({
    name,
    email,
    subject,
    message,
    type,
  }: CreateContactInput) => Promise<{
    success: boolean;
    message: string;
  }>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.CONTACTS,
  withCredentials: true,
});

export const contactStore = create<ContactStoreType>()(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,

      createContact: async ({
        name,
        email,
        subject,
        message,
        type,
      }: CreateContactInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/", {
            name,
            email,
            subject,
            message,
            type,
          });

          if (!response.data.success) {
            set({ error: response.data.message });
          }
          return {
            success: response.data.success,
            message: response.data.message,
          };
        } catch (error) {
          return { success: false, message: "" };
        } finally {
          set({ isLoading: false, error: null });
        }
      },
    }),
    {
      name: "contact-storage",
    }
  )
);
