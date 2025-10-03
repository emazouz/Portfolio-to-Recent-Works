import { AuthenticatedRequest } from "../middleware/auth";

export interface FileRequest extends AuthenticatedRequest {
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

export type MulterFiles = {
  gallery?: Express.Multer.File[];
  previewImages?: Express.Multer.File[];
  imageUrl?: Express.Multer.File[];
  zipFile?: Express.Multer.File[];
};