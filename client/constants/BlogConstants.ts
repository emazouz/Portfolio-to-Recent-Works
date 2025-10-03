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
