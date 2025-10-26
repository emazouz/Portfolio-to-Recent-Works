import Link from "next/link";
import SocialShare from "./social-share";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectActionsProps } from "@/types/project.types";

function ProjectActions({ project, localizedContent }: ProjectActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {project.liveUrl && (
        <Button
          size="lg"
          // FIX: Primary button uses theme primary colors
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          asChild
        >
          <Link
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live
          </Link>
        </Button>
      )}

      {project.githubUrl && (
        <Button
          size="lg"
          variant="outline"
          // FIX: Outline button uses theme border/muted hover
          className="border-border hover:bg-muted text-foreground"
          asChild
        >
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            View Code
          </Link>
        </Button>
      )}

      <SocialShare
        title={localizedContent.title}
        url={`/portfolio/view/${project.id}`}
      />
    </div>
  );
}

export default ProjectActions;
