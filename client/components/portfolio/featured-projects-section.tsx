"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, BriefcaseBusiness, Github, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeaderSection from "../HeaderSection";

// Enhanced project data with proper variety (UNCHANGED)
const projects = [
  // ... (Your project data remains here)
  {
    id: 1,
    title_en: "E-Commerce Dashboard",
    title_ar: "لوحة تحكم التجارة الإلكترونية",
    description_en:
      "A comprehensive admin dashboard for managing online stores with real-time analytics, inventory management, and order processing",
    description_ar:
      "لوحة تحكم شاملة لإدارة المتاجر الإلكترونية مع تحليلات لحظية، إدارة المخزون ومعالجة الطلبات",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1758962707/ecommerce/project/gallery/y7lutd5c6odupyzjrp7e.webp",
    category: "WEB_DEVELOPMENT",
    status: "COMPLETED",
    liveUrl: "https://demo-ecommerce.example.com",
    githubUrl: "https://github.com/example/ecommerce-dashboard",
    technologies: [
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Next.js",
      "Tailwind CSS",
    ],
    tags: ["Next.js", "Analytics", "Full-Stack"],
    isPurchased: false,
    price: 199,
    featured: true,
    sortOrder: 1,
    rating: 4.5,
    ratingsCount: 55,
  },
  {
    id: 2,
    title_en: "SaaS Marketing Template",
    title_ar: "قالب تسويق البرمجيات كخدمة",
    description_en:
      "A conversion-optimized landing page template built for high-growth SaaS and subscription businesses with modern animations",
    description_ar:
      "قالب صفحة هبوط محسن للتحويلات، مصمم لشركات SaaS والاشتراكات سريعة النمو مع رسوم متحركة حديثة",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1758962707/ecommerce/project/gallery/y7lutd5c6odupyzjrp7e.webp",
    category: "UI_UX",
    status: "COMPLETED",
    liveUrl: "https://saas-template-demo.example.com",
    githubUrl: "https://github.com/example/saas-template",
    technologies: ["React", "Tailwind CSS", "Framer Motion", "TypeScript"],
    tags: ["Design", "Animation", "Landing Page"],
    isPurchased: true,
    price: 0,
    featured: true,
    sortOrder: 2,
    rating: 5,
    ratingsCount: 88,
  },
  {
    id: 3,
    title_en: "Task Management App",
    title_ar: "تطبيق إدارة المهام",
    description_en:
      "A full-stack project management tool with Kanban boards, drag-and-drop functionality, and real-time team collaboration",
    description_ar:
      "أداة إدارة مشاريع كاملة مع لوحات كانبان، وظيفة السحب والإفلات، وتعاون الفريق في الوقت الفعلي",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1758962707/ecommerce/project/gallery/y7lutd5c6odupyzjrp7e.webp",
    category: "FULL_STACK",
    status: "COMPLETED",
    liveUrl: "https://taskman-demo.example.com",
    githubUrl: "https://github.com/example/task-manager",
    technologies: ["Node.js", "Express", "MongoDB", "Socket.io", "React"],
    tags: ["Full-Stack", "Real-time", "Collaboration"],
    isPurchased: false,
    price: 249,
    featured: true,
    sortOrder: 3,
    rating: 4.8,
    ratingsCount: 120,
  },
  {
    id: 4,
    title_en: "AI Content Generator",
    title_ar: "مولد المحتوى بالذكاء الاصطناعي",
    description_en:
      "Generate high-quality content using advanced AI models. Perfect for bloggers, marketers, and content creators",
    description_ar:
      "إنشاء محتوى عالي الجودة باستخدام نماذج الذكاء الاصطناعي المتقدمة. مثالي للمدونين والمسوقين ومنشئي المحتوى",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1758962707/ecommerce/project/gallery/y7lutd5c6odupyzjrp7e.webp",
    category: "AI_ML",
    status: "COMPLETED",
    liveUrl: "https://ai-content.example.com",
    githubUrl: "https://github.com/example/ai-content",
    technologies: ["Python", "OpenAI", "FastAPI", "React", "TensorFlow"],
    tags: ["AI", "Machine Learning", "Content"],
    isPurchased: false,
    price: 299,
    featured: true,
    sortOrder: 4,
    rating: 4.7,
    ratingsCount: 92,
  },
  {
    id: 5,
    title_en: "Portfolio Website Builder",
    title_ar: "منشئ مواقع السيرة الذاتية",
    description_en:
      "Create stunning portfolio websites with drag-and-drop interface, customizable templates, and hosting included",
    description_ar:
      "إنشاء مواقع سيرة ذاتية مذهلة مع واجهة السحب والإفلات، قوالب قابلة للتخصيص، واستضافة مضمنة",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1758962707/ecommerce/project/gallery/y7lutd5c6odupyzjrp7e.webp",
    category: "WEB_DEVELOPMENT",
    status: "COMPLETED",
    liveUrl: "https://portfolio-builder.example.com",
    githubUrl: "https://github.com/example/portfolio-builder",
    technologies: ["Next.js", "Prisma", "Vercel", "Tailwind CSS"],
    tags: ["Portfolio", "No-Code", "Templates"],
    isPurchased: true,
    price: 0,
    featured: true,
    sortOrder: 5,
    rating: 4.9,
    ratingsCount: 156,
  },
  {
    id: 6,
    title_en: "Social Media Analytics",
    title_ar: "تحليلات وسائل التواصل الاجتماعي",
    description_en:
      "Track and analyze your social media performance across multiple platforms with detailed insights and reports",
    description_ar:
      "تتبع وتحليل أداء وسائل التواصل الاجتماعي عبر منصات متعددة مع رؤى وتقارير مفصلة",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1758962707/ecommerce/project/gallery/y7lutd5c6odupyzjrp7e.webp",
    category: "DATA_ANALYTICS",
    status: "COMPLETED",
    liveUrl: "https://social-analytics.example.com",
    githubUrl: "https://github.com/example/social-analytics",
    technologies: ["React", "D3.js", "Node.js", "PostgreSQL", "Redis"],
    tags: ["Analytics", "Dashboard", "Social Media"],
    isPurchased: false,
    price: 179,
    featured: true,
    sortOrder: 6,
    rating: 4.6,
    ratingsCount: 73,
  },
];

type ProjectDisplay = (typeof projects)[0];

// --- THEME-AWARE CATEGORY COLORS ---
// We map categories to theme-aware utility classes (or chart gradients for color diversity)
// To maintain color diversity without hardcoding specific shades:
const categoryColorMap: Record<string, string> = {
  WEB_DEVELOPMENT: "bg-chart-3/90", // Blue/Cyan
  UI_UX: "bg-chart-2/90", // Pink/Rose
  FULL_STACK: "bg-chart-5/90", // Green/Emerald
  AI_ML: "bg-chart-1/90", // Primary/Indigo/Purple
  DATA_ANALYTICS: "bg-chart-4/90", // Yellow/Amber
};

export function FeaturedProjectsSection() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);


  const currentLanguage = "en";

  const getLocalizedContent = (project: ProjectDisplay) => {
    const isEnglish = currentLanguage === "en";
    return {
      title: isEnglish ? project.title_en : project.title_ar,
      description: isEnglish ? project.description_en : project.description_ar,
      tags: project.tags,
      isPurchased: project.isPurchased,
      price: project.price,
      image: project.imageUrl,
    };
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  return (
    <section className="wrapper">
      <HeaderSection
        icon={<BriefcaseBusiness className="animate-pulse" />}
        badgeTitle="Portfolio"
        title="Featured Projects"
        description="Explore my latest work and case studies showcasing innovative solutions across web development, design, and technology."
        ctaText={`Explore All ${projects.length}+ Projects`}
        ctaHref="/projects"
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((projectData, index) => {
          const project = getLocalizedContent(projectData);
          const isHovered = hoveredProject === projectData.id;

          // Get theme-aware color class, falling back to primary
          const categoryBgClass =
            categoryColorMap[projectData.category] || "bg-primary/90";

          return (
            <Card
              key={projectData.id}
              className="group card overflow-hidden"
              onMouseEnter={() => setHoveredProject(projectData.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-t-lg h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Gradient Overlay (for image hover effect) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    // FIX: Use theme-aware category color map
                    className={`${categoryBgClass} text-white border-0 shadow-lg`}
                  >
                    {formatCategory(projectData.category)}
                  </Badge>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                  {/* Star color uses a strong yellow (secondary) */}
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  <span className="text-xs font-semibold text-foreground">
                    {projectData.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({projectData.ratingsCount})
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Technology Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <Button
                    size="sm"
                    // Primary CTA uses secondary variant for visibility over image
                    variant="secondary"
                    className="flex-1 backdrop-blur-sm hover:bg-primary"
                    asChild
                  >
                    <Link
                      href={projectData.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    // Secondary CTA for Github uses muted/ghost variant
                    variant="outline"
                    className="backdrop-blur-sm"
                    asChild
                  >
                    <Link
                      href={projectData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
