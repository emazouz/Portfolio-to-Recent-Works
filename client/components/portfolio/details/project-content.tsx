import { ProjectContentProps } from "@/types/project.types";
import { ProjectReviews } from "../project-reviews";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { MarkdownContent } from "@/components/markdown/markdown-content";

function ProjectContent({
  localizedContent,
  project,
  currentLanguage,
}: ProjectContentProps) {
  return (
    <section className="container">
      {/* FIX: Use theme-aware styles for content container */}
      <div className="prose prose-lg prose-invert max-w-none space-y-8">
        {/* Project Overview */}
        <div className="p-8 rounded-2xl bg-card border border-border">
          <h2 className="text-3xl font-black text-foreground mb-4">
            Project Overview
          </h2>
          <div className="text-lg leading-relaxed text-muted-foreground">
            <MarkdownContent content={localizedContent.description} />
          </div>
        </div>

        {localizedContent.metaDesc && (
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h2 className="text-3xl font-black text-foreground mb-4">
              Detailed Information
            </h2>
            <div className="text-muted-foreground">
              <MarkdownContent content={localizedContent.metaDesc} />
            </div>
          </div>
        )}

        {/* Project Links */}
        {(project.liveUrl || project.githubUrl) && (
          <div className="p-8 rounded-2xl bg-card border border-border">
            <h2 className="text-3xl font-black text-foreground mb-4">
              Project Links
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <Button
                  variant="outline"
                  className="border-border hover:bg-muted text-foreground"
                  asChild
                >
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Link>
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="outline"
                  className="border-border hover:bg-muted text-foreground"
                  asChild
                >
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Project Reviews */}
        <div className="p-8 rounded-2xl bg-card border border-border">
          <h2 className="text-3xl font-black text-foreground mb-6">
            Project Reviews
          </h2>
          <ProjectReviews id={project.id} />
        </div>
      </div>
    </section>
  );
}

export default ProjectContent;
