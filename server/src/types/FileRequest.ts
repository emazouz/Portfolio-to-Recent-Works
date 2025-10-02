import { AuthenticatedRequest } from "../middleware/auth";

export interface FileRequest extends AuthenticatedRequest {
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

export interface MulterFiles {
  gallery?: Express.Multer.File[];
}
