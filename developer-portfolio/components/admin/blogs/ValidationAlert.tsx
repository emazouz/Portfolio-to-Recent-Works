// components/ValidationAlert.tsx
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { ValidationErrors } from "@/types/BlogType";

interface ValidationAlertProps {
  validationErrors: ValidationErrors;
}

export function ValidationAlert({ validationErrors }: ValidationAlertProps) {
  const { t } = useTranslation();

  if (Object.keys(validationErrors).length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {t("Please fix the validation errors below", "validation.fixErrors")}
      </AlertDescription>
    </Alert>
  );
}
