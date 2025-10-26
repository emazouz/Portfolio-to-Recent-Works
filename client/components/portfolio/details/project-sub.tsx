import { useState } from "react";
import StarRating from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDate } from "@/handlers/date.handlers";
import {
  Calendar,
  Clock,
  Code2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ZoomIn,
} from "lucide-react";
import {
  ProjectProgressProps,
  ProjectTechnologiesProps,
  ProjectMetaProps,
  ProjectImageProps,
} from "@/types/project.types";

// ==================== TECHNOLOGIES COMPONENT ====================
export const ProjectTechnologies = ({
  technologies = [],
  variant = "compact",
  showCategories = false,
}: ProjectTechnologiesProps) => {
  if (!technologies || technologies.length === 0) return null;

  // Category colors
  const categoryStyles = {
    frontend: "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400",
    backend:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    database:
      "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
    tool: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    other: "bg-muted/50 border-border text-muted-foreground",
  };

  // Parse technologies
  const parsedTechs = technologies.map((tech, idx) =>
    typeof tech === "string" ? { name: tech, category: "other" as const } : tech
  );

  return (
    <div className="space-y-4 p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-black text-foreground">
          Technologies Used
        </h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {parsedTechs.length}
        </Badge>
      </div>

      {/* Technologies Grid */}
      {variant === "compact" ? (
        <div className="flex flex-wrap gap-2">
          {parsedTechs.map((tech, index) => (
            <Badge
              key={`${tech.name}-${index}`}
              className={cn(
                "transition-all duration-300 hover:scale-105 cursor-default",
                showCategories && tech.category
                  ? categoryStyles[tech.category]
                  : "bg-muted/50 border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {parsedTechs.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 hover:scale-105 cursor-default",
                showCategories && tech.category
                  ? categoryStyles[tech.category]
                  : "bg-muted/30 border-border hover:border-primary/50"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{tech.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== PROGRESS COMPONENT ====================
export const ProjectProgress = ({
  progressPercentage,
  showMilestones = false,
  animated = true,
}: ProjectProgressProps) => {
  const milestones = [
    { label: "Planning", value: 25 },
    { label: "Development", value: 50 },
    { label: "Testing", value: 75 },
    { label: "Deployment", value: 100 },
  ];

  const currentMilestone = milestones.find(
    (m, idx) =>
      progressPercentage >= (idx > 0 ? milestones[idx - 1].value : 0) &&
      progressPercentage <= m.value
  );

  return (
    <div className="space-y-4 p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-black text-foreground">
            Project Progress
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {progressPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={progressPercentage}
          className={cn(
            "w-full h-3 bg-muted/50",
            animated && "transition-all duration-1000"
          )}
        />

        {/* Current Milestone */}
        {currentMilestone && (
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-muted-foreground">
              Current Phase:{" "}
              <span className="text-foreground font-semibold">
                {currentMilestone.label}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Milestones */}
      {showMilestones && (
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border/50">
          {milestones.map((milestone, idx) => (
            <div
              key={milestone.label}
              className={cn(
                "text-center space-y-1 p-2 rounded-lg transition-all duration-300",
                progressPercentage >= milestone.value
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/30 border border-border/50"
              )}
            >
              <div
                className={cn(
                  "text-xs font-bold",
                  progressPercentage >= milestone.value
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {milestone.value}%
              </div>
              <div
                className={cn(
                  "text-[10px]",
                  progressPercentage >= milestone.value
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {milestone.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== META COMPONENT ====================
export const ProjectMeta = ({
  project,
  showStats = true,
}: ProjectMetaProps) => {
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - new Date(project.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4 p-6 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border hover:border-primary/30 transition-all duration-300">
      {/* Date Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
        <div className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Created</span>
            <span className="font-semibold text-foreground">
              {formatDate(String(project.createdAt))}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 group/item hover:text-foreground transition-colors">
          <div className="p-1.5 rounded-lg bg-accent/10 group-hover/item:bg-accent/20 transition-colors">
            <Clock className="w-4 h-4 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Updated</span>
            <span className="font-semibold text-foreground">
              {formatDate(String(project.updatedAt))}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Rating */}
      <div className="flex items-center justify-between">
        <StarRating
          rating={project.rating}
          showValue={true}
          size="lg"
          ratingsCount={project.rating}
        />

        {showStats && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {daysSinceCreation} days old
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {showStats && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-xl font-black text-foreground">
              {project.ratingsCount}
            </div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-xl font-black text-foreground">
              {project.rating.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== IMAGE COMPONENT ====================
export const ProjectImage = ({
  imageUrl,
  title,
  badge,
  onImageClick,
}: ProjectImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative group">
      {/* Image Container */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl shadow-2xl border-2 border-border",
          "transition-all duration-500",
          "hover:border-primary/50 hover:shadow-primary/20",
          onImageClick && "cursor-pointer"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onImageClick}
      >
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Image */}
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className={cn(
            "w-full h-auto object-cover transition-all duration-700",
            isHovered && "scale-110 rotate-1",
            !imageLoaded && "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
            "transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Zoom Icon */}
        {onImageClick && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "transition-all duration-300",
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
            )}
          >
            <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          </div>
        )}

        {/* Title Overlay */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-6",
            "transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <h3 className="text-2xl font-black text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Corner Glow */}
      <div
        className={cn(
          "absolute -bottom-4 -right-4 w-32 h-32 bg-primary/30 rounded-full blur-3xl",
          "transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default {
  ProjectTechnologies,
  ProjectProgress,
  ProjectMeta,
  ProjectImage,
};
