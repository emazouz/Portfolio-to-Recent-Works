'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { Blog } from "@/store/blogStore";
import { ContentTabProps, MAX_TAGS } from "@/types/BlogType";
import { X } from "lucide-react";
import { useState } from "react";



export function ContentTab({
  formData,
  tags,
  validationErrors,
  onInputChange,
  onTagChange,
  clearFieldError,
}: ContentTabProps) {
  const { t } = useTranslation();
  const [newTag, setNewTag] = useState("");

  const handleInputChange = (field: keyof Blog, value: string) => {
    onInputChange(field, value);
    if (validationErrors[field]) {
      clearFieldError(field);
    }
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag || tags.includes(trimmedTag) || tags.length >= MAX_TAGS)
      return;

    onTagChange.addTag(trimmedTag);
    setNewTag("");
    if (validationErrors.tags) {
      clearFieldError("tags");
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Content & Excerpts", "admin.form.contentExcerpts")}
        </CardTitle>
        <CardDescription>
          {t(
            "Write your blog content and excerpts",
            "admin.form.blogContentDescription"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Excerpts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="excerpt_en" className="text-sm font-medium">
              {t("Excerpt (English)", "admin.form.excerptEn")}
            </Label>
            <Textarea
              id="excerpt_en"
              value={formData.excerpt_en}
              onChange={(e) => handleInputChange("excerpt_en", e.target.value)}
              placeholder={t(
                "Brief summary in English",
                "admin.form.excerptEnPlaceholder"
              )}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt_ar" className="text-sm font-medium">
              {t("Excerpt (Arabic)", "admin.form.excerptAr")}
            </Label>
            <Textarea
              id="excerpt_ar"
              value={formData.excerpt_ar}
              onChange={(e) => handleInputChange("excerpt_ar", e.target.value)}
              placeholder={t(
                "Brief summary in Arabic",
                "admin.form.excerptArPlaceholder"
              )}
              rows={3}
              dir="rtl"
            />
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content_en" className="text-sm font-medium">
            {t("Content (English)", "admin.form.contentEn")} *
          </Label>
          <Textarea
            id="content_en"
            value={formData.content_en}
            onChange={(e) => handleInputChange("content_en", e.target.value)}
            placeholder={t(
              "Write your blog content in English",
              "admin.form.contentEnPlaceholder"
            )}
            rows={12}
            className={validationErrors.content_en ? "border-red-500" : ""}
          />
          {validationErrors.content_en && (
            <p className="text-sm text-red-500">
              {validationErrors.content_en}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {t("Supports Markdown formatting", "admin.form.markdownSupport")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content_ar" className="text-sm font-medium">
            {t("Content (Arabic)", "admin.form.contentAr")} *
          </Label>
          <Textarea
            id="content_ar"
            value={formData.content_ar}
            onChange={(e) => handleInputChange("content_ar", e.target.value)}
            placeholder={t(
              "Write your blog content in Arabic",
              "admin.form.contentArPlaceholder"
            )}
            rows={12}
            dir="rtl"
            className={validationErrors.content_ar ? "border-red-500" : ""}
          />
          {validationErrors.content_ar && (
            <p className="text-sm text-red-500">
              {validationErrors.content_ar}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("Tags", "admin.form.tags")} *
            <span className="text-gray-500 text-xs ml-2">
              ({tags.length}/{MAX_TAGS})
            </span>
          </Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder={t("Add a tag", "admin.form.addTag")}
              onKeyPress={handleTagKeyPress}
              className={validationErrors.tags ? "border-red-500" : ""}
              disabled={tags.length >= MAX_TAGS}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="outline"
              disabled={!newTag.trim() || tags.length >= MAX_TAGS}
            >
              {t("Add", "admin.form.add")}
            </Button>
          </div>
          {validationErrors.tags && (
            <p className="text-sm text-red-500">{validationErrors.tags}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onTagChange.removeTag(tag)}
                  aria-label={t("Remove tag", "admin.form.removeTag")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("Maximum 10 tags allowed", "admin.form.maxTags")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
