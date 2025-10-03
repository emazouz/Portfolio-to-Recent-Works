import Image from "next/image";
import { Upload, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MediaTabProps } from "@/types/BlogType";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export function MediaTab({
  imageUrl,
  imageFile,
  imagePreview,
  existingImageUrl,
  dragActive,
  validationErrors,
  fileInputRef,
  onImageFile,
  onRemoveImage,
  getCurrentImageUrl,
  handleDrag,
  handleDrop,
  handleFileInputChange,
  clearFieldError,
}: MediaTabProps) {
  const { t } = useTranslation();

  const currentImageUrl = imageUrl || getCurrentImageUrl();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Featured Image", "admin.form.featuredImage")}</CardTitle>
        <CardDescription>
          {t(
            "Add a featured image for your blog post",
            "admin.form.featuredImageDescription"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("Blog Image", "admin.form.blogImage")} *
          </Label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : validationErrors.image
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            aria-label={t("Upload blog image", "admin.form.uploadImage")}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              aria-describedby={
                validationErrors.image ? "image-error" : undefined
              }
            />

            {currentImageUrl ? (
              <div className="space-y-4">
                <div className="relative group">
                  <Image
                    width={400}
                    height={200}
                    src={currentImageUrl}
                    alt="Blog preview"
                    className="w-full max-h-64 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=200&width=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      {t("Change", "common.change")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveImage();
                        if (validationErrors.image) {
                          clearFieldError("image");
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  {t(
                    "Drag and drop your image here, or click to browse",
                    "admin.form.dragDropImage"
                  )}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {t(
                    "Supports JPEG, PNG, WebP (Max 5MB)",
                    "admin.form.supportedFormats"
                  )}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  {t("Choose Image", "admin.form.chooseImage")}
                </Button>
              </div>
            )}
          </div>
          {validationErrors.image && (
            <p id="image-error" className="text-sm text-red-500">
              {validationErrors.image}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
