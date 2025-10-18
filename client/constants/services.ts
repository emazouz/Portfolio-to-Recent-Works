import {
  Code,
  Palette,
  Cloud,
  Zap,
  ShoppingCart,
  Shield,
  Code2,
  TrendingUp,
  Award,
  Clock,
  Home,
  Package,
  ContactIcon,
} from "lucide-react";

// =========================================================================
// THEME MAPPING: Maps aesthetic groups to theme-aware chart variables
// Your chart variables are defined in your main CSS file and handle light/dark mode.
// We are mapping the general color feeling (e.g., Purple/Pink) to a specific chart index.
// =========================================================================

const GRADIENT_MAP = {
  // Chart-1: Indigo/Purple (Your primary color focus)
  'indigo-purple': 'chart-1', 
  // Chart-2: Pink/Rose (For UI/UX, Process Timeline)
  'pink-rose': 'chart-2',  
  'fuchsia-pink': 'chart-2', 
  // Chart-3: Blue/Cyan (For Cloud/Infrastructure)
  'blue-cyan': 'chart-3', 
  'blue-lightcyan': 'chart-3',
  // Chart-4: Yellow/Amber (For Performance/Business)
  'yellow-amber': 'chart-4', 
  'orange-amber': 'chart-4',
  // Chart-5: Green/Emerald (For E-Commerce/Standard)
  'green-emerald': 'chart-5', 
  'teal-cyan': 'chart-5',
  // Chart-6: Purple/Violet (For Security/DevOps)
  'purple-violet': 'chart-6', 
  // Chart-7: Orange/Red (For SEO/Professional)
  'orange-red': 'chart-7', 
  'red-rose': 'chart-7',
  // Use Chart-8 for a secondary unique accent if needed
  'generic-accent': 'chart-8', 
};


// =========================================================================
// INTERFACES (UNCHANGED)
// =========================================================================

interface MetricsType {
  label: string;
  value: string;
}

export interface Service {
  id: string;
  icon: any;
  label: string;
  // CHANGED: This now holds a 'chart-n' key, not a Tailwind class string.
  gradient: string; 
  // CHANGED: This is now a generic theme class, not a hardcoded color.
  subtitle: string;
  description: string;
  technologies: string[];
  benefits: string[];
  metrics: MetricsType[];
}

export interface Package {
  name: string;
  price: string;
  tagline: string;
  // CHANGED: This now holds a 'chart-n' key, not a Tailwind class string.
  color: string;
  popular: boolean;
  features: { text: string; included: boolean }[];
}


// =========================================================================
// REFRACTORED DATA ARRAYS
// =========================================================================

export const services = [
  {
    icon: Code,
    title: "Full-Stack Web Development",
    features: [
      "Next.js 14 with App Router",
      "TypeScript & Type Safety",
      "RESTful API Development",
      "Server-Side Rendering (SSR)",
    ],
    // Mapped to chart-1
    gradient: GRADIENT_MAP['indigo-purple'],
  },
  {
    icon: Palette,
    title: "UI/UX Design & Development",
    features: [
      "Figma to Code",
      "Responsive & Mobile-First",
      "Design Systems",
      "Accessibility (WCAG)",
    ],
    // Mapped to chart-2
    gradient: GRADIENT_MAP['pink-rose'],
  },
  {
    icon: Cloud,
    title: "IT Solutions & Cloud Infrastructure",
    features: [
      "AWS Cloud Architecture",
      "Docker & Containerization",
      "CI/CD with GitHub Actions",
      "Infrastructure as Code",
    ],
    // Mapped to chart-3
    gradient: GRADIENT_MAP['blue-cyan'],
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    features: [
      "Core Web Vitals Optimization",
      "Database Query Tuning",
      "Bundle Size Reduction",
      "Caching Strategies (Redis)",
    ],
    // Mapped to chart-4
    gradient: GRADIENT_MAP['yellow-amber'],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    features: [
      "Stripe & PayPal Integration",
      "Real-time Inventory",
      "Order Management System",
      "Analytics Dashboard",
    ],
    // Mapped to chart-5
    gradient: GRADIENT_MAP['green-emerald'],
  },
  {
    icon: Shield,
    title: "Security & DevOps",
    features: [
      "Security Audits & Penetration Testing",
      "Automated Backups",
      "24/7 Monitoring & Alerts",
      "SSL/TLS & HTTPS Enforcement",
    ],
    // Mapped to chart-6
    gradient: GRADIENT_MAP['purple-violet'],
  },
];

export const SERVICES: Service[] = [
  {
    id: "fullstack",
    icon: Code2,
    label: "Full-Stack Development",
    gradient: GRADIENT_MAP['indigo-purple'],
    // Use text-primary for theme consistency
    subtitle: "text-primary", 
    description:
      "Stop juggling multiple developers and dealing with integration headaches. I build complete, production-ready web applications from database to pixel-perfect UI—all under one roof. Using modern technologies like Next.js, TypeScript, and PostgreSQL, I deliver enterprise-grade applications 50% faster than traditional agencies. Your project gets unified architecture, consistent code quality, and a single point of accountability. Whether you're launching an MVP or scaling an existing platform, you get a developer who owns every line of code and every architectural decision.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "AWS",
      "Docker",
    ],
    benefits: [
      "50% faster project delivery",
      "30% reduction in bugs",
      "40% lower maintenance costs",
      "Unified architecture decisions",
    ],
    metrics: [
      { label: "Faster Delivery", value: "50%" },
      { label: "Bug Reduction", value: "30%" },
      { label: "Cost Savings", value: "40%" },
    ],
  },
  {
    id: "uiux",
    icon: Palette,
    label: "UI/UX Design",
    gradient: GRADIENT_MAP['pink-rose'],
    subtitle: "text-secondary", // Use text-secondary for differentiation
    description:
      "Your website has 3 seconds to convince visitors to stay. I design interfaces that captivate attention and guide users effortlessly toward conversion. Using proven UX principles and modern design systems, I create experiences that increase conversions by 35% on average. From Figma prototypes to production-ready components with Tailwind CSS and Framer Motion, you get designs that are both beautiful and battle-tested for performance. Mobile-first, accessibility-compliant, and optimized for the behaviors of your target audience—not just aesthetic trends.",
    technologies: [
      "Figma",
      "Tailwind CSS",
      "shadcn UI",
      "Framer Motion",
      "Adobe XD",
    ],
    benefits: [
      "35% increase in conversions",
      "60% reduction in bounce rates",
      "2x longer session duration",
      "45% mobile conversion boost",
    ],
    metrics: [
      { label: "Conversion Increase", value: "35%" },
      { label: "Bounce Rate Drop", value: "60%" },
      { label: "Mobile Conversions", value: "+45%" },
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    label: "Cloud Infrastructure",
    gradient: GRADIENT_MAP['blue-cyan'],
    subtitle: "text-primary", 
    description:
      "Stop overpaying for servers you don't need and stressing about traffic spikes. I architect cloud infrastructure on AWS, Azure, and Google Cloud that scales automatically with your business growth. Using Docker, Kubernetes, and Terraform, I create infrastructure that can handle Black Friday traffic spikes without breaking a sweat—then scale back down to save costs. Your infrastructure becomes reproducible code that can be deployed in minutes, backed up automatically, and recovered from disasters in seconds. Pay only for what you use, with 99.99% uptime and the peace of mind that your platform can handle whatever success throws at it.",
    technologies: [
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Jenkins",
    ],
    benefits: [
      "40-60% cost savings",
      "99.99% uptime guarantee",
      "10x faster deployment",
      "Zero-downtime scaling",
    ],
    metrics: [
      { label: "Cost Savings", value: "40-60%" },
      { label: "Uptime", value: "99.99%" },
      { label: "Deployment Speed", value: "10x" },
    ],
  },
  {
    id: "performance",
    icon: Zap,
    label: "Performance Optimization",
    gradient: GRADIENT_MAP['yellow-amber'],
    subtitle: "text-secondary", 
    description:
      "Your website loads in 5 seconds? You're losing 7% of conversions for every second over 2. I guarantee sub-2-second load times by optimizing your entire stack—not just compressing images. Using advanced techniques like edge caching with CloudFlare, Redis for data persistence, code splitting, and aggressive asset optimization, I eliminate every unnecessary millisecond. You get detailed Lighthouse reports showing 90+ scores across the board, improved Google rankings from Core Web Vitals, and most importantly—more customers completing purchases instead of abandoning slow-loading pages. If I don't deliver measurable speed improvements, you don't pay.",
    technologies: [
      "Next.js",
      "Vercel",
      "CloudFlare",
      "Redis",
      "Webpack",
      "Lighthouse",
    ],
    benefits: [
      "Sub-2-second load times guaranteed",
      "7% conversion increase per second saved",
      "Google ranking boost",
      "50-80% bandwidth reduction",
    ],
    metrics: [
      { label: "Load Time", value: "<2s" },
      { label: "Conversion Boost", value: "7%/sec" },
      { label: "Lighthouse Score", value: "90+" },
    ],
  },
  {
    id: "e-commerce",
    icon: ShoppingCart,
    label: "E-Commerce Solutions",
    gradient: GRADIENT_MAP['green-emerald'],
    subtitle: "text-primary", 
    description:
      "Stop paying monthly fees and transaction percentages to e-commerce platforms that limit your growth. I build custom online stores that are tailored to your exact business model—not forced into generic templates. Using Next.js, Stripe, and PostgreSQL, you get blazing-fast checkout experiences that convert 35% better than template-based stores. No transaction fees eating your profits. No monthly platform costs scaling with your success. Complete control over customer data, advanced inventory management, automated marketing emails via SendGrid, and detailed analytics to optimize every step of your sales funnel. Launch in 4-6 weeks with a platform that grows with you—not against you.",
    technologies: [
      "Next.js",
      "Stripe",
      "PostgreSQL",
      "Redis",
      "SendGrid",
      "Analytics",
    ],
    benefits: [
      "Zero transaction fees",
      "$2,400-3,600 saved annually",
      "35% higher conversions",
      "Complete data ownership",
    ],
    metrics: [
      { label: "Transaction Fees", value: "0%" },
      { label: "Annual Savings", value: "$2.4K-3.6K" },
      { label: "Conversion Boost", value: "35%" },
    ],
  },
  {
    id: "security",
    icon: Shield,
    label: "Security & DevOps",
    gradient: GRADIENT_MAP['purple-violet'],
    subtitle: "text-secondary", 
    description:
      "One security breach costs $4.35M on average—and destroys customer trust permanently. I implement enterprise-grade security from day one, not as an afterthought. Using industry-standard practices like automated vulnerability scanning, encryption at rest and in transit, DDoS protection, and zero-trust architecture, your infrastructure becomes a fortress. Combined with DevOps automation via Docker, Kubernetes, and GitHub Actions, you get deployments that happen 50x faster with 90% fewer errors. Updates roll out with zero downtime. Incidents get detected and rolled back automatically. Your team focuses on features while my infrastructure handles security, monitoring, backups, and scaling—24/7, automatically.",
    technologies: [
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "AWS Security",
      "Nginx",
      "Terraform",
    ],
    benefits: [
      "Prevent $4.35M breach costs",
      "90% reduction in deployment errors",
      "10x faster incident recovery",
      "Zero-downtime deployments",
    ],
    metrics: [
      { label: "Deployment Errors", value: "-90%" },
      { label: "Recovery Speed", value: "10x" },
      { label: "Downtime", value: "0%" },
    ],
  },
  {
    id: "seo",
    icon: TrendingUp,
    label: "SEO Services",
    gradient: GRADIENT_MAP['orange-red'],
    subtitle: "text-primary", 
    description:
      "75% of users never see page 2 of Google. If you're not ranking, you're invisible. I implement technical SEO at the code level—not just meta descriptions and keywords. Using Next.js for perfect server-side rendering, implementing structured data for rich snippets, optimizing Core Web Vitals for Google's ranking algorithm, and building content strategies based on actual search data from Ahrefs and Semrush. You get technical audits that identify exactly what's holding you back, followed by implementation that brings 3x more organic traffic within 6 months. Every visitor is free—no more paying $50 per click for ads. Rank #1, stay #1, and watch organic traffic become your biggest revenue channel.",
    technologies: [
      "Next.js SEO",
      "Google Analytics",
      "Search Console",
      "Ahrefs",
      "Semrush",
    ],
    benefits: [
      "3x more organic traffic in 6 months",
      "53% of traffic from organic search",
      "14.6% close rate vs 1.7% outbound",
      "10x ROI vs paid advertising",
    ],
    metrics: [
      { label: "Traffic Increase", value: "3x" },
      { label: "Organic Close Rate", value: "14.6%" },
      { label: "ROI", value: "10x" },
    ],
  },
];

export const PACKAGES: Package[] = [
  {
    name: "Standard",
    price: "1499",
    tagline: "Perfect for startups and small businesses",
    // Mapped to chart-5
    color: GRADIENT_MAP['green-emerald'],
    popular: false,
    features: [
      { text: "Up to 5 Pages", included: true },
      { text: "Hosting + Domain Name", included: true },
      { text: "Responsive design", included: true },
      { text: "Content upload", included: true },
      { text: "10 plugins/extensions", included: true },
      { text: "Social media icons", included: true },
      { text: "E-commerce functionality", included: false },
      { text: "Speed optimization", included: true },
      { text: "SEO service", included: false },
      { text: "Autoresponder integration", included: false },
    ],
  },
  {
    name: "Professional",
    price: "2499",
    tagline: "The professional that you are deserves the best",
    // Mapped to chart-7
    color: GRADIENT_MAP['red-rose'],
    popular: true,
    features: [
      { text: "Up to 8 Pages", included: true },
      { text: "Hosting + Domain Name", included: true },
      { text: "Responsive design", included: true },
      { text: "Content upload", included: true },
      { text: "12 plugins/extensions", included: true },
      { text: "Social media icons", included: true },
      { text: "E-commerce functionality", included: true },
      { text: "Speed optimization", included: true },
      { text: "SEO service", included: true },
      { text: "Autoresponder integration", included: false },
    ],
  },
  {
    name: "Business",
    price: "3499",
    tagline: "Scale your business with enterprise features",
    // Mapped to chart-4
    color: GRADIENT_MAP['orange-amber'],
    popular: false,
    features: [
      { text: "Up to 15 Pages", included: true },
      { text: "Hosting + Domain Name", included: true },
      { text: "Responsive design", included: true },
      { text: "Content upload", included: true },
      { text: "15 plugins/extensions", included: true },
      { text: "Social media icons", included: true },
      { text: "E-commerce functionality", included: true },
      { text: "Speed optimization", included: true },
      { text: "SEO service", included: true },
      { text: "Autoresponder integration", included: true },
    ],
  },
  {
    name: "Premium",
    price: "4599",
    tagline: "Keep your internet users close to you!",
    // Mapped to chart-3
    color: GRADIENT_MAP['blue-cyan'],
    popular: false,
    features: [
      { text: "Unlimited pages", included: true },
      { text: "Hosting + Domain Name", included: true },
      { text: "Responsive design", included: true },
      { text: "Content upload", included: true },
      { text: "25 plugins/extensions", included: true },
      { text: "Social media icons", included: true },
      { text: "E-commerce functionality", included: true },
      { text: "50 products included", included: true },
      { text: "Speed optimization", included: true },
      { text: "SEO service", included: true },
      { text: "Autoresponder integration", included: true },
    ],
  },
];

export const SECTIONS_ALTERNATIVE = [
  {
    id: "services",
    icon: Home,
    label: "Introduction",
    gradient: GRADIENT_MAP['blue-lightcyan'],
    subtitle: "text-primary",
  },
  {
    id: "fullstack",
    icon: Code2,
    label: "Full-Stack Development",
    gradient: GRADIENT_MAP['indigo-purple'],
    subtitle: "text-primary",
  },
  {
    id: "uiux",
    icon: Palette,
    label: "UI/UX Design",
    gradient: GRADIENT_MAP['pink-rose'],
    subtitle: "text-secondary",
  },
  {
    id: "cloud",
    icon: Cloud,
    label: "Cloud Infrastructure",
    gradient: GRADIENT_MAP['blue-cyan'],
    subtitle: "text-primary",
  },
  {
    id: "performance",
    icon: Zap,
    label: "Performance Optimization",
    gradient: GRADIENT_MAP['yellow-amber'],
    subtitle: "text-secondary",
  },
  {
    id: "e-commerce",
    icon: ShoppingCart,
    label: "E-Commerce Solutions",
    gradient: GRADIENT_MAP['green-emerald'],
    subtitle: "text-primary",
  },
  {
    id: "security",
    icon: Shield,
    label: "Security & DevOps",
    gradient: GRADIENT_MAP['purple-violet'],
    subtitle: "text-secondary",
  },
  {
    id: "seo",
    icon: TrendingUp,
    label: "SEO Services",
    gradient: GRADIENT_MAP['orange-red'],
    subtitle: "text-primary",
  },
  {
    id: "package",
    icon: Package,
    label: "Packages",
    gradient: GRADIENT_MAP['orange-red'],
    subtitle: "text-secondary",
  },
  {
    id: "whyWork",
    icon: Award,
    label: "Why Work With Me",
    gradient: GRADIENT_MAP['teal-cyan'],
    subtitle: "text-primary",
  },
  {
    id: "processTimeline",
    icon: Clock,
    label: "Process Timeline",
    gradient: GRADIENT_MAP['fuchsia-pink'],
    subtitle: "text-secondary",
  },
  {
    id: "cta",
    icon: ContactIcon,
    label: "Contacts",
    gradient: GRADIENT_MAP['green-emerald'], // Reusing a strong color
    subtitle: "text-primary",
  },
];