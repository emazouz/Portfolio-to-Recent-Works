// stat cart /start

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  benefits: string[];
}

export interface FeatureCardProps {
  feature: Feature;
  index: number;
}

// stat cart /end

// Testimonial Type /start

interface CaseStudy {
  problem: string;
  solution: string;
  result: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  quote: string;
  project: string;
  date: string;
  featured: boolean;
  caseStudy: CaseStudy;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  featured?: boolean;
}
// STATS Type /start

export interface CounterProps {
  end: number;
  duration?: number;
  startCounting: boolean;
}

// STATS Type /end

// Star Type /start
export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showValue?: boolean;
  animated?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  variant?: "default" | "gradient" | "outlined";
  ratingsCount?: number;
}

// Star Type /end

// Search Type /start

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "template" | "project" | "blog" | "page";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}
// Search Type /end

// Header Type /start

export interface HeaderSectionProps {
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

// Header Type /end

export interface MarkdownRendererProps {
  text: string;
  allowHtml?: boolean;
  className?: string;
}

export interface MarkdownContentProps {
  content: string;
// Duplicate StarRatingProps removed; consolidated definition lives above.
  allowHtml?: boolean;
  showValue?: boolean;
  animated?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
  variant?: "default" | "gradient" | "outlined";
  ratingsCount?: number;
}



export interface SocialShareProps {
  title: string;
  url: string;
}
