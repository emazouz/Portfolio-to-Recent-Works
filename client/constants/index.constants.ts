import { SearchResult } from "@/types/index.types";
import {
  Award,
  Calendar,
  FileText,
  MessageSquare,
  Package,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";

export const APP_NAME = process.env.NEXT_APP_NAME || "Emazouz";
export const APP_DESCRIPTION =
  process.env.NEXT_APP_DESCRIPTION ||
  "Professional developer portfolio showcasing premium templates, web development services, and technical expertise";
export const SERVER_URL =
  process.env.NEXT_SERVER_URL || "http://localhost:5000";

// STATS Type /start

export const STATS = [
  {
    label: "Projects Completed",
    value: 150,
    suffix: "+",
    icon: Award,
    // Gold Gradient 1: Bright Gold Focus
    color: "from-primary to-secondary",
    bgGlow: "bg-primary/20",
  },
  {
    label: "Happy Clients",
    value: 500,
    suffix: "+",
    icon: Users,
    // Gold Gradient 2: Subtle Gold/Orange
    color: "from-secondary/80 to-secondary",
    bgGlow: "bg-secondary/20",
  },
  {
    label: "Years Experience",
    value: 5,
    suffix: "+",
    icon: Calendar,
    // Gold Gradient 3: Primary Gold Accent
    color: "from-secondary to-primary",
    bgGlow: "bg-primary/20",
  },
  {
    label: "Templates Sold",
    value: 2500,
    suffix: "+",
    icon: ShoppingBag,
    // Gold Gradient 4: Muted Gold
    color: "from-secondary/70 to-secondary/90",
    bgGlow: "bg-secondary/20",
  },
];

// STATS Type /end

// Search Type /end

export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Modern E-commerce Dashboard",
    description:
      "Complete dashboard template with analytics and inventory management",
    type: "template",
    href: "/templates/ecommerce-dashboard",
    icon: Package,
  },
  {
    id: "2",
    title: "SaaS Landing Page",
    description: "Conversion-optimized landing page for SaaS products",
    type: "template",
    href: "/templates/saas-landing",
    icon: Package,
  },
  {
    id: "3",
    title: "Task Management App",
    description: "Full-stack project management application",
    type: "project",
    href: "/portfolio/task-management",
    icon: User,
  },
  {
    id: "4",
    title: "Building Modern Dashboards with Next.js",
    description: "Complete guide to creating responsive dashboards",
    type: "blog",
    href: "/blog/modern-dashboards-nextjs",
    icon: FileText,
  },
  {
    id: "5",
    title: "About Me",
    description: "Learn more about my background and expertise",
    type: "page",
    href: "/about",
    icon: User,
  },
  {
    id: "6",
    title: "Contact",
    description: "Get in touch for your next project",
    type: "page",
    href: "/contact",
    icon: MessageSquare,
  },
];

// Search Type /end

// Icon size /start

export const ICON_SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5 sm:w-6 sm:h-6",
  lg: "w-6 h-6 sm:w-8 sm:h-8",
};

// Icon size /end

export const GRADIENT_MAP = {
  // Chart-1: Indigo/Purple (Your primary color focus)
  "indigo-purple": "chart-1",
  // Chart-2: Pink/Rose (For UI/UX, Process Timeline)
  "pink-rose": "chart-2",
  "fuchsia-pink": "chart-2",
  // Chart-3: Blue/Cyan (For Cloud/Infrastructure)
  "blue-cyan": "chart-3",
  "blue-lightcyan": "chart-3",
  // Chart-4: Yellow/Amber (For Performance/Business)
  "yellow-amber": "chart-4",
  "orange-amber": "chart-4",
  // Chart-5: Green/Emerald (For E-Commerce/Standard)
  "green-emerald": "chart-5",
  "teal-cyan": "chart-5",
  // Chart-6: Purple/Violet (For Security/DevOps)
  "purple-violet": "chart-6",
  // Chart-7: Orange/Red (For SEO/Professional)
  "orange-red": "chart-7",
  "red-rose": "chart-7",
  // Use Chart-8 for a secondary unique accent if needed
  "generic-accent": "chart-8",
};
