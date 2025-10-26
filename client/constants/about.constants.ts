import myImg from "@/assets/images/me.jpg";
import {
  Achievement,
  Certification,
  ProjectFeature,
  SkillsCategory,
  TimelineItem,
} from "@/types/about.types";
import {
  Briefcase,
  Code,
  Code2,
  Coffee,
  Database,
  Globe,
  Heart,
  Home,
  Lightbulb,
  Mail,
  Rocket,
  User,
  Users,
  Zap,
} from "lucide-react";
import { GRADIENT_MAP } from "./index.constants";

export const ABOUT_SECTIONS = [
  {
    id: "hero",
    label: "Home",
    icon: Home,
    gradient: "from-blue-500 to-cyan-500",
    subtitle: "text-cyan-400",
  },
  {
    id: "intro",
    label: "Introduction",
    icon: User,
    gradient: "from-indigo-500 to-purple-500",
    subtitle: "text-indigo-400",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Code,
    gradient: "from-green-500 to-emerald-500",
    subtitle: "text-green-400",
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    gradient: "from-yellow-500 to-amber-500",
    subtitle: "text-yellow-400",
  },
  {
    id: "fun-facts",
    label: "Fun Facts",
    icon: Lightbulb,
    gradient: "from-pink-500 to-rose-500",
    subtitle: "text-pink-400",
  },
  {
    id: "cta",
    label: "Contacts",
    icon: Mail, // Assuming you meant Mail or MessageCircle for 'ContactIcon'
    gradient: "from-red-500 to-orange-500",
    subtitle: "text-orange-400",
  },
];

export const certifications: Certification[] = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-CSA-2023-001",
    status: "Active",
    description:
      "Demonstrates expertise in designing distributed systems on AWS platform.",
    color: "chart-1",
  },
  {
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "2022",
    credentialId: "GCP-PD-2022-045",
    status: "Active",
    description:
      "Validates skills in developing scalable applications on Google Cloud Platform.",
    color: "chart-2",
  },
  {
    title: "Meta Frontend Developer Certificate",
    issuer: "Meta (Facebook)",
    date: "2021",
    credentialId: "META-FE-2021-789",
    status: "Active",
    description:
      "Comprehensive program covering React, JavaScript, and modern frontend development.",
    color: "chart-3",
  },
];

export const achievements: Achievement[] = [
  {
    title: "Top 1% Developer",
    platform: "Stack Overflow",
    description:
      "Recognized for contributions to the developer community with 50K+ reputation points.",
    icon: "trending",
  },
  {
    title: "Open Source Contributor",
    platform: "GitHub",
    description:
      "Active contributor to popular open-source projects with 100+ merged pull requests.",
    icon: "users",
  },
  {
    title: "Technical Writer",
    platform: "Dev.to",
    description:
      "Published 25+ technical articles with 100K+ total views and 5K+ followers.",
    icon: "book",
  },
];

export const experiences = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    period: "2022 - Present",
    description:
      "Lead frontend development for a SaaS platform serving 100K+ users. Architected and implemented a component library that reduced development time by 40%. Mentored junior developers and established best practices for code quality.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    achievements: [
      "Improved application performance by 60%",
      "Led migration to TypeScript",
      "Built design system used across 5 products",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    period: "2020 - 2022",
    description:
      "Developed and maintained multiple client projects from concept to deployment. Built responsive web applications, RESTful APIs, and integrated third-party services. Collaborated directly with clients to understand requirements and deliver solutions.",
    technologies: ["Vue.js", "Node.js", "Express", "MongoDB", "AWS"],
    achievements: [
      "Delivered 15+ client projects on time",
      "Reduced server costs by 30% through optimization",
      "Implemented CI/CD pipelines",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Pro",
    location: "New York, NY",
    period: "2019 - 2020",
    description:
      "Created pixel-perfect, responsive websites for various clients including e-commerce platforms, corporate websites, and landing pages. Worked closely with designers to implement complex UI/UX designs.",
    technologies: ["HTML5", "CSS3", "JavaScript", "jQuery", "WordPress"],
    achievements: [
      "Built 25+ responsive websites",
      "Achieved 95+ PageSpeed scores",
      "Increased client conversion rates by 25%",
    ],
  },
];

export const funFacts = [
  {
    icon: Coffee,
    title: "Coffee Lover",
    description: "500+ cups consumed while coding",
    gradientKey: GRADIENT_MAP["teal-cyan"],
    stat: "500+",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "20+ contributions to community projects",
    gradientKey: GRADIENT_MAP["yellow-amber"],
    stat: "20+",
  },
  {
    icon: Globe,
    title: "Global Traveler",
    description: "Coded from 15+ countries",
    gradientKey: GRADIENT_MAP["teal-cyan"],
    stat: "15+",
  },
  {
    icon: Heart,
    title: "Mentor",
    description: "Helped 50+ developers start their journey",
    gradientKey: GRADIENT_MAP["pink-rose"],
    stat: "50+",
  },
  {
    icon: Zap,
    title: "Fast Learner",
    description: "Mastered 3 new frameworks this year",
    gradientKey: GRADIENT_MAP["indigo-purple"],
    stat: "3+",
  },
  {
    icon: Users,
    title: "Team Player",
    description: "Led 10+ cross-functional teams",
    gradientKey: GRADIENT_MAP["generic-accent"],
    stat: "10+",
  },
];

export const PROFILE_INFO = {
  name: "Younes eMazouz",
  img: myImg,
  role: "Full-Stack Developer",
  location: "Available for remote work",
  tagline:
    "Building production-ready systems with passion, powered by solid fundamentals.",
  email: "emazouz.dev@gmail.com",
} as const;

export const JOURNEY_TIMELINE: TimelineItem[] = [
  {
    icon: Heart,
    title: "The Spark",
    year: "Beginning",
    description: "Started with a love for programming.",
  },
  {
    icon: Lightbulb,
    title: "The Pivot",
    year: "Foundations",
    description: "Mastered C++, OOP, algorithms.",
  },
  {
    icon: Code2,
    title: "Frontend Mastery",
    year: "Growth",
    description: "React, TypeScript, modern tools.",
  },
  {
    icon: Database,
    title: "Backend Journey",
    year: "Evolution",
    description: "Node.js, .NET, databases.",
  },
  {
    icon: Rocket,
    title: "Full-Stack",
    year: "Today",
    description: "Building production systems.",
  },
];

export const SKILLS: SkillsCategory = {
  frontend: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Redux",
    "Zustand",
    "Framer Motion",
    "Sass",
  ],
  backend: ["Node.js", "Express.js", "NestJS", "C#", ".NET"],
  database: ["PostgreSQL", "MongoDB", "Prisma", "SQL Server"],
  devops: ["Docker", "CI/CD", "System Design", "Design Patterns"],
};

export const ECOMMERCE_FEATURES: ProjectFeature[] = [
  { label: "State Management", value: "Redux for complex flows" },
  { label: "Authentication", value: "JWT with refresh tokens" },
  { label: "Database", value: "PostgreSQL with Prisma ORM" },
  { label: "DevOps", value: "Docker + CI/CD pipelines" },
];

export enum SKILLS_BADGE {
  FRONTEND = "chart-1",
  BACKEND = "chart-2",
  DATABASE = "chart-3",
  DEVOPS = "chart-4",
  CODE = "chart-5",
  HEART = "chart-6",
  OTHER = "chart-7",
}
