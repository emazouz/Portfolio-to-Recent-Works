import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Alert, AlertDescription } from "./alert";
import { useTranslation } from "@/hooks/use-translation";

interface NotFoundProps {
  error?: string | null;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  redirectPath?: string;
}

export default function NotFound({ 
  error,
  title,
  description,
  showBackButton = true,
  showHomeButton = true,
  redirectPath = "/admin/projects"
}: NotFoundProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(redirectPath);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Navigation buttons */}
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("Back", "common.back")}
          </Button>
        )}
      </div>

      {/* Error/Not Found Alert */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 
           title || 
           t("The requested resource was not found", "common.notFound")}
        </AlertDescription>
      </Alert>

      {/* Additional description if provided */}
      {description && (
        <div className="text-center text-muted-foreground">
          <p>{description}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="text-center space-y-3">
        {showHomeButton && (
          <div>
            <Button onClick={() => router.push(redirectPath)}>
              <Home className="mr-2 h-4 w-4" />
              {t("Go to Projects", "admin.projects.goToProjects")}
            </Button>
          </div>
        )}
        
        {/* Alternative actions */}
        <div className="flex justify-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.push("/admin")}
          >
            {t("Dashboard", "common.dashboard")}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            {t("Refresh", "common.refresh")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Alternative: More specific NotFound components for different contexts
export function ProjectNotFound({ projectId }: { projectId?: number }) {
  return (
    <NotFound
      title="Project Not Found"
      description={projectId ? `Project with ID "${projectId}" could not be found.` : undefined}
      redirectPath="/admin/projects"
    />
  );
}

export function PageNotFound() {
  return (
    <NotFound
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      redirectPath="/admin"
    />
  );
}