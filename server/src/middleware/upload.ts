import multer from "multer";
import { Request } from "express";
import { MulterFiles } from "../types/FileRequest";

// Configure storage to use memory (you can change to disk if needed)
const storage = multer.memoryStorage();

// Optional: Add file type filtering here
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (
    file.mimetype === "application/zip" ||
    file.mimetype === "application/x-zip-compressed" ||
    file.originalname.endsWith(".zip") // fallback للتأكد من الامتداد
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

// Create multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB max per file
  },
  fileFilter,
});

// Export middleware to accept specific file fields
const uploadMiddleware = upload.fields([
  { name: "gallery", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
  { name: "previewImages", maxCount: 5 },
  { name: "imageUrl", maxCount: 1 },
]);

export const getFiles = (files: any): MulterFiles => {
  if (!files) return {};
  return {
    gallery: files.gallery || [],
    avatar: files.gallery || [],
    previewImages: files.previewImages || [],
    imageUrl: files.imageUrl || [],
  };
};

export default uploadMiddleware;
