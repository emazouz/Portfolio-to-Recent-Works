import { PasswordState } from "@/types/profile.types";
import { Bell, Mail, MessageSquare,Lock, User } from "lucide-react";

export const TABS = [
  { value: "profile" as const, label: "My Profile", icon: User },
  { value: "security" as const, label: "Security", icon: Lock },
  { value: "email" as const, label: "Email Settings", icon: Mail },
  { value: "preferences" as const, label: "Preferences", icon: Bell },
  { value: "reviews" as const, label: "My Reviews", icon: MessageSquare },
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const MIN_PASSWORD_LENGTH = 8;
export const MESSAGE_TIMEOUT = 3000;
export const ERROR_TIMEOUT = 5000;

export const INITIAL_PASSWORD_STATE: PasswordState = {
  current: "",
  new: "",
  confirm: "",
};

