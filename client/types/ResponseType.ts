export interface ResponseType {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
}