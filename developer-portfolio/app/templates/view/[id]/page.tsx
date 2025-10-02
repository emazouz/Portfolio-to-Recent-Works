import { ViewTemplate } from "@/components/ViewTemplateProps";
import { notFound } from "next/navigation";

// Template data (in a real app, this would come from a database)
const templates = [
  {
    id: 1,
    title_en: "E-commerce Dashboard",
    title_ar: "لوحة تحكم التجارة الإلكترونية",
    description_en:
      "Complete admin dashboard for e-commerce platforms with analytics, inventory management, and order tracking.",
    description_ar:
      "لوحة تحكم كاملة لمنصات التجارة الإلكترونية مع تحليلات، إدارة المخزون وتتبع الطلبات.",
    price: 49,
    originalPrice: 69,
    rating: 4.9,
    ratingsCount: 120,
    downloads: 1200,
    views: 0,
    tags: ["React", "Next.js", "Tailwind", "TypeScript"],
    category: "ADMIN_DASHBOARDS",
    imageUrl: "/modern-ecommerce-dashboard.png",
    previewImages: ["/preview1.png", "/preview2.png"],
    previewUrl: "https://ecommerce-dashboard-demo.vercel.app",
    downloadUrl: "/downloads/ecommerce-dashboard.zip",
    fileSize: "25MB",
    difficulty: "ADVANCED",
    featured: true,
    isActive: true,
    version: "1.0.0",
    changelog: "Initial release with full e-commerce dashboard functionality.",
    slug_en: "e-commerce-dashboard",
    slug_ar: "لوحة-تحكم-التجارة-الإلكترونية",
    metaTitle_en: "E-Commerce Admin Dashboard Template",
    metaTitle_ar: "قالب لوحة إدارة التجارة الإلكترونية",
    metaDesc_en:
      "Complete admin dashboard template for e-commerce platforms with analytics.",
    metaDesc_ar:
      "قالب لوحة إدارة كاملة لمنصات التجارة الإلكترونية مع التحليلات.",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date("2025-01-15"),
  },
  {
    id: 2,
    title_en: "SaaS Landing Page",
    title_ar: "صفحة هبوط SaaS",
    description_en:
      "Modern landing page template perfect for SaaS products with pricing tables and feature sections.",
    description_ar:
      "قالب صفحة هبوط حديث مثالي لمنتجات SaaS مع جداول الأسعار وأقسام المميزات.",
    price: 29,
    originalPrice: 39,
    rating: 4.8,
    ratingsCount: 85,
    downloads: 890,
    views: 0,
    tags: ["React", "Framer Motion", "TypeScript", "Tailwind"],
    category: "LANDING_PAGES",
    imageUrl: "/saas-landing-page.png",
    previewImages: ["/saas-preview1.png", "/saas-preview2.png"],
    previewUrl: "https://saas-landing-demo.vercel.app",
    downloadUrl: "/downloads/saas-landing.zip",
    fileSize: "15MB",
    difficulty: "INTERMEDIATE",
    featured: true,
    isActive: true,
    version: "1.0.0",
    changelog:
      "Initial SaaS landing page release with animations and pricing tables.",
    slug_en: "saas-landing-page",
    slug_ar: "صفحة-هبوط-saas",
    metaTitle_en: "SaaS Landing Page Template",
    metaTitle_ar: "قالب صفحة هبوط SaaS",
    metaDesc_en:
      "Responsive SaaS landing page template with feature sections and pricing.",
    metaDesc_ar:
      "قالب صفحة هبوط متجاوب لمنتجات SaaS مع أقسام المميزات وجداول الأسعار.",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date("2025-01-10"),
  },
  {
    id: 3,
    title_en: "Portfolio Template",
    title_ar: "قالب معرض الأعمال",
    description_en:
      "Clean and minimal portfolio template for developers and designers to showcase their work.",
    description_ar:
      "قالب معرض أعمال نظيف وبسيط للمطورين والمصممين لعرض مشاريعهم.",
    price: 19,
    originalPrice: 29,
    rating: 4.7,
    ratingsCount: 60,
    downloads: 650,
    views: 0,
    tags: ["Next.js", "Tailwind", "MDX", "TypeScript"],
    category: "PORTFOLIO",
    imageUrl: "/minimal-portfolio-website.png",
    previewImages: ["/portfolio-preview1.png", "/portfolio-preview2.png"],
    previewUrl: "https://portfolio-demo.vercel.app",
    downloadUrl: "/downloads/portfolio-template.zip",
    fileSize: "10MB",
    difficulty: "BEGINNER",
    featured: false,
    isActive: true,
    version: "1.0.0",
    changelog: "Initial release of minimal portfolio template.",
    slug_en: "portfolio-template",
    slug_ar: "قالب-معرض-الأعمال",
    metaTitle_en: "Minimal Portfolio Template",
    metaTitle_ar: "قالب معرض أعمال بسيط",
    metaDesc_en:
      "Minimal and clean portfolio template for developers and designers.",
    metaDesc_ar: "قالب معرض أعمال بسيط ونظيف للمطورين والمصممين.",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date("2025-01-05"),
  },
  {
    id: 4,
    title_en: "Blog Platform",
    title_ar: "منصة المدونات",
    description_en:
      "Full-featured blog platform with CMS integration, SEO optimization, and comment system.",
    description_ar:
      "منصة مدونات متكاملة مع دعم CMS، تحسين SEO ونظام التعليقات.",
    price: 39,
    originalPrice: 49,
    rating: 4.6,
    ratingsCount: 45,
    downloads: 420,
    views: 0,
    tags: ["Next.js", "Sanity", "TypeScript", "Tailwind"],
    category: "BLOG_THEMES",
    imageUrl: "/modern-blog-platform.png",
    previewImages: ["/blog-preview1.png", "/blog-preview2.png"],
    previewUrl: "https://blog-platform-demo.vercel.app",
    downloadUrl: "/downloads/blog-platform.zip",
    fileSize: "18MB",
    difficulty: "INTERMEDIATE",
    featured: false,
    isActive: true,
    version: "1.0.0",
    changelog: "Initial release with full CMS and SEO support.",
    slug_en: "blog-platform",
    slug_ar: "منصة-المدونات",
    metaTitle_en: "Modern Blog Platform Template",
    metaTitle_ar: "قالب منصة مدونات حديثة",
    metaDesc_en: "Full-featured blog template with SEO and CMS integration.",
    metaDesc_ar: "قالب مدونات متكامل مع تحسين SEO ودعم CMS.",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date("2024-12-28"),
  },
  {
    id: 5,
    title_en: "Restaurant Website",
    title_ar: "موقع مطعم",
    description_en:
      "Beautiful restaurant website with menu display, reservation system, and online ordering.",
    description_ar: "موقع مطعم جميل مع عرض القائمة، نظام الحجز والطلب أونلاين.",
    price: 35,
    originalPrice: 45,
    rating: 4.5,
    ratingsCount: 38,
    downloads: 380,
    views: 0,
    tags: ["React", "Next.js", "Stripe", "Tailwind"],
    category: "WEBSITE_TEMPLATES",
    imageUrl: "/restaurant-website-template.png",
    previewImages: ["/restaurant-preview1.png", "/restaurant-preview2.png"],
    previewUrl: "https://restaurant-demo.vercel.app",
    downloadUrl: "/downloads/restaurant-template.zip",
    fileSize: "22MB",
    difficulty: "INTERMEDIATE",
    featured: false,
    isActive: true,
    version: "1.0.0",
    changelog: "Initial release with menu and online ordering system.",
    slug_en: "restaurant-website",
    slug_ar: "موقع-مطعم",
    metaTitle_en: "Restaurant Website Template",
    metaTitle_ar: "قالب موقع مطعم",
    metaDesc_en:
      "Beautiful restaurant website template with reservation and menu system.",
    metaDesc_ar: "قالب موقع مطعم جميل مع نظام الحجز وعرض القائمة.",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date("2024-12-20"),
  },
  {
    id: 6,
    title_en: "Crypto Dashboard",
    title_ar: "لوحة تداول العملات الرقمية",
    description_en:
      "Cryptocurrency trading dashboard with real-time data, charts, and portfolio tracking.",
    description_ar:
      "لوحة تداول العملات الرقمية مع بيانات لحظية، مخططات وتتبع المحفظة.",
    price: 59,
    originalPrice: 79,
    rating: 4.8,
    ratingsCount: 29,
    downloads: 290,
    views: 0,
    tags: ["React", "Chart.js", "WebSocket", "TypeScript"],
    category: "ADMIN_DASHBOARDS",
    imageUrl: "/crypto-trading-dashboard.png",
    previewImages: ["/crypto-preview1.png", "/crypto-preview2.png"],
    previewUrl: "https://crypto-dashboard-demo.vercel.app",
    downloadUrl: "/downloads/crypto-dashboard.zip",
    fileSize: "28MB",
    difficulty: "ADVANCED",
    featured: false,
    isActive: true,
    version: "1.0.0",
    changelog: "Initial release with real-time crypto tracking and charts.",
    slug_en: "crypto-dashboard",
    slug_ar: "لوحة-تداول-العملات-الرقمية",
    metaTitle_en: "Crypto Trading Dashboard Template",
    metaTitle_ar: "قالب لوحة تداول العملات الرقمية",
    metaDesc_en:
      "Real-time crypto dashboard template with charts and portfolio tracking.",
    metaDesc_ar:
      "قالب لوحة تداول العملات الرقمية لحظية مع المخططات وتتبع المحفظة.",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastUpdated: new Date("2024-12-15"),
  },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const template = templates.find((t) => t.id === Number.parseInt(id));

  if (!template) {
    return {
      title: "Template Not Found",
      description: "The requested template could not be found.",
    };
  }

  return {
    title: template.metaTitle_en,
    description: template.metaDesc_en,
    openGraph: {
      title: template.metaTitle_en,
      description: template.metaDesc_en,
      images: [template.imageUrl],
    },
  };
}

export default async function ViewTemplatePage({ params }: PageProps) {
  const { id } = await params;
  const template = templates.find((t) => t.id === Number.parseInt(id));

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <ViewTemplate template={template} />
      </main>
    </div>
  );
}
