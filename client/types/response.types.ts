export interface ApiResponse<T = any> {
  data?: T | null;
  success: boolean;
  message: string;
  timestamp?: string;
  requestId?: string;
  meta?: any;
  error?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    blogs: T[];
    pagination: PaginationMeta;
  };
  success: boolean;
  message: string;
  timestamp?: string;
  requestId?: string;
}

export interface ApiErrorDetails {
  status?: number;
  statusText?: string;
  code?: string;
  url?: string;
  method?: string;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  onUnauthorized?: () => void;
}
