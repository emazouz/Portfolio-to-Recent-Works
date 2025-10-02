import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Save, Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { BlogFormHeaderProps } from "@/types/BlogType";



export function BlogFormHeader({
  blogId,
  isLoading,
  hasUnsavedChanges,
  onBack,
  onPreview,
}: BlogFormHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back", "admin.form.back")}
        </Button>
        {hasUnsavedChanges && (
          <Badge variant="secondary" className="text-amber-600">
            <AlertCircle className="mr-1 h-3 w-3" />
            {t("Unsaved changes", "common.unsavedChanges")}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onPreview}>
          <Eye className="mr-2 h-4 w-4" />
          {t("Preview", "admin.form.preview")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isLoading
            ? t("Saving...", "admin.form.saving")
            : blogId
            ? t("Update Blog", "admin.form.updateBlog")
            : t("Save Blog", "admin.form.saveBlog")}
        </Button>
      </div>
    </div>
  );
}
