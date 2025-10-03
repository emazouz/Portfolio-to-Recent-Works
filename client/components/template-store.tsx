"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  Download,
  Star,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { TemplatePreviewModal } from "@/components/template-preview-modal";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";

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

const categories = [
  { value: "All", label_en: "All", label_ar: "الكل" },
  {
    value: "ADMIN_DASHBOARDS",
    label_en: "Admin Dashboards",
    label_ar: "لوحات الإدارة",
  },
  {
    value: "LANDING_PAGES",
    label_en: "Landing Pages",
    label_ar: "صفحات الهبوط",
  },
  { value: "PORTFOLIO", label_en: "Portfolio", label_ar: "معرض الأعمال" },
  { value: "BLOG_THEMES", label_en: "Blog Themes", label_ar: "قوالب المدونات" },
  {
    value: "WEBSITE_TEMPLATES",
    label_en: "Website Templates",
    label_ar: "قوالب المواقع",
  },
];

const sortOptions = [
  { value: "featured", label_en: "Featured", label_ar: "المميزة" },
  { value: "newest", label_en: "Newest", label_ar: "الأحدث" },
  {
    value: "price-low",
    label_en: "Price: Low to High",
    label_ar: "السعر: من الأقل للأعلى",
  },
  {
    value: "price-high",
    label_en: "Price: High to Low",
    label_ar: "السعر: من الأعلى للأقل",
  },
  { value: "rating", label_en: "Highest Rated", label_ar: "الأعلى تقييماً" },
  {
    value: "downloads",
    label_en: "Most Downloaded",
    label_ar: "الأكثر تحميلاً",
  },
];

const difficultyLabels = {
  BEGINNER: { en: "Beginner", ar: "مبتدئ" },
  INTERMEDIATE: { en: "Intermediate", ar: "متوسط" },
  ADVANCED: { en: "Advanced", ar: "متقدم" },
  EXPERT: { en: "Expert", ar: "خبير" },
};

export function TemplateStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [previewTemplate, setPreviewTemplate] = useState<
    (typeof templates)[0] | null
  >(null);
  const { currentLanguage } = useTranslation();

  const getLocalizedContent = (item: any, field: string) => {
    const langSuffix = currentLanguage === "ar" ? "_ar" : "_en";
    return item[`${field}${langSuffix}`] || item[`${field}_en`] || item[field];
  };

  const filteredAndSortedTemplates = useMemo(() => {
    const filtered = templates.filter((template) => {
      const title = getLocalizedContent(template, "title");
      const description = getLocalizedContent(template, "description");

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || template.category === selectedCategory;

      return matchesSearch && matchesCategory && template.isActive;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "newest":
          return (
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "downloads":
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, currentLanguage]);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentLanguage === "ar" ? "القوالب المميزة" : "Premium Templates"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentLanguage === "ar"
              ? "قوالب جاهزة للإنتاج لتسريع عملية التطوير. جميع القوالب تتضمن الكود المصدري والوثائق والتحديثات مدى الحياة."
              : "Production-ready templates to accelerate your development process. All templates include source code, documentation, and lifetime updates."}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={
                  currentLanguage === "ar"
                    ? "البحث في القوالب..."
                    : "Search templates..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue
                    placeholder={
                      currentLanguage === "ar"
                        ? "اختر الفئة"
                        : "Select category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {getLocalizedContent(category, "label")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue
                  placeholder={
                    currentLanguage === "ar" ? "ترتيب حسب" : "Sort by"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {getLocalizedContent(option, "label")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {currentLanguage === "ar"
              ? `عرض ${filteredAndSortedTemplates.length} من ${templates.length} قالب`
              : `Showing ${filteredAndSortedTemplates.length} of ${templates.length} templates`}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.imageUrl || "/placeholder.svg"}
                  alt={getLocalizedContent(template, "title")}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay with preview button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewTemplate(template)}
                    className="bg-white/90 text-black hover:bg-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {currentLanguage === "ar" ? "معاينة" : "Preview"}
                  </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
                      {currentLanguage === "ar" ? "مميز" : "Featured"}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-background/90">
                    {
                      difficultyLabels[
                        template.difficulty as keyof typeof difficultyLabels
                      ][currentLanguage === "ar" ? "ar" : "en"]
                    }
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                  <div className="flex items-center gap-1">
                    <span className="text-xs line-through text-muted-foreground">
                      ${template.originalPrice}
                    </span>
                    <span>${template.price}</span>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-1">
                      {getLocalizedContent(template, "title")}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {getLocalizedContent(template, "description")}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {template.rating} ({template.ratingsCount})
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {template.downloads}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    {currentLanguage === "ar"
                      ? `اشتري الآن - $${template.price}`
                      : `Buy Now - $${template.price}`}
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/templates/view/${template.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  {currentLanguage === "ar" ? "آخر تحديث: " : "Updated: "}
                  {new Date(template.lastUpdated).toLocaleDateString(
                    currentLanguage === "ar" ? "ar-SA" : "en-US"
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredAndSortedTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">
              {currentLanguage === "ar"
                ? "لم يتم العثور على قوالب"
                : "No templates found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {currentLanguage === "ar"
                ? "حاول تعديل معايير البحث أو تصفح جميع الفئات"
                : "Try adjusting your search criteria or browse all categories"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSortBy("featured");
              }}
            >
              {currentLanguage === "ar" ? "مسح المرشحات" : "Clear Filters"}
            </Button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}
