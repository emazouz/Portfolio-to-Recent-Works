"use client";
// hooks/useImageUpload.ts
import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/hooks/use-toast";

const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 5;

export interface ImageItem {
  file: File;
  preview: string;
  id: string;
}

export function useImageUpload() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

  // Multiple images state
  const [images, setImages] = useState<ImageItem[]>([]);

  const handleImageFile = useCallback(
    (file: File) => {
      // Validate file type
      if (!VALID_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: t("Invalid file type", "validation.invalidFileType"),
          description: t(
            "Please select a JPEG, PNG, or WebP image",
            "validation.invalidImageType"
          ),
          variant: "error",
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: t("File too large", "validation.fileTooLarge"),
          description: t(
            "Please select an image smaller than 5MB",
            "validation.imageSizeLimit"
          ),
          variant: "error",
        });
        return;
      }

      setImageFile(file);

      // Create preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    },
    [imagePreview, t]
  );

  const handleMultipleImageFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Check if adding these files would exceed the limit
      if (images.length + files.length > MAX_IMAGES) {
        toast({
          title: t("Too many images", "validation.tooManyImages"),
          description: t(
            `You can only upload up to ${MAX_IMAGES} images`,
            "validation.maxImagesLimit"
          ),
          variant: "error",
        });
        return;
      }

      files.forEach((file) => {
        // Validate file type
        if (!VALID_IMAGE_TYPES.includes(file.type)) {
          errors.push(`${file.name}: Invalid file type`);
          return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: File too large (max 5MB)`);
          return;
        }

        validFiles.push(file);
      });

      // Show errors if any
      if (errors.length > 0) {
        toast({
          title: t("Some files were rejected", "validation.filesRejected"),
          description: errors.join(", "),
          variant: "error",
        });
      }

      // Add valid files
      if (validFiles.length > 0) {
        const newImages: ImageItem[] = validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }));

        setImages((prev) => [...prev, ...newImages]);

        toast({
          title: t("Images uploaded", "success.imagesUploaded"),
          description: t(
            `${validFiles.length} image(s) added successfully`,
            "success.imagesAdded"
          ),
        });
      }
    },
    [images.length, t]
  );

  const removeImage = useCallback(() => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreview]);

  const removeMultipleImage = useCallback((id: string) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const removeAllImages = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview);
    });
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [images]);

  const getCurrentImageUrl = useCallback(() => {
    return imagePreview || existingImageUrl || null;
  }, [imagePreview, existingImageUrl]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (
        x < rect.left ||
        x >= rect.right ||
        y < rect.top ||
        y >= rect.bottom
      ) {
        setDragActive(false);
      }
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((file) =>
        VALID_IMAGE_TYPES.includes(file.type)
      );

      if (imageFiles.length > 0) {
        handleMultipleImageFiles(imageFiles);
      } else if (files.length > 0) {
        toast({
          title: t("Invalid file type", "validation.invalidFileType"),
          description: t(
            "Please select JPEG, PNG, or WebP images",
            "validation.invalidImageType"
          ),
          variant: "error",
        });
      }
    },
    [handleMultipleImageFiles, t]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleMultipleImageFiles(Array.from(files));
      }
    },
    [handleMultipleImageFiles]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      images.forEach((img) => {
        URL.revokeObjectURL(img.preview);
      });
    };
  }, [imagePreview, images]);

  return {
    // Single image (original functionality)
    imageFile,
    imagePreview,
    existingImageUrl,
    dragActive,
    fileInputRef,
    handleImageFile,
    removeImage,
    getCurrentImageUrl,
    setExistingImageUrl,
    handleDrag,
    handleDrop,
    handleFileInputChange,

    // Multiple images
    images,
    handleMultipleImageFiles,
    removeMultipleImage,
    removeAllImages,
    maxImages: MAX_IMAGES,
    canAddMoreImages: images.length < MAX_IMAGES,
    remainingSlots: MAX_IMAGES - images.length,
  };
}
