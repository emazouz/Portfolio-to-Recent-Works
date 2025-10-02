'use client'
// hooks/useImageUpload.ts
import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/hooks/use-toast";

const VALID_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function useImageUpload() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);

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
      const imageFile = files.find((file) =>
        VALID_IMAGE_TYPES.includes(file.type)
      );

      if (imageFile) {
        handleImageFile(imageFile);
      } else if (files.length > 0) {
        toast({
          title: t("Invalid file type", "validation.invalidFileType"),
          description: t(
            "Please select a JPEG, PNG, or WebP image",
            "validation.invalidImageType"
          ),
          variant: "error",
        });
      }
    },
    [handleImageFile, t]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageFile(file);
      }
    },
    [handleImageFile]
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return {
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
  };
}
