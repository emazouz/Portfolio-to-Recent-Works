import { useTranslation } from "@/hooks/use-translation";
import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="text-center space-y-6 p-8 rounded-xl bg-card/50 backdrop-blur-sm border shadow-lg">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <div className="absolute inset-0 h-12 w-12 mx-auto rounded-full border-2 border-primary/20 animate-pulse" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {t("Loading...", "common.loading")}
          </p>
          <p className="text-sm text-muted-foreground">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    </div>
  );
}
