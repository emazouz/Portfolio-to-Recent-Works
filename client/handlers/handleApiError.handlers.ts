


// export interface ApiResponse<T = any> {
//   data?: T | null;
//   success: boolean;
//   message: string;
//   timestamp?: string;
//   requestId?: string;
//   meta?: any;
//   error?: string;
// }



// export interface PaginatedResponse<T> {
//   data: {
//     blogs: T[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalCount: number;
//       hasNextPage: boolean;
//       hasPrevPage: boolean;
//     };
//   };
//   success: boolean;
//   message: string;
//   timestamp?: string;
//   requestId?: string;
// }

// import axios, { AxiosError } from "axios";



// // Your helper function (now exported)
// export const handleApiError = (error: unknown): ApiResponse<null> => {
//   console.error("API Error:", error);

//   if (axios.isAxiosError(error)) {
//     const axiosError = error as AxiosError<ApiResponse>;

//     if (axiosError.response?.data) {
//       // Server-provided error
//       return {
//         success: false,
//         message: axiosError.response.data.message || "An error occurred",
//         data: null,
//       };
//     }

//     if (axiosError.code === "ECONNABORTED") {
//       // Timeout error
//       return {
//         success: false,
//         message: "Request timeout. Please try again.",
//         data: null,
//       };
//     }

//     if (!axiosError.response) {
//       // Network error
//       return {
//         success: false,
//         message: "Network error. Please check your connection.",
//         data: null,
//       };
//     }
//   }

//   // Fallback for unknown errors
//   return {
//     success: false,
//     message: "An unexpected error occurred. Please try again.",
//     data: null,
//   };
// };



import axios, { AxiosError } from "axios";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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

// ============================================================================
// CONSTANTS
// ============================================================================

const ERROR_CODES = {
  TIMEOUT: "ECONNABORTED",
  NETWORK_ERROR: "ERR_NETWORK",
  CANCELED: "ERR_CANCELED",
} as const;

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

const ERROR_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: "Invalid request. Please check your input.",
  [HTTP_STATUS.UNAUTHORIZED]: "Unauthorized. Please login again.",
  [HTTP_STATUS.FORBIDDEN]: "You don't have permission to perform this action.",
  [HTTP_STATUS.NOT_FOUND]: "The requested resource was not found.",
  [HTTP_STATUS.CONFLICT]: "A conflict occurred. The resource may already exist.",
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: "Unable to process your request. Please check your input.",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Server error. Please try again later.",
  [HTTP_STATUS.BAD_GATEWAY]: "Server is temporarily unavailable.",
  [HTTP_STATUS.SERVICE_UNAVAILABLE]: "Service is temporarily unavailable.",
  [ERROR_CODES.TIMEOUT]: "Request timeout. Please try again.",
  [ERROR_CODES.NETWORK_ERROR]: "Network error. Please check your connection.",
  [ERROR_CODES.CANCELED]: "Request was canceled.",
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extracts detailed error information from an AxiosError
 */
const extractErrorDetails = (error: AxiosError): ApiErrorDetails => {
  return {
    status: error.response?.status,
    statusText: error.response?.statusText,
    code: error.code,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
  };
};

/**
 * Gets user-friendly error message based on error code or status
 */
const getErrorMessage = (
  code?: string,
  status?: number,
  serverMessage?: string
): string => {
  // Prioritize server-provided message if available and meaningful
  if (serverMessage && serverMessage.length > 0 && serverMessage !== "An error occurred") {
    return serverMessage;
  }

  // Check for error code message
  if (code && code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
  }

  // Check for HTTP status message
  if (status && status in ERROR_MESSAGES) {
    return ERROR_MESSAGES[status as keyof typeof ERROR_MESSAGES];
  }

  // Generic fallback
  return "An unexpected error occurred. Please try again.";
};

/**
 * Logs error details in development environment
 */
const logErrorDetails = (error: unknown, details?: ApiErrorDetails): void => {
  if (process.env.NODE_ENV === "development") {
    console.group("🚨 API Error Details");
    console.error("Error:", error);
    if (details) {
      console.table(details);
    }
    console.groupEnd();
  } else {
    // Production: Log minimal error info
    console.error("API Error:", details?.status, details?.method, details?.url);
  }
};

// ============================================================================
// MAIN ERROR HANDLER
// ============================================================================

/**
 * Handles API errors and returns a standardized ApiResponse
 * 
 * @param error - The error object (typically from axios)
 * @returns Standardized error response
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await api.get('/users');
 * } catch (error) {
 *   const errorResponse = handleApiError(error);
 *   console.log(errorResponse.message); // User-friendly error message
 * }
 * ```
 */
export const handleApiError = <T = null>(error: unknown): ApiResponse<T> => {
  // Handle Axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    const details = extractErrorDetails(axiosError);

    logErrorDetails(error, details);

    // Server responded with error
    if (axiosError.response?.data) {
      const serverResponse = axiosError.response.data;

      return {
        success: false,
        message: getErrorMessage(
          details.code,
          details.status,
          serverResponse.message
        ),
        data: null as T,
        error: serverResponse.error,
        timestamp: serverResponse.timestamp || new Date().toISOString(),
        requestId: serverResponse.requestId,
      };
    }

    // Request timeout
    if (axiosError.code === ERROR_CODES.TIMEOUT) {
      return {
        success: false,
        message: ERROR_MESSAGES[ERROR_CODES.TIMEOUT],
        data: null as T,
        error: "TIMEOUT",
      };
    }

    // Request canceled
    if (axiosError.code === ERROR_CODES.CANCELED) {
      return {
        success: false,
        message: ERROR_MESSAGES[ERROR_CODES.CANCELED],
        data: null as T,
        error: "CANCELED",
      };
    }

    // Network error (no response received)
    if (!axiosError.response) {
      return {
        success: false,
        message: ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR],
        data: null as T,
        error: "NETWORK_ERROR",
      };
    }

    // Generic axios error with response but no data
    return {
      success: false,
      message: getErrorMessage(details.code, details.status),
      data: null as T,
      error: details.statusText || "UNKNOWN_ERROR",
    };
  }

  // Handle non-axios errors
  logErrorDetails(error);

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
      data: null as T,
      error: error.name,
    };
  }

  // Fallback for completely unknown errors
  return {
    success: false,
    message: "An unexpected error occurred. Please try again.",
    data: null as T,
    error: "UNKNOWN_ERROR",
  };
};
