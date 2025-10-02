"use client";
import React from "react";
import { useTranslation } from "@/hooks/use-translation";

// Hooks
import {
  useBlogValidation,
  useBlogForm,
  useFormNavigation,
  useBlogsData,
} from "@/hooks/blogs/useBlogsData";
import { useImageUpload } from "@/hooks/useImageUpload";

// Components
import { BlogFormHeader } from "@/components/admin/blogs/BlogFormHeader";
import { BlogFormTabs } from "@/components/admin/blogs/BlogFormTabs";
import { BlogFormActions } from "@/components/admin/blogs/BlogFormActions";
import { ValidationAlert } from "@/components/admin/blogs/ValidationAlert";
import { LoadingScreen } from "@/components/admin/blogs/LoadingScreen";

interface BlogFormProps {
  blogId?: number;
}

export function BlogForm({ blogId }: BlogFormProps) {
  const { t } = useTranslation();
  const { addOrUpdateBlog, getBlog } = useBlogsData();

  // Custom hooks - FIXED: Pass getBlog function to useBlogForm
  const {
    formData,
    tags,
    keywords,
    publishDate,
    isLoading,
    isInitialLoading,
    hasUnsavedChanges,
    handleInputChange,
    handleTagChange,
    handleKeywordsChange,
    setPublishDate,
    setIsLoading,
  } = useBlogForm(blogId, getBlog);

  const {
    validationErrors,
    validateForm,
    clearFieldError,
    setValidationErrors,
  } = useBlogValidation();

  const {
    imageFile,
    imagePreview,
    existingImageUrl,
    dragActive,
    fileInputRef,
    handleImageFile,
    removeImage,
    getCurrentImageUrl,
    setExistingImageUrl,
    ...imageHandlers
  } = useImageUpload();

  const { activeTab, setActiveTab, handleBack, handlePreview, focusErrorTab } =
    useFormNavigation(
      hasUnsavedChanges,
      formData,
      tags,
      keywords,
      publishDate,
      getCurrentImageUrl,
      blogId
    );

  // Form submission - FIXED: Pass object with named parameters
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await addOrUpdateBlog({
      formData,
      imageFile,
      tags,
      keywords,
      blogId,
      publishDate,
      validateForm,
      setValidationErrors,
    });

    // Handle validation errors by focusing the appropriate tab
    if (result && !result.success && result.errors) {
      focusErrorTab(result.errors);
    }
  };

  if (isInitialLoading) {
    return (
      <LoadingScreen
        message={t("Loading blog data...", "admin.form.loadingBlog")}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BlogFormHeader
        blogId={blogId}
        isLoading={isLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        onBack={handleBack}
        onPreview={handlePreview}
      />

      <ValidationAlert validationErrors={validationErrors} />

      <BlogFormTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formData={formData}
        tags={tags}
        keywords={keywords}
        publishDate={publishDate}
        validationErrors={validationErrors}
        imageFile={imageFile}
        imagePreview={imagePreview}
        existingImageUrl={existingImageUrl}
        dragActive={dragActive}
        fileInputRef={fileInputRef}
        onInputChange={handleInputChange}
        onTagChange={handleTagChange}
        onKeywordsChange={handleKeywordsChange}
        onPublishDateChange={setPublishDate}
        onImageFile={handleImageFile}
        onRemoveImage={removeImage}
        getCurrentImageUrl={getCurrentImageUrl}
        clearFieldError={clearFieldError}
        {...imageHandlers}
      />

      <BlogFormActions blogId={blogId} isLoading={isLoading} />
    </form>
  );
}
