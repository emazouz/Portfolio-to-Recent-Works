// reset password /start

export interface FormData {
  password: string;
  confirmPassword: string;
}

export interface ValidationError {
  field?: string;
  message: string;
}

export enum TokenValidationState {
  LOADING = "LOADING",
  VALID = "VALID",
  INVALID = "INVALID",
}





// reset password /end
