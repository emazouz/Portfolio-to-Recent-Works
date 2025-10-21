import { ExternalLink } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";

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
  md: "w-5 h-5 sm:w-6 sm:h-6",
  lg: "w-6 h-6 sm:w-8 sm:h-8",
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
    <div className="mb-8 sm:mb-10">
      <Separator className="my-12 sm:my-16 md:my-20" />
      <div
        className={`flex flex-col gap-y-6 sm:gap-y-8 md:flex-row md:items-center md:justify-between ${className}`}
      >
        {/* Content */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* Badge */}
          <button className="inline-flex items-center gap-2 sm:gap-3 bg-primary/10 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm border border-primary/20 hover:bg-primary/15 transition-colors">
            <span
              className={`${ICON_SIZES[iconSize]} text-primary flex-shrink-0`}
            >
              {icon}
            </span>
            <span className="uppercase text-primary font-bold text-xs sm:text-sm tracking-wide whitespace-nowrap">
              {badgeTitle}
            </span>
          </button>

          {/* Heading - Responsive text sizing */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-secondary animate-gradient break-words">
            {title}
          </h2>

          {/* Description - Responsive text sizing */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Button - Stacks on mobile, side by side on desktop */}
        {!hideCta && ctaHref && (
          <div className="w-full md:w-auto md:flex-shrink-0 md:mt-0">
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto px-6 sm:px-8 group hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm hover:shadow-lg"
              asChild
            >
              <Link href={ctaHref} className="flex items-center justify-center">
                <span className="truncate">{ctaText}</span>
                <ExternalLink className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 group-hover:scale-110 transition-all flex-shrink-0" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderSection;
