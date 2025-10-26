import { Feature } from "@/types/index.types";
import {
  AddOn,
  PackageType,
  Service,
  Stat,
  TimelineStep,
} from "@/types/services.types";
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
  Rocket,
  Target,
  MessageSquare,
  HeadphonesIcon,
  Search,
  TestTube,
  Wrench,
  Users,
  Star,
} from "lucide-react";
import { GRADIENT_MAP } from "./index.constants";

export const services: Feature[] = [
  {
    icon: Code,
    title: "Full-Stack Web Development",
    benefits: [
      "Next.js 14 with App Router",
      "TypeScript & Type Safety",
      "RESTful API Development",
      "Server-Side Rendering (SSR)",
      "Real-time Features with WebSockets",
    ],
    description:
      "End-to-end web application development using cutting-edge technologies. I build scalable, maintainable solutions that grow with your business from prototype to production.",
    gradient: GRADIENT_MAP["indigo-purple"],
  },
  {
    icon: Palette,
    title: "UI/UX Design & Development",
    benefits: [
      "Figma to Code Conversion",
      "Responsive & Mobile-First Design",
      "Design Systems & Component Libraries",
      "Accessibility (WCAG 2.1 Compliance)",
      "User-Centric Interface Design",
    ],
    description:
      "Transform concepts into beautiful, intuitive interfaces. I bridge the gap between design and development to create seamless user experiences that drive engagement and conversion.",
    gradient: GRADIENT_MAP["pink-rose"],
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure & DevOps",
    benefits: [
      "AWS Cloud Architecture",
      "Docker & Container Orchestration",
      "CI/CD Pipelines with GitHub Actions",
      "Infrastructure as Code (Terraform)",
      "Microservices Deployment",
    ],
    description:
      "Build resilient, scalable cloud infrastructure that handles traffic spikes and grows with your user base. I ensure high availability and optimal performance across global regions.",
    gradient: GRADIENT_MAP["blue-cyan"],
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    benefits: [
      "Core Web Vitals Optimization",
      "Database Query Optimization",
      "Bundle Size Reduction & Code Splitting",
      "Advanced Caching Strategies (Redis, CDN)",
      "Lighthouse Score Improvement",
    ],
    description:
      "Turbocharge your application's speed and efficiency. I identify bottlenecks and implement optimizations that enhance user experience and boost SEO rankings.",
    gradient: GRADIENT_MAP["yellow-amber"],
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    benefits: [
      "Stripe & PayPal Payment Integration",
      "Real-time Inventory Management",
      "Order & Customer Management Systems",
      "Analytics & Reporting Dashboards",
      "Multi-vendor Marketplace Solutions",
    ],
    description:
      "Create powerful online stores that convert visitors into customers. I build secure, feature-rich e-commerce platforms with seamless payment processing and inventory management.",
    gradient: GRADIENT_MAP["green-emerald"],
  },
  {
    icon: Shield,
    title: "Security & Maintenance",
    benefits: [
      "Security Audits & Penetration Testing",
      "Automated Backup & Disaster Recovery",
      "24/7 Monitoring & Alert Systems",
      "SSL/TLS & Security Headers",
      "GDPR & Compliance Implementation",
    ],
    description:
      "Protect your digital assets with enterprise-grade security measures. I implement robust security protocols and monitoring systems to safeguard your data and ensure business continuity.",
    gradient: GRADIENT_MAP["purple-violet"],
  },
];
export const SERVICES: Service[] = [
  {
    id: "fullstack",
    icon: Code2,
    label: "Full-Stack Development",
    gradient: GRADIENT_MAP["indigo-purple"],
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
    gradient: GRADIENT_MAP["pink-rose"],
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
    gradient: GRADIENT_MAP["blue-cyan"],
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
    gradient: GRADIENT_MAP["yellow-amber"],
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
    gradient: GRADIENT_MAP["green-emerald"],
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
    gradient: GRADIENT_MAP["purple-violet"],
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
    gradient: GRADIENT_MAP["orange-red"],
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

export const PACKAGES: PackageType[] = [
  {
    name: "Standard",
    price: "1499",
    tagline: "Perfect for startups and small businesses",
    // Mapped to chart-5
    color: GRADIENT_MAP["green-emerald"],
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
    color: GRADIENT_MAP["red-rose"],
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
    color: GRADIENT_MAP["orange-amber"],
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
    color: GRADIENT_MAP["blue-cyan"],
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
    gradient: GRADIENT_MAP["blue-lightcyan"],
    subtitle: "text-primary",
  },
  {
    id: "fullstack",
    icon: Code2,
    label: "Full-Stack Development",
    gradient: GRADIENT_MAP["indigo-purple"],
    subtitle: "text-primary",
  },
  {
    id: "uiux",
    icon: Palette,
    label: "UI/UX Design",
    gradient: GRADIENT_MAP["pink-rose"],
    subtitle: "text-secondary",
  },
  {
    id: "cloud",
    icon: Cloud,
    label: "Cloud Infrastructure",
    gradient: GRADIENT_MAP["blue-cyan"],
    subtitle: "text-primary",
  },
  {
    id: "performance",
    icon: Zap,
    label: "Performance Optimization",
    gradient: GRADIENT_MAP["yellow-amber"],
    subtitle: "text-secondary",
  },
  {
    id: "e-commerce",
    icon: ShoppingCart,
    label: "E-Commerce Solutions",
    gradient: GRADIENT_MAP["green-emerald"],
    subtitle: "text-primary",
  },
  {
    id: "security",
    icon: Shield,
    label: "Security & DevOps",
    gradient: GRADIENT_MAP["purple-violet"],
    subtitle: "text-secondary",
  },
  {
    id: "seo",
    icon: TrendingUp,
    label: "SEO Services",
    gradient: GRADIENT_MAP["orange-red"],
    subtitle: "text-primary",
  },
  {
    id: "package",
    icon: Package,
    label: "Packages",
    gradient: GRADIENT_MAP["orange-red"],
    subtitle: "text-secondary",
  },
  {
    id: "whyWork",
    icon: Award,
    label: "Why Work With Me",
    gradient: GRADIENT_MAP["teal-cyan"],
    subtitle: "text-primary",
  },
  {
    id: "processTimeline",
    icon: Clock,
    label: "Process Timeline",
    gradient: GRADIENT_MAP["fuchsia-pink"],
    subtitle: "text-secondary",
  },
  {
    id: "cta",
    icon: ContactIcon,
    label: "Contacts",
    gradient: GRADIENT_MAP["green-emerald"], // Reusing a strong color
    subtitle: "text-primary",
  },
];

// Apply mapping to the FEATURES array (using the data structure from section 1)
export const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Full-Stack Expertise",
    description:
      "One developer, complete ownership. No coordination overhead between frontend and backend teams—just seamless, unified development.",
    gradient: GRADIENT_MAP["yellow-amber"],
    benefits: [
      "50% faster delivery",
      "Zero integration issues",
      "Single point of accountability",
    ],
  },
  {
    icon: Rocket,
    title: "Modern Technology Stack",
    description:
      "Built with the latest, production-tested frameworks that major companies trust. Your project stays relevant for years, not months.",
    gradient: GRADIENT_MAP["indigo-purple"],
    benefits: [
      "Future-proof architecture",
      "Better performance",
      "Easier maintenance",
    ],
  },
  {
    icon: Target,
    title: "Business-Focused Results",
    description:
      "Code is a means to an end. I focus on metrics that matter: conversions, revenue, and user satisfaction—not just lines of code.",
    gradient: GRADIENT_MAP["pink-rose"],
    benefits: [
      "ROI-driven decisions",
      "Measurable outcomes",
      "Growth-oriented features",
    ],
  },
  {
    icon: MessageSquare,
    title: "Crystal Clear Communication",
    description:
      "No technical jargon, no ghosting. Weekly updates, transparent timelines, and honest feedback throughout the entire project.",
    gradient: GRADIENT_MAP["blue-lightcyan"],
    benefits: ["Weekly progress reports", "Always responsive", "No surprises"],
  },
  {
    icon: Shield,
    title: "Security & Compliance First",
    description:
      "Enterprise-grade security built in from day one. GDPR-compliant, encrypted data, and protected against common vulnerabilities.",
    gradient: GRADIENT_MAP["generic-accent"],
    benefits: ["Data encryption", "GDPR compliant", "Regular security audits"],
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Partnership",
    description:
      "I don't disappear after launch. Ongoing support, optimization, and feature development keep your platform competitive.",
    gradient: GRADIENT_MAP["red-rose"],
    benefits: [
      "Monthly maintenance",
      "Priority support",
      "Continuous optimization",
    ],
  },
];

export const ADD_ONS: AddOn[] = [
  { service: "Additional pages", price: "$15/page" },
  { service: "Custom plugin development", price: "From $50" },
  { service: "Monthly maintenance", price: "$50-$150" },
  { service: "Content creation", price: "From $30" },
  { service: "Logo design", price: "$80" },
  { service: "Social media integration", price: "$40" },
];

export const TIMELINE_STEPS: TimelineStep[] = [
  // ... (Data structure unchanged)
  {
    icon: Search,
    title: "Discovery & Strategy",
    description: "Deep dive into your business goals, target audience...",
    duration: "3-5 days",
    deliverables: [
      "Requirements document",
      "Project timeline",
      "Technical specification",
    ],
  },
  {
    icon: Palette,
    title: "Design & Prototyping",
    description: "Transform ideas into beautiful, user-centered designs...",
    duration: "1-2 weeks",
    deliverables: [
      "Wireframes",
      "High-fidelity mockups",
      "Interactive prototype",
    ],
  },
  {
    icon: Code,
    title: "Development",
    description: "Building your solution with clean, maintainable code...",
    duration: "3-6 weeks",
    deliverables: ["Core functionality", "Admin dashboard", "API integration"],
  },
  {
    icon: TestTube,
    title: "Testing & QA",
    description: "Rigorous testing across devices, browsers, and scenarios...",
    duration: "1 week",
    deliverables: ["Test reports", "Bug fixes", "Performance optimization"],
  },
  {
    icon: Rocket,
    title: "Launch & Deployment",
    description: "Smooth deployment to production with zero downtime...",
    duration: "2-3 days",
    deliverables: [
      "Production deployment",
      "Monitoring setup",
      "Documentation",
    ],
  },
  {
    icon: Wrench,
    title: "Support & Optimization",
    description: "Continuous monitoring, updates, and optimization...",
    duration: "Ongoing",
    deliverables: [
      "Monthly reports",
      "Security updates",
      "Feature enhancements",
    ],
  },
];

// --- Theme Mapping ---
export const CHART_KEYS = [
  "chart-1", // Index 0: Primary/Indigo
  "chart-2", // Index 1: Pink/Rose
  "chart-3", // Index 2: Blue/Cyan
  "chart-4", // Index 3: Yellow/Amber
  "chart-5", // Index 4: Green/Emerald
  "chart-6", // Index 5: Purple/Violet
];

export const STATS: Stat[] = [
  {
    icon: Award,
    text: "Years Experience",
    value: "8+",
    gradient: GRADIENT_MAP["indigo-purple"], // chart-1
  },
  {
    icon: Users,
    text: "Projects Delivered",
    value: "100+",
    gradient: GRADIENT_MAP["orange-amber"], // chart-2
  },
  {
    icon: Star,
    text: "Client Satisfaction",
    value: "98%",
    gradient: GRADIENT_MAP["red-rose"], // chart-4
  },
];

export const KEY_FEATURES = [
  "Lightning-fast performance guaranteed",
  "Mobile-first responsive design",
  "SEO optimized from day one",
  "Enterprise-grade security",
];

export const CATEGORY_GRADIENTS: Record<string, string> = {
  MOBILE_DEVELOPMENT: "chart-3", // Blue/Cyan gradient
  WEB_DEVELOPMENT: "chart-5", // Green/Emerald gradient
  BACKEND: "chart-6", // Purple/Violet gradient
  DEVOPS: "chart-7", // Orange/Red gradient
  AI_ML: "chart-2", // Pink/Rose gradient
  DESIGN: "chart-4", // Yellow/Amber gradient
  OTHER: "chart-9", // Grey/Slate gradient
};
