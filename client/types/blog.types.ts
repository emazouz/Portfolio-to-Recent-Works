import { CreateBlogInput } from "@/validators/blog.validate";
import { CommentType } from "./comment.types";
import { ApiResponse, PaginatedResponse, PaginationMeta } from "./response.types";

export interface Blog extends CreateBlogInput {
  id: number;
  imageUrl?: string;
  previewImages: string[];
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  views: number;
  likes: number;
  comments?: CommentType[];
  userLiked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}



// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta
}

export interface BlogActions {
  createBlog: (
    blog: CreateBlogInput,
    imageFile: File,
    previewImages: File[]
  ) => Promise<ApiResponse<Blog>>;
  updateBlog: (
    blogId: number,
    blog: CreateBlogInput,
    imageFile?: File,
    previewImages?: File[]
  ) => Promise<ApiResponse<Blog>>;
  getBlogs: (
    filters?: BlogFilters,
    pagination?: PaginationParams
  ) => Promise<ApiResponse<PaginatedResponse<Blog>>>;
  getBlogById: (blogId: number) => Promise<ApiResponse<Blog>>;
  deleteBlog: (blogId: number) => Promise<ApiResponse<void>>;
  addLikeBlog: (blogId: number) => Promise<ApiResponse<Blog>>;
  getLocalizedContent: (
    blog: Blog,
    currentLanguage: string
  ) => LocalizedContentType;
  setCurrentBlog: (blog: Blog | null) => void;
  clearError: () => void;
  resetStore: () => void;
}

export type BlogStore = BlogState & BlogActions;



export interface BlogFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface LocalizedContentType {
  title: string;
  excerpt: string;
  metaDesc: string;
  metaTitle: string;
  content: string;
}
export const MAX_TAGS = 10;
export const MAX_KEYWORDS = 10;

// types/BlogFormTypes.ts
export interface ValidationErrors {
  [key: string]: string;
}
export interface BlogParamsProps {
  blogId: string;
}

export interface BlogFormHeaderProps {
  blogId?: number;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  onBack: () => void;
  onPreview: () => void;
}

export interface SeoTabProps {
  formData: Blog;
  keywords: string[];
  validationErrors: ValidationErrors;
  onInputChange: (field: keyof Blog, value: string | boolean) => void;
  onKeywordsChange: {
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
  };
  clearFieldError: (field: string) => void;
}

export interface BasicInfoTabProps {
  formData: Blog;
  keywords?: string[];
  onKeywordsChange?: {
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
  };
  validationErrors: ValidationErrors;
  onInputChange: (field: keyof Blog, value: string | boolean) => void;
  clearFieldError: (field: string) => void;
}

export const INITIAL_FORM_DATA = {
  title_en: "",
  title_ar: "",
  content_en: "",
  content_ar: "",
  excerpt_en: "",
  excerpt_ar: "",
  category: "OTHER",
  slug: "",
  metaTitle_en: "",
  metaTitle_ar: "",
  metaDesc_en: "",
  metaDesc_ar: "",
  published: false,
  featured: false,
  keywords: [] as string[],
  tags: [] as string[],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
} as Blog;

export interface BlogFormTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  formData: Blog;
  tags: string[];
  keywords: string[];
  publishDate: Date | undefined;
  validationErrors: ValidationErrors;
  imageFile: File | null;
  imagePreview: string;
  existingImageUrl: string;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (field: keyof Blog, value: string | boolean) => void;
  onTagChange: {
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
  };
  onKeywordsChange: {
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
  };
  onPublishDateChange: (date: Date | undefined) => void;
  onImageFile: (file: File) => void;
  onRemoveImage: () => void;
  getCurrentImageUrl: () => string | null;
  clearFieldError: (field: string) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SettingsTabProps {
  formData: Blog;
  publishDate: Date | undefined;
  onInputChange: (field: keyof Blog, value: string | boolean) => void;
  onPublishDateChange: (date: Date | undefined) => void;
}

export interface MediaTabProps {
  imageUrl: string;
  images: string[] | [];
  imageFile: File | null;
  imagePreview: string;
  existingImageUrl: string;
  dragActive: boolean;
  validationErrors: ValidationErrors;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageFile: (file: File) => void;
  onRemoveImage: () => void;
  getCurrentImageUrl: () => string | null;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFieldError: (field: string) => void;
  maxImages: number;
  handleImageFile: (file: File) => void;
  removeImage: (index: number) => void;
  setExistingImageUrl: (url: string) => void;
  handleMultipleImageFiles: (files: File[]) => void;
  removeMultipleImage: (index: string) => void;
  removeAllImages: () => void;
  canAddMoreImages: boolean;
  remainingSlots: number;
}

export interface ContentTabProps {
  formData: Blog;
  tags: string[];
  validationErrors: ValidationErrors;
  onInputChange: (field: keyof Blog, value: string | boolean) => void;
  onTagChange: {
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
  };
  clearFieldError: (field: string) => void;
}

export interface BlogCardProps {
  article: Blog;
  index: number;
  language?: "en" | "ar";
  onReadMore?: (blogId: number) => void;
}

export type ViewMode = "grid" | "list";
export type SortOption =
  | "newest"
  | "oldest"
  | "mostViewed"
  | "mostLiked"
  | "trending";

export interface Category {
  value: string;
  label: string;
  icon: string;
}

export interface SortConfig {
  value: SortOption;
  label: string;
}

export interface BlogStatisticsCardProps {
  blog: Blog;
  currentLanguage: string;
}

export interface BlogHeaderProps {
  blog: Blog;
  localizedContent: any;
  formatDate: (date: string) => string;
  currentLanguage: string;
  isLiked: boolean;
  handleLike: () => void;
  handleBookmark: () => void;
  isBookmarked: boolean;
}

export interface RelatedPostsProps {
  currentBlogId: number;
  category: string;
}
