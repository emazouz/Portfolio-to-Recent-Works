import { CreateProjectInput } from "@/validators/project.validate";
import { ApiResponse } from "./response.types";

export interface Project extends CreateProjectInput {
  id: number;
  imageUrl?: string;
  ratingsCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFilters {
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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}

export type ProjectStore = {
  // State
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // Actions
  createProject: (
    project: CreateProjectInput,
    imageFile: File
  ) => Promise<ApiResponse<Project>>;

  updateProject: (
    projectId: number,
    project: CreateProjectInput,
    imageFile?: File
  ) => Promise<ApiResponse<Project>>;

  getProjects: (
    filters?: ProjectFilters,
    pagination?: PaginationParams
  ) => Promise<ApiResponse<PaginatedResponse<Project>>>;

  getProjectById: (projectId: number) => Promise<ApiResponse<Project>>;

  deleteProject: (projectId: number) => Promise<ApiResponse<void>>;

  // Utility actions
  setCurrentProject: (project: Project | null) => void;
  clearError: () => void;
  resetStore: () => void;
};

export interface ProjectContentProps {
  localizedContent: LocalizedContent;
  project: Project;
  currentLanguage: string;
}

// Types & Utility Functions (UNCHANGED)

export interface LocalizedContent {
  title: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  slug: string;
}

export interface ProjectHeaderProps {
  project: Project;
  localizedContent: LocalizedContent;
  currentLanguage: string;
  statusVariant: "default" | "secondary" | "outline";
}

export interface ProjectActionsProps {
  project: Project;
  localizedContent: LocalizedContent;
}

export interface Technology {
  name: string;
  category?: "frontend" | "backend" | "database" | "tool" | "other";
}

export interface ProjectTechnologiesProps {
  technologies?: string[] | Technology[];
  variant?: "compact" | "detailed";
  showCategories?: boolean;
}

export interface ProjectProgressProps {
  progressPercentage: number;
  showMilestones?: boolean;
  animated?: boolean;
}

export interface ProjectMetaProps {
  project: {
    createdAt: string | Date;
    updatedAt: string | Date;
    rating: number;
    ratingsCount: number;
  };
  showStats?: boolean;
}

export interface ProjectImageProps {
  imageUrl?: string;
  title: string;
  badge?: string;
  onImageClick?: () => void;
}

// Type-safe category configuration

export interface CategoryConfig {
  gradient: string;
  glow: string;
  badge: string;
}

export interface ProjectCardProps {
  project: Project;
  index: number;
  language?: "en" | "ar";
  featured?: boolean;
}

export type CategoryType =
  | "WEB_DEVELOPMENT"
  | "UI_UX"
  | "FULL_STACK"
  | "AI_ML"
  | "DATA_ANALYTICS";

export interface CategoryFilter {
  key: string;
  label: string;
  value?: string;
  gradient: string;
}

export interface RelatedProjectsProps {
  currentProjectId: number;
  category: string;
}
