import {
  CATEGORY_MAP,
  STATUS_MAP,
  STATUS_PROGRESS,
} from "@/constants/project.constants";

export const getStatusText = (status: string, language: string): string => {
  return (
    STATUS_MAP[status as keyof typeof STATUS_MAP]?.[language as "en" | "ar"] ||
    status
  );
};

export const getCategoryText = (category: string, language: string): string => {
  return (
    CATEGORY_MAP[category as keyof typeof CATEGORY_MAP]?.[
      language as "en" | "ar"
    ] || category
  );
};

export const getProgressPercentage = (status: string): number => {
  return STATUS_PROGRESS[status as keyof typeof STATUS_PROGRESS] || 0;
};
