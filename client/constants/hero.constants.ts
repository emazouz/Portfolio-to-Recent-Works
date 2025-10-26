import {
  ArrowRight,
  CheckCircle,
  Code2,
  Component,
  Database,
  Pyramid,
  RemoveFormatting,
  Server,
} from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";

// ==================== DATA LAYER (unchanged) ====================

export const HERO_DATA = {
  typing: {
    baseText: "Transform your ideas into production-grade web experiences.",
    speed: 35,
    cursorDelay: 900,
  },

  tagline: "Next.js & Node.js Specialist",

  title: {
    line1: "Creative Idea To",
    line2: "Excellent Products",
  },

  description:
    "We are 50+ professional software engineers with more than 15 years of expertise in crafting high-performance, tailor-made digital solutions.",

  ctas: [
    {
      id: "contact",
      text: "Get Consultant",
      href: "/contact",
      bg: "primary",
      variant: "default",
      icon: ArrowRight,
    },
    {
      id: "services",
      text: "Our Services",
      href: "/services",
      bg: "secondary",
      variant: "secondary",
      icon: ArrowRight,
    },
  ],

  backgroundImages: [
    {
      src: "assets/images/code.png",
      alt: "Background slide image",
    },
    {
      src: "/task-management-app.png",
      alt: "Background slide image",
    },
    {
      src: "/developer-portfolio-template.jpg",
      alt: "Background slide image",
    },
  ],

  techStack: [
    { name: "Next.js", icon: Code2 },
    { name: "Node.js", icon: Server },
    { name: "TypeScript", icon: RemoveFormatting },
    { name: "Tailwind CSS", icon: Component },
    { name: "Prisma", icon: Pyramid },
    { name: "PostgreSQL", icon: Database },
  ],

  valueBullets: [
    { text: "15+ years experience", icon: CheckCircle },
    { text: "120+ delivered projects", icon: CheckCircle },
    { text: "Performance & accessibility first", icon: CheckCircle },
  ],

  swiper: {
    autoplayDelay: 5000,
    effect: "fade",
  },
};

// Translation keys mapping (unchanged)
export const TRANSLATION_KEYS = {
  tagline: "hero-tagline",
  titleLine1: "hero-title-line1",
  titleLine2: "hero-title-line2",
  description: "hero-description",
  typing: "hero-typing",
  ctaContact: "hero-cta-contact",
  ctaServices: "hero-cta-services",
  bullet1: "hero-bullet-1",
  bullet2: "hero-bullet-2",
  bullet3: "hero-bullet-3",
  bgSlideAlt: "bg-slide-alt",
};

