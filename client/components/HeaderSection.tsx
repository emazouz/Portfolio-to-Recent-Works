import { ExternalLink, LucideIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

interface HeaderSectionProps {
  /** Icon component to display in the badge */
  icon: React.ReactNode;
  /** Text for the badge button */
  badgeTitle: string;
  /** Main heading text */
  title: string;
  /** Description text below the heading */
  description: string;
  /** Call-to-action button text */
  ctaText?: string;
  /** Call-to-action button link */
  ctaHref?: string;
  /** Optional class name for the wrapper */
  className?: string;
  /** Optional: Hide the CTA button */
  hideCta?: boolean;
  /** Optional: Custom icon size */
  iconSize?: "sm" | "md" | "lg";
}

const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

function HeaderSection({
  icon,
  badgeTitle,
  title,
  description,
  ctaText,
  ctaHref,
  className,
  hideCta = false,
  iconSize = "md",
}: HeaderSectionProps) {
  return (
    <div className={`wrapper flex-between ${className}`}>
      {/* Content */}
      <div className="flex-1">
        {/* Badge: FIX - Removed hardcoded gradients and pink color */}
        <button className="flex-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 backdrop-blur-sm border border-primary/20 hover:bg-primary/15 transition-colors">
          {/* FIX: Icon text color now uses text-primary */}
          <span className={`${ICON_SIZES[iconSize]} text-primary`}>{icon}</span>
          {/* FIX: Badge Text uses text-primary for clip effect */}
          <span className="uppercase text-primary font-bold text-sm tracking-wide">
            {badgeTitle}
          </span>
        </button>

        {/* Heading: FIX - Uses text-foreground and theme gradient (primary to secondary) */}
        <h2 className="h1-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-secondary animate-gradient">
          {title}
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* CTA Button */}
      {!hideCta && ctaHref && (
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            // FIX: Button uses primary theme hover styles
            className="px-8 group hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-lg"
            asChild
          >
            <Link href={ctaHref}>
              {ctaText}
              <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:scale-110 transition-all" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default HeaderSection;
