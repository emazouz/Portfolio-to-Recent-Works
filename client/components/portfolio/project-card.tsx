import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Eye, Github, Sparkles, Star } from "lucide-react";
import { CategoryType, ProjectCardProps } from "@/types/project.types";
import { categoryConfig } from "@/constants/project.constants";
import { getStatusText } from "@/handlers/project.handlers";

function ProjectCard({ project, index, language = "en" }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get localized content based on language prop
  const title = language === "en" ? project.title_en : project.title_ar;
  const description =
    language === "en" ? project.description_en : project.description_ar;

  // Format category for display
  const formatCategory = (category: string): string => {
    return category.replace(/_/g, " ");
  };

  // Get category configuration with fallback
  const config =
    categoryConfig[project.category as CategoryType] ||
    categoryConfig.WEB_DEVELOPMENT;

  // Limit technologies displayed
  const maxTechnologies = 3;
  const displayedTechnologies = project.technologies.slice(0, maxTechnologies);
  const remainingTechnologies = project.technologies.length - maxTechnologies;

  return (
    <Card
      className="group card overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        style={{
          background: `var(--${config.gradient})`,
          filter: "blur(16px)",
        }}
        aria-hidden="true"
      />

      {/* Top Glow Effect */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700`}
        aria-hidden="true"
      />

      {/* Image Container */}
      <div className="relative overflow-hidden h-60">
        <img
          src={project.imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Floating Action Buttons on Hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isHovered ? "scale-100" : "scale-95"
          }`}
        >
          <div className="flex gap-3">
            <Button
              size="lg"
              className={`bg-gradient-to-r ${config.gradient} hover:shadow-xl hover:scale-110 transition-all duration-300 border-0`}
              asChild
            >
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="w-5 h-5 mr-2" />
                Live Demo
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300"
              asChild
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <Badge
            className={`${config.badge} text-white border-0 shadow-lg backdrop-blur-sm px-3 py-1`}
          >
            {formatCategory(project.category)}
          </Badge>
        </div>

        {/* Rating and Featured Badge */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-1">
              <Star
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
              <span className="font-semibold">{project.rating || 5}</span>
              <span className="text-white/60">
                ({project.ratingsCount || 1})
              </span>
            </div>
            <div className=" flex gap-2 flex-wrap">
              <Badge
                className="text-white border-0 shadow-lg"
                style={{ background: `var(--${config.gradient})` }}
              >
                {getStatusText(project.status, language)}
              </Badge>
              {project.featured && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="px-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
          {description}
        </p>

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {displayedTechnologies.map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {remainingTechnologies > 0 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{remainingTechnologies}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="flex-1 hover:bg-primary"
            asChild
          >
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
