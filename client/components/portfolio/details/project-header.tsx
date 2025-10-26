import { MarkdownContent } from "@/components/markdown/markdown-content";
import { Badge } from "@/components/ui/badge";
import { STATUS_MAP } from "@/constants/project.constants";
import { ProjectHeaderProps } from "@/types/project.types";
import { getChartGradientVar } from "@/handlers/index.handlers";
import { getCategoryText, getStatusText } from "@/handlers/project.handlers";
import { Sparkles } from "lucide-react";

const CHART_GRADIENT_SECONDARY = getChartGradientVar("chart-4"); // Amber/Orange for featured

function ProjectHeader({
  project,
  localizedContent,
  currentLanguage,
  statusVariant,
}: ProjectHeaderProps) {
  const statusGradientKey =
    STATUS_MAP[project.status as keyof typeof STATUS_MAP]?.gradient;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {/* Category Badge: FIX - Use theme-aware muted/border */}
        <Badge
          variant="outline"
          className="bg-muted/50 border-border text-muted-foreground"
        >
          {getCategoryText(project.category, currentLanguage)}
        </Badge>
        {/* Status Badge: FIX - Use inline style for gradient color */}
        <Badge
          variant={statusVariant}
          className="text-primary-foreground border-0"
          style={{ backgroundImage: getChartGradientVar(statusGradientKey) }}
        >
          {getStatusText(project.status, currentLanguage)}
        </Badge>
        {project.featured && (
          // Featured Badge: FIX - Use inline style for gradient color
          <Badge
            className="text-primary-foreground border-0 animate-pulse"
            style={{ backgroundImage: CHART_GRADIENT_SECONDARY }}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
      </div>

      {/* Title: FIX - Use foreground color */}
      <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
        {localizedContent.title}
      </h1>

      {/* Description: FIX - Use muted-foreground */}
      <div className="text-xl text-muted-foreground prose prose-lg dark:prose-invert max-w-none">
        <MarkdownContent content={localizedContent.description} />
      </div>
    </div>
  );
}

export default ProjectHeader;
