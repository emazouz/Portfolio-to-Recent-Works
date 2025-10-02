import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/use-translation";
import { BlogFormTabsProps } from "@/types/BlogType";
import { SettingsTab } from "./SettingsTab";
import { SeoTab } from "./SeoTab";
import { BasicInfoTab } from "./BasicInfoTab";
import { ContentTab } from "./ContentTab";
import { MediaTab } from "./MediaTab";

export function BlogFormTabs({
  activeTab,
  onTabChange,
  formData,
  tags,
  keywords,
  publishDate,
  validationErrors,
  imageFile,
  imagePreview,
  existingImageUrl,
  dragActive,
  fileInputRef,
  onInputChange,
  onTagChange,
  onKeywordsChange,
  onPublishDateChange,
  onImageFile,
  onRemoveImage,
  getCurrentImageUrl,
  clearFieldError,
  handleDrag,
  handleDrop,
  handleFileInputChange,
}: BlogFormTabsProps) {
  const { t } = useTranslation();

  const getTabError = (tabFields: string[]) => {
    return tabFields.some((field) => validationErrors[field]);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="basic" className="relative">
          {t("Basic Info", "admin.form.basic")}
          {getTabError(["title_en", "title_ar", "category", "slug"]) && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </TabsTrigger>

        <TabsTrigger value="content" className="relative">
          {t("Content", "admin.form.content")}
          {getTabError([
            "content_en",
            "content_ar",
            "excerpt_en",
            "excerpt_ar",
            "tags",
          ]) && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </TabsTrigger>

        <TabsTrigger value="media" className="relative">
          {t("Media", "admin.form.media")}
          {getTabError(["image"]) && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </TabsTrigger>

        <TabsTrigger value="seo" className="relative">
          {t("SEO", "admin.form.seo")}
          {getTabError([
            "metaTitle_en",
            "metaTitle_ar",
            "metaDesc_en",
            "metaDesc_ar",
            "keywords",
          ]) && (
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </TabsTrigger>

        <TabsTrigger value="settings">
          {t("Settings", "admin.form.settings")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <BasicInfoTab
          formData={formData}
          validationErrors={validationErrors}
          onInputChange={onInputChange}
          clearFieldError={clearFieldError}
        />
      </TabsContent>

      <TabsContent value="content">
        <ContentTab
          formData={formData}
          tags={tags}
          validationErrors={validationErrors}
          onInputChange={onInputChange}
          onTagChange={onTagChange}
          clearFieldError={clearFieldError}
        />
      </TabsContent>

      <TabsContent value="media">
        <MediaTab
          imageUrl={String(formData.imageUrl)}
          imageFile={imageFile}
          imagePreview={imagePreview}
          existingImageUrl={existingImageUrl}
          dragActive={dragActive}
          validationErrors={validationErrors}
          fileInputRef={fileInputRef}
          onImageFile={onImageFile}
          onRemoveImage={onRemoveImage}
          getCurrentImageUrl={getCurrentImageUrl}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleFileInputChange={handleFileInputChange}
          clearFieldError={clearFieldError}
        />
      </TabsContent>

      <TabsContent value="seo">
        <SeoTab
          formData={formData}
          keywords={keywords}
          validationErrors={validationErrors}
          onInputChange={onInputChange}
          onKeywordsChange={onKeywordsChange}
          clearFieldError={clearFieldError}
        />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab
          formData={formData}
          publishDate={publishDate}
          onInputChange={onInputChange}
          onPublishDateChange={onPublishDateChange}
        />
      </TabsContent>
    </Tabs>
  );
}
