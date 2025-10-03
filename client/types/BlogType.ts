import { Blog } from "@/store/blogStore";

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

