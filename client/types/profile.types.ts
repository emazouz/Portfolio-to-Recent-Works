import { UserType } from "@/store/authStore";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
export type TabValue =
  | "profile"
  | "security"
  | "email"
  | "preferences"
  | "reviews";
export type ReviewFilter = "all" | "5" | "4" | "3" | "2" | "1";

export interface PasswordState {
  current: string;
  new: string;
  confirm: string;
}

export interface MessageState {
  success: string;
  error: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  project?: {
    title_en: string;
  };
}

export interface UserProfile extends UserType {
  avatarFile?: File;
}
