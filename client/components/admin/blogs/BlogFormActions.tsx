// components/BlogFormActions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface BlogFormActionsProps {
  blogId?: number;
  isLoading: boolean;
}

export function BlogFormActions({ blogId, isLoading }: BlogFormActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-50">
      <Button
        type="submit"
        disabled={isLoading}
        className="shadow-lg"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {isLoading
          ? t("Saving...", "admin.form.saving")
          : blogId
          ? t("Update", "admin.form.update")
          : t("Save", "admin.form.save")}
      </Button>
    </div>
  );
}
