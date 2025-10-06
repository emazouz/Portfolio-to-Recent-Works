export interface ResponseType {
  success: boolean;
  message: string;
  data?: any;
  meta?: any;
  errors?: any[];
}
