import { toast } from "@/hooks/use-toast";
import { API_ROUTES } from "@/lib/server";
import { LoginInput, RegisterInput } from "@/validators/authValidated";
import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ReviewType } from "./reviewStore";

// Email Change Request Interface
interface EmailChangeRequest {
  newEmail: string;
  currentPassword: string;
}

export interface UserType {
  id?: string;
  name: string;
  email: string;
  birthDate?: string;
  avatar?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  role?: "ADMIN" | "USER";
  emailVerified?: boolean;
  subscribeNewsletter?: boolean;
  termsAgreed?: boolean;
  createdAt?: string;

  lastLoginAt?: string;
  reviews?: ReviewType[];
}

export interface UpdateProfileParams {
  name?: string;
  gender?: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
  birthDate?: string | Date;
  avatar?: File;
  subscribeNewsletter?: boolean;
}

type AuthStore = {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;

  getUser: () => Promise<{
    success: boolean;
    message: string;
    user: UserType | null;
  }>;

  register: ({
    name,
    email,
    password,
    confirmPassword,
    termsAgreed,
    subscribeNewsletter,
  }: RegisterInput) => Promise<{ success: boolean; message: string }>;

  login: ({
    email,
    password,
    rememberMe,
  }: LoginInput) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;

  refreshAccessToken: () => Promise<Boolean>;

  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{
    success: boolean;
    message: string;
    data: any | null;
  }>;

  forgotPassword: (email: string) => Promise<boolean>;
  validatedToken: (
    token: string,
    email: string
  ) => Promise<{
    success: boolean;
    data: {
      id: string;
      validatedToken: string;
    };
  }>;

  resetPassword: (
    token: string,
    email: string,
    newPassword: string
  ) => Promise<boolean>;

  // Email Change Actions
  newEmailForVerification: string | null;

  verifyEmailChange: (
    code: string
  ) => Promise<{ success: boolean; message: string }>;

  requestEmailChange: (
    newEmail: string,
    currentPassword: string
  ) => Promise<{ success: boolean; message: string }>;

  verifyEmailVerified: (
    code: string
  ) => Promise<{ success: boolean; message: string }>;

  requestEmailVerified: () => Promise<{ success: boolean; message: string }>;

  // update profile

  updateProfile: ({
    name,
    gender,
    birthDate,
    avatar,
    subscribeNewsletter,
  }: UpdateProfileParams) => Promise<{
    success: boolean;
    message: string;
  }>;

  // User Actions
  setUser: (user: UserType | null) => void;
  isRequestingEmailChange: boolean;
  isVerifyingEmailChange: boolean;
  emailChangeError: string | null;
  clearEmailChangeError: () => void;
  getAllUsers: () => Promise<UserType[]>;
  getUserByID: (id: string) => Promise<UserType | null>;
  updateUserRole: (id: string, role: string) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;

  // Utility Actions
  reset: () => void;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isRequestingEmailChange: false,
      isVerifyingEmailChange: false,
      emailChangeError: null,
      newEmailForVerification: null,

      setUser: (user: UserType | null) => {
        set({ user });
      },

      getUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/");

          if (response.data.success) {
            set({ user: response.data.data, isLoading: false });
            return {
              success: true,
              message: response.data.message,
              user: response.data.data,
            };
          }

          set({ error: response.data.message, isLoading: false });
          return { success: false, message: response.data.message, user: null };
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Registration failed"
              : "Registration failed",
          });
          return { success: false, message: "Registration failed", user: null };
        }
      },

      register: async ({
        name,
        email,
        password,
        confirmPassword,
        termsAgreed,
        subscribeNewsletter,
      }: RegisterInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/register", {
            name,
            email,
            password,
            confirmPassword,
            termsAgreed,
            subscribeNewsletter,
          });

          set({ isLoading: false });
          if (response.data.success) {
            set({ user: response.data.user });
            return { success: true, message: response.data.message };
          }

          return { success: false, message: response.data.message };
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Registration failed"
              : "Registration failed",
          });
          return { success: false, message: "Registration failed" };
        }
      },

      login: async ({ email, password, rememberMe }: LoginInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
            rememberMe,
          });

          if (!response.data.success) {
            return {
              success: response.data.success,
              message: response.data.message,
            };
          }

          return {
            success: response.data.success,
            message: response.data.message,
          };
        } catch (error) {
          set({
            user: null,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error
              : "Login failed",
          });

          return {
            success: false,
            message: axios.isAxiosError(error)
              ? error?.response?.data?.error
              : "Login failed",
          };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/logout");
          // Clear user data from localStorage
          if (response.data.success) {
            localStorage.removeItem("userData");
            set({ user: null });
            return {
              success: response.data.success,
              message: response.data.message,
            };
          }
          return {
            success: response.data.success,
            message: response.data.message,
          };
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error
              : "Logout failed",
          });
          return {
            success: false,
            message: axios.isAxiosError(error)
              ? error?.response?.data?.error
              : "Logout failed",
          };
        } finally {
          set({ isLoading: false });
        }
      },

      // refresh access token logic
      refreshAccessToken: async () => {
        try {
          const response = await axiosInstance.post(
            "/refresh-token",
            {},
            {
              withCredentials: true,
            }
          );

          return true;
        } catch (error) {
          console.error("Refresh token failed:", error);
          return false;
        }
      },

      // change password logic
      changePassword: async (oldPassword, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/change-password", {
            oldPassword,
            newPassword,
          });

          if (response.data.success) {
            return {
              success: response.data.success,
              message: response.data.message,
              data: response.data.data,
            };
          }

          return {
            success: response.data.success,
            message: response.data.message,
            data: null,
          };
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Change password failed"
              : "Change password failed",
          });

          return {
            success: false,
            message: "Change password failed",
            data: null,
          };
        } finally {
          set({ isLoading: false });
        }
      },

      // forgot password logic
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          // validate email
          const response = await axiosInstance.post("/forgot-password", {
            email,
          });

          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Forgot password failed"
              : "Forgot password failed",
          });

          return false;
        }
      },

      // validated Token logic
      validatedToken: async (token: string, email: string) => {
        set({ isLoading: true, error: null });
        try {
          // validate email
          const response = await axiosInstance.post("/validated-token", {
            token,
            email,
          });

          if (response.data.success) {
            return {
              success: response.data.success,
              data: response.data.data,
            };
          }
          set({ error: response.data.message });

          return {
            success: response.data.success,
            data: null,
          };
        } catch (error) {
          set({
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Forgot password failed"
              : "Forgot password failed",
          });
          return {
            success: false,
            data: null,
          };
        } finally {
          set({ isLoading: false });
        }
      },

      // reset password logic
      resetPassword: async (token, email, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/reset-password", {
            token,
            email,
            newPassword,
          });

          set({ isLoading: false, user: response.data.user });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Reset password failed"
              : "Reset password failed",
          });

          return false;
        }
      },

      // request email change
      requestEmailChange: async (newEmail, currentPassword) => {
        set({ isRequestingEmailChange: true, emailChangeError: null });

        try {
          const response = await axiosInstance.post("/request-email-change", {
            newEmail,
            currentPassword,
          });

          if (response.data.success) {
            set({
              isRequestingEmailChange: false,
              newEmailForVerification: newEmail,
            });

            return {
              success: response.data.success,
              message: response.data.message,
            };
          } else {
            const errorMessage =
              response.data.message || "Failed to request email change";
            set({
              emailChangeError: errorMessage,
              isRequestingEmailChange: false,
            });

            return {
              success: response.data.success,
              message: response.data.message,
            };
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to request email change";
          set({
            emailChangeError: errorMessage,
            isRequestingEmailChange: false,
          });

          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // verify email change
      verifyEmailChange: async (code) => {
        set({ isVerifyingEmailChange: true, emailChangeError: null });

        try {
          const response = await axiosInstance.post("/verify-email-change", {
            code,
          });

          if (response.data.success) {
            const newEmail = get().newEmailForVerification;
            set((state) => ({
              user:
                state.user && newEmail
                  ? { ...state.user, email: newEmail }
                  : state.user,
              isVerifyingEmailChange: false,
              newEmailForVerification: null,
            }));

            return {
              success: response.data.success,
              message: response.data.message,
            };
          } else {
            const errorMessage =
              response.data.message || "Failed to verify email change";
            set({
              emailChangeError: errorMessage,
              isVerifyingEmailChange: false,
            });

            toast({
              title: "خطأ في تأكيد تغيير البريد الإلكتروني",
              description: errorMessage,
              variant: "error",
            });

            return {
              success: response.data.success,
              message: response.data.message,
            };
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to verify email change";
          set({
            emailChangeError: errorMessage,
            isVerifyingEmailChange: false,
          });

          toast({
            title: "خطأ في تأكيد تغيير البريد الإلكتروني",
            description: errorMessage,
            variant: "error",
          });
          return {
            success: false,
            message: "Failed to verify email change",
          };
        }
      },

      // request email change
      requestEmailVerified: async () => {
        try {
          const response = await axiosInstance.post("/request-email-verified");

          if (response.data.success) {
            return {
              success: response.data.success,
              message: response.data.message,
            };
          } else {
            const errorMessage =
              response.data.message || "Failed to request email change";
            response.data.success;

            return {
              success: response.data.success,
              message: errorMessage,
            };
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to request email change";

          return {
            success: false,
            message: errorMessage,
          };
        }
      },
      updateProfile: async ({
        name,
        gender,
        birthDate,
        avatar,
        subscribeNewsletter,
      }: UpdateProfileParams) => {
        try {
          const formData = new FormData();
          // Append fields only if they are provided
          if (name !== undefined) formData.append("name", name);
          if (gender !== undefined) formData.append("gender", gender);
          if (subscribeNewsletter !== undefined) formData.append("subscribeNewsletter", String(subscribeNewsletter));
          if (birthDate !== undefined) {
            // Handle both string and Date objects
            const dateValue =
              birthDate instanceof Date ? birthDate.toISOString() : birthDate;
            formData.append("birthDate", dateValue);
          }
          if (avatar instanceof File) {
            formData.append("avatar", avatar);
          }

          const response = await axiosInstance.put(
            "/update-profile",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.data.success) {
            return {
              success: response.data.success,
              message: response.data.message,
              data: response.data.data, // Include the updated user data
            };
          } else {
            const errorMessage =
              response.data.message || "Failed to update profile";
            return {
              success: response.data.success,
              message: errorMessage,
            };
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to update profile";

          // Handle validation errors
          if (error.response?.data?.errors) {
            return {
              success: false,
              message: errorMessage,
              errors: error.response.data.errors,
            };
          }

          return {
            success: false,
            message: errorMessage,
          };
        }
      },

      // verify email change
      verifyEmailVerified: async (code) => {
        set({ isVerifyingEmailChange: true, emailChangeError: null });

        try {
          const response = await axiosInstance.post("/verify-email-verified", {
            code,
          });

          if (response.data.success) {
            const newEmail = get().newEmailForVerification;
            set((state) => ({
              user:
                state.user && newEmail
                  ? { ...state.user, email: newEmail }
                  : state.user,
              isVerifyingEmailChange: false,
              newEmailForVerification: null,
            }));

            return {
              success: response.data.success,
              message: response.data.message,
            };
          } else {
            const errorMessage =
              response.data.message || "Failed to verify email change";
            set({
              emailChangeError: errorMessage,
              isVerifyingEmailChange: false,
            });

            toast({
              title: "خطأ في تأكيد تغيير البريد الإلكتروني",
              description: errorMessage,
              variant: "error",
            });

            return {
              success: response.data.success,
              message: response.data.message,
            };
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Failed to verify email change";
          set({
            emailChangeError: errorMessage,
            isVerifyingEmailChange: false,
          });

          toast({
            title: "خطأ في تأكيد تغيير البريد الإلكتروني",
            description: errorMessage,
            variant: "error",
          });
          return {
            success: false,
            message: "Failed to verify email change",
          };
        }
      },

      getAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get("/");
          if (!response) {
            toast({
              title: "Error",
              description: "field to fetching users",
              variant: "error",
            });
          }
          set({ isLoading: false, user: response.data.user });
          return response.data.data;
        } catch (err) {
          console.error(err);
          toast({
            title: "Error",
            description: "Field to get users",
            variant: "error",
          });
        }
      },

      getUserByID: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.get(`/${id}`);
          if (response.status !== 200) {
            console.log("response :", response);
          }
          set({ isLoading: false, user: response.data.data });
          return response.data.data;
        } catch (err) {
          console.error(err);
          toast({
            title: "Error",
            description: "Field to get user",
            variant: "error",
          });
          return null;
        }
      },

      updateUserRole: async (id, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post(`/${id}`, { role });
          set({ isLoading: false, error: null, user: response.data.data });
          return true;
        } catch (err) {
          toast({
            title: "Error",
            description: "Field to update user role",
            variant: "error",
          });
          return false;
        }
      },

      deleteUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.delete(`/${id}`);
          set({ isLoading: false, error: null });

          return true;
        } catch (err) {
          toast({
            title: "Error",
            description: "Field to deleted user",
            variant: "error",
          });
          return false;
        }
      },

      // clear email change error
      clearEmailChangeError: () => {
        set({ emailChangeError: null });
      },

      // reset store
      reset: () => {
        set({
          user: null,
          isLoading: false,
          error: null,
          isRequestingEmailChange: false,
          isVerifyingEmailChange: false,
          emailChangeError: null,
          newEmailForVerification: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
