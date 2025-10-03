'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { Blog } from "@/store/blogStore";
import { MAX_KEYWORDS, SeoTabProps } from "@/types/BlogType";
import { X } from "lucide-react";
import { useState } from "react";

export function SeoTab({
  formData,
  keywords,
  validationErrors,
  onInputChange,
  onKeywordsChange,
  clearFieldError,
}: SeoTabProps) {
  const { t } = useTranslation();
  const [newKeyword, setNewKeyword] = useState("");

  const handleInputChange = (field: keyof Blog, value: string) => {
    onInputChange(field, value);
    if (validationErrors[field]) {
      clearFieldError(field);
    }
  };

  const addKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (
      !trimmedKeyword ||
      keywords.includes(trimmedKeyword) ||
      keywords.length >= MAX_KEYWORDS
    )
      return;

    onKeywordsChange.addTag(trimmedKeyword);
    setNewKeyword("");
    if (validationErrors.keywords) {
      clearFieldError("keywords");
    }
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("SEO Settings", "admin.form.seo")}</CardTitle>
        <CardDescription>
          {t(
            "Optimize your blog post for search engines",
            "admin.form.blogSeoDescription"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle_en" className="text-sm font-medium">
              {t("Meta Title (English)", "admin.form.metaTitleEn")}
            </Label>
            <Input
              id="metaTitle_en"
              value={formData.metaTitle_en}
              onChange={(e) =>
                handleInputChange("metaTitle_en", e.target.value)
              }
              placeholder={t(
                "SEO optimized title",
                "admin.form.metaTitlePlaceholder"
              )}
              maxLength={60}
            />
            <p className="text-xs text-gray-500">
              {formData.metaTitle_en?.length || 0}/60{" "}
              {t("characters", "common.characters")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaTitle_ar" className="text-sm font-medium">
              {t("Meta Title (Arabic)", "admin.form.metaTitleAr")}
            </Label>
            <Input
              id="metaTitle_ar"
              value={formData.metaTitle_ar}
              onChange={(e) =>
                handleInputChange("metaTitle_ar", e.target.value)
              }
              placeholder={t(
                "SEO optimized title in Arabic",
                "admin.form.metaTitleArPlaceholder"
              )}
              dir="rtl"
              maxLength={60}
            />
            <p className="text-xs text-gray-500">
              {formData.metaTitle_ar?.length || 0}/60{" "}
              {t("characters", "common.characters")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDesc_en" className="text-sm font-medium">
            {t("Meta Description (English)", "admin.form.metaDescEn")}
          </Label>
          <Textarea
            id="metaDesc_en"
            value={formData.metaDesc_en}
            onChange={(e) => handleInputChange("metaDesc_en", e.target.value)}
            placeholder={t(
              "SEO description for search results",
              "admin.form.metaDescPlaceholder"
            )}
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500">
            {formData.metaDesc_en?.length || 0}/160{" "}
            {t("characters", "common.characters")}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDesc_ar" className="text-sm font-medium">
            {t("Meta Description (Arabic)", "admin.form.metaDescAr")}
          </Label>
          <Textarea
            id="metaDesc_ar"
            value={formData.metaDesc_ar}
            onChange={(e) => handleInputChange("metaDesc_ar", e.target.value)}
            placeholder={t(
              "SEO description in Arabic",
              "admin.form.metaDescArPlaceholder"
            )}
            rows={3}
            dir="rtl"
            maxLength={160}
          />
          <p className="text-xs text-gray-500">
            {formData.metaDesc_ar?.length || 0}/160{" "}
            {t("characters", "common.characters")}
          </p>
        </div>

        {/* Read Time Field */}
        <div className="space-y-2">
          <Label htmlFor="readTime" className="text-sm font-medium">
            {t("Read Time (minutes)", "admin.form.readTime")}
          </Label>
          <Input
            id="readTime"
            type="number"
            value={formData.readTime || ""}
            onChange={(e) => handleInputChange("readTime", e.target.value)}
            placeholder={t(
              "Estimated reading time",
              "admin.form.readTimePlaceholder"
            )}
            min="1"
            max="60"
          />
          <p className="text-xs text-gray-500">
            {t(
              "Estimated time to read this post in minutes",
              "admin.form.readTimeDescription"
            )}
          </p>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("Keywords", "admin.form.keywords")}
            <span className="text-gray-500 text-xs ml-2">
              ({keywords.length}/{MAX_KEYWORDS})
            </span>
          </Label>
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder={t("Add a keyword", "admin.form.addKeyword")}
              onKeyPress={handleKeywordKeyPress}
              className={validationErrors.keywords ? "border-red-500" : ""}
              disabled={keywords.length >= MAX_KEYWORDS}
            />
            <Button
              type="button"
              onClick={addKeyword}
              variant="outline"
              disabled={!newKeyword.trim() || keywords.length >= MAX_KEYWORDS}
            >
              {t("Add", "admin.form.add")}
            </Button>
          </div>
          {validationErrors.keywords && (
            <p className="text-sm text-red-500">{validationErrors.keywords}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {keyword}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onKeywordsChange.removeTag(keyword)}
                  aria-label={t("Remove keyword", "admin.form.removeKeyword")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("Maximum 10 keywords allowed", "admin.form.maxKeywords")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
