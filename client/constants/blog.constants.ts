import { Category, SortConfig } from "@/types/blog.types";

export const BLOG_CATEGORIES = [
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "MOBILE_DEVELOPMENT", label: "Mobile Development" },
  { value: "UI_UX_DESIGN", label: "UI/UX Design" },
  { value: "PROGRAMMING_TIPS", label: "Programming Tips" },
  { value: "TUTORIALS", label: "Tutorials" },
  { value: "NEWS", label: "News" },
  { value: "PERSONAL", label: "Personal" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "OTHER", label: "Other" },
] as const;

export const MAX_TAGS = 10;
export const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Theme-aware category color mapping using chart colors
export const categoryColorMap: Record<string, string> = {
  WEB_DEVELOPMENT: "bg-chart-3/90", // Blue/Cyan
  BACKEND: "bg-chart-5/90", // Green/Emerald
  PROGRAMMING: "bg-chart-1/90", // Primary/Purple
  UI_UX: "bg-chart-2/90", // Pink/Rose
  DATABASE: "bg-chart-4/90", // Orange/Amber
  PERFORMANCE: "bg-chart-7/90", // Red/Orange
  MOBILE_DEVELOPMENT: "bg-chart-8/90",
};

export const ITEMS_PER_PAGE = 9;
export const MAX_PAGINATION_BUTTONS = 5;

export const CATEGORIES: Category[] = [
  { value: "All", label: "All Categories", icon: "📚" },
  { value: "WEB_DEVELOPMENT", label: "Web Development", icon: "🌐" },
  { value: "MOBILE_DEVELOPMENT", label: "Mobile Development", icon: "📱" },
  { value: "BACKEND", label: "Backend", icon: "⚙️" },
  { value: "AI_ML", label: "AI/ML", icon: "🤖" },
];

export const SORT_OPTIONS: SortConfig[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "mostViewed", label: "Most Viewed" },
  { value: "mostLiked", label: "Most Liked" },
  { value: "trending", label: "Trending" },
];
