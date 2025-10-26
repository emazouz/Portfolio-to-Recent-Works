import {
  CategoryConfig,
  CategoryFilter,
  CategoryType,
} from "@/types/project.types";

export const STATUS_MAP = {
  COMPLETED: {
    en: "Completed",
    ar: "مكتمل",
    variant: "default" as const,
    gradient: "chart-5",
  },
  IN_PROGRESS: {
    en: "In Progress",
    ar: "قيد التطوير",
    variant: "secondary" as const,
    gradient: "chart-3",
  },
  PLANNING: {
    en: "Planning",
    ar: "في التخطيط",
    variant: "outline" as const,
    gradient: "chart-4",
  },
  ON_HOLD: {
    en: "On Hold",
    ar: "متوقف",
    variant: "outline" as const,
    gradient: "chart-7",
  },
};

export const CATEGORY_MAP = {
  WEB_DEVELOPMENT: { en: "Web Development", ar: "تطوير الويب" },
  MOBILE_APP: { en: "Mobile App", ar: "تطبيق الموبايل" },
  DESKTOP_APP: { en: "Desktop App", ar: "تطبيق سطح المكتب" },
  UI_UX_DESIGN: { en: "UI/UX Design", ar: "تصميم واجهات" },
  API_DEVELOPMENT: { en: "API Development", ar: "تطوير API" },
  OTHER: { en: "Other", ar: "أخرى" },
};

export const STATUS_PROGRESS = {
  COMPLETED: 100,
  IN_PROGRESS: 75,
  PLANNING: 25,
  ON_HOLD: 50,
};

export const categoryConfig: Record<CategoryType, CategoryConfig> = {
  WEB_DEVELOPMENT: {
    gradient: "from-sky-500 via-blue-500 to-cyan-500",
    glow: "shadow-sky-500/50",
    badge: "bg-gradient-to-r from-sky-500 to-cyan-500",
  },
  UI_UX: {
    gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    glow: "shadow-purple-500/50",
    badge: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  FULL_STACK: {
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glow: "shadow-amber-500/50",
    badge: "bg-gradient-to-r from-amber-500 to-yellow-500",
  },
  AI_ML: {
    gradient: "from-emerald-500 via-teal-500 to-green-500",
    glow: "shadow-emerald-500/50",
    badge: "bg-gradient-to-r from-emerald-500 to-teal-500",
  },
  DATA_ANALYTICS: {
    gradient: "from-rose-500 via-red-500 to-pink-500",
    glow: "shadow-rose-500/50",
    badge: "bg-gradient-to-r from-rose-500 to-pink-500",
  },
};

export const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: "all", label: "All Projects", gradient: "chart-1" },
  {
    key: "web",
    label: "Web Development",
    value: "WEB_DEVELOPMENT",
    gradient: "chart-3",
  },
  {
    key: "mobile",
    label: "Mobile App",
    value: "MOBILE_APP",
    gradient: "chart-5",
  },
  {
    key: "desktop",
    label: "Desktop App",
    value: "DESKTOP_APP",
    gradient: "chart-4",
  },
  {
    key: "api",
    label: "API Development",
    value: "API_DEVELOPMENT",
    gradient: "chart-7",
  },
  {
    key: "ui",
    label: "UI/UX Design",
    value: "UI_UX_DESIGN",
    gradient: "chart-2",
  },
  { key: "other", label: "Other", value: "OTHER", gradient: "chart-6" },
];

export const STATUS_VARIANTS = {
  COMPLETED: { variant: "default" as const, gradient: "chart-5" },
  IN_PROGRESS: { variant: "secondary" as const, gradient: "chart-3" },
  PLANNING: { variant: "outline" as const, gradient: "chart-4" },
  ON_HOLD: { variant: "destructive" as const, gradient: "chart-7" },
};
