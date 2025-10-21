"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Rss,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeaderSection from "../HeaderSection";

// Enhanced articles data with proper variety (UNCHANGED)
const articles = [
  // ... (Your article data remains here)
  {
    id: 1,
    title_en: "State Management in Modern React",
    title_ar: "إدارة الحالة في React الحديثة",
    content_en:
      "Explore different state management solutions in React and when to use each one. Learn about Redux, Zustand, Jotai, and more...",
    content_ar:
      "استكشف حلول مختلفة لإدارة الحالة في React ومتى تستخدم كل واحدة منها. تعلم عن Redux و Zustand و Jotai والمزيد...",
    category: "WEB_DEVELOPMENT",
    published: true,
    featured: true,
    status: "PUBLISHED",
    tags: ["Next.js", "Redux", "Zustand", "React"],
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759328202/ecommerce/Blog/gallery/mfhytiroywrtxzcnjrug.jpg",
    readTime: 8,
    views: 375,
    likes: 45,
    keywords: ["react", "redux", "zustand", "jotai", "state management"],
    publishDate: "2025-01-15T10:30:00.000Z",
    author: {
      id: "cmfyj69cv0000ljx2f1lnhahj",
      name: "Younes Mazouz",
      email: "emazouz.dev@gmail.com",
      avatar: null,
    },
    userLiked: true,
  },
  {
    id: 2,
    title_en: "Building Scalable APIs with Node.js",
    title_ar: "بناء واجهات برمجية قابلة للتوسع مع Node.js",
    content_en:
      "Learn best practices for building robust and scalable REST APIs using Node.js, Express, and modern tools...",
    content_ar:
      "تعلم أفضل الممارسات لبناء واجهات برمجية قوية وقابلة للتوسع باستخدام Node.js و Express والأدوات الحديثة...",
    category: "BACKEND",
    published: true,
    featured: true,
    status: "PUBLISHED",
    tags: ["Node.js", "Express", "API", "Backend"],
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759328202/ecommerce/Blog/gallery/mfhytiroywrtxzcnjrug.jpg",
    readTime: 12,
    views: 521,
    likes: 67,
    keywords: ["nodejs", "express", "api", "rest", "backend"],
    publishDate: "2025-01-10T14:20:00.000Z",
    author: {
      id: "cmfyj69cv0000ljx2f1lnhahj",
      name: "Younes Mazouz",
      email: "emazouz.dev@gmail.com",
      avatar: null,
    },
    userLiked: false,
  },
  {
    id: 3,
    title_en: "TypeScript Best Practices for 2025",
    title_ar: "أفضل ممارسات TypeScript لعام 2025",
    content_en:
      "Discover the latest TypeScript features and best practices to write cleaner, safer, and more maintainable code...",
    content_ar:
      "اكتشف أحدث ميزات TypeScript وأفضل الممارسات لكتابة كود أنظف وأكثر أماناً وقابلية للصيانة...",
    category: "PROGRAMMING",
    published: true,
    featured: true,
    status: "PUBLISHED",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759328202/ecommerce/Blog/gallery/mfhytiroywrtxzcnjrug.jpg",
    readTime: 10,
    views: 892,
    likes: 123,
    keywords: ["typescript", "javascript", "programming", "best practices"],
    publishDate: "2025-01-05T09:15:00.000Z",
    author: {
      id: "cmfyj69cv0000ljx2f1lnhahj",
      name: "Younes Mazouz",
      email: "emazouz.dev@gmail.com",
      avatar: null,
    },
    userLiked: true,
  },
  {
    id: 4,
    title_en: "Mobile-First Design Principles",
    title_ar: "مبادئ التصميم للموبايل أولاً",
    content_en:
      "Master the art of mobile-first design with practical tips and real-world examples for creating responsive experiences...",
    content_ar:
      "أتقن فن التصميم للموبايل أولاً مع نصائح عملية وأمثلة واقعية لإنشاء تجارب متجاوبة...",
    category: "UI_UX",
    published: true,
    featured: true,
    status: "PUBLISHED",
    tags: ["UI/UX", "Mobile", "Design", "Responsive"],
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759328202/ecommerce/Blog/gallery/mfhytiroywrtxzcnjrug.jpg",
    readTime: 7,
    views: 643,
    likes: 89,
    keywords: ["mobile", "design", "responsive", "ui", "ux"],
    publishDate: "2024-12-28T16:45:00.000Z",
    author: {
      id: "cmfyj69cv0000ljx2f1lnhahj",
      name: "Younes Mazouz",
      email: "emazouz.dev@gmail.com",
      avatar: null,
    },
    userLiked: false,
  },
  {
    id: 5,
    title_en: "Database Design Patterns",
    title_ar: "أنماط تصميم قواعد البيانات",
    content_en:
      "Explore common database design patterns and learn when to use SQL vs NoSQL databases for your projects...",
    content_ar:
      "استكشف أنماط تصميم قواعد البيانات الشائعة وتعلم متى تستخدم قواعد بيانات SQL مقابل NoSQL لمشاريعك...",
    category: "DATABASE",
    published: true,
    featured: true,
    status: "PUBLISHED",
    tags: ["Database", "SQL", "NoSQL", "Architecture"],
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759328202/ecommerce/Blog/gallery/mfhytiroywrtxzcnjrug.jpg",
    readTime: 15,
    views: 456,
    likes: 78,
    keywords: ["database", "sql", "nosql", "design patterns"],
    publishDate: "2024-12-20T11:30:00.000Z",
    author: {
      id: "cmfyj69cv0000ljx2f1lnhahj",
      name: "Younes Mazouz",
      email: "emazouz.dev@gmail.com",
      avatar: null,
    },
    userLiked: true,
  },
  {
    id: 6,
    title_en: "Performance Optimization Techniques",
    title_ar: "تقنيات تحسين الأداء",
    content_en:
      "Learn advanced techniques to optimize your web applications for speed, efficiency, and better user experience...",
    content_ar:
      "تعلم تقنيات متقدمة لتحسين تطبيقات الويب الخاصة بك من حيث السرعة والكفاءة وتجربة المستخدم الأفضل...",
    category: "PERFORMANCE",
    published: true,
    featured: true,
    status: "PUBLISHED",
    tags: ["Performance", "Optimization", "Web Vitals"],
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759328202/ecommerce/Blog/gallery/mfhytiroywrtxzcnjrug.jpg",
    readTime: 11,
    views: 734,
    likes: 102,
    keywords: ["performance", "optimization", "web vitals", "speed"],
    publishDate: "2024-12-15T13:00:00.000Z",
    author: {
      id: "cmfyj69cv0000ljx2f1lnhahj",
      name: "Younes Mazouz",
      email: "emazouz.dev@gmail.com",
      avatar: null,
    },
    userLiked: false,
  },
];

type ArticleType = (typeof articles)[0];

// FIX: Theme-aware Category color mapping using chart colors
const categoryColorMap: Record<string, string> = {
  WEB_DEVELOPMENT: "bg-chart-3/90", // Blue/Cyan
  BACKEND: "bg-chart-5/90", // Green/Emerald
  PROGRAMMING: "bg-chart-1/90", // Primary/Purple
  UI_UX: "bg-chart-2/90", // Pink/Rose
  DATABASE: "bg-chart-4/90", // Orange/Amber
  PERFORMANCE: "bg-chart-7/90", // Red/Orange
  MOBILE_DEVELOPMENT: "bg-chart-8/90",
};

export function LatestArticlesSection() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null);
  const [likedArticles, setLikedArticles] = useState<Set<number>>(
    new Set(articles.filter((a) => a.userLiked).map((a) => a.id))
  );
  const router = useRouter();

  const currentLanguage = "en"; // Replace with actual i18n

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  const getLocalizedContent = (article: ArticleType) => {
    const isEnglish = currentLanguage === "en";
    return {
      title: isEnglish ? article.title_en : article.title_ar,
      content: isEnglish ? article.content_en : article.content_ar,
    };
  };

  const toggleLike = (articleId: number) => {
    setLikedArticles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleReadArticle = (articleId: number) => {
    router.push(`/blog/${articleId}`);
  };

  return (
    <section className="">
      <div className="wrapper">
        <HeaderSection
          icon={<Rss className="animate-pulse" />}
          badgeTitle="Blogs"
          title="Latest Articles"
          description="Stay updated with my latest thoughts, tutorials, and tips on web
            development and design."
          ctaText={`View All ${articles.length}+ Articles`}
          ctaHref="/blog"
        />

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const localizedContent = getLocalizedContent(article);
            const isHovered = hoveredArticle === article.id;
            const isLiked = likedArticles.has(article.id);
            const categoryBgClass =
              categoryColorMap[article.category] || "bg-primary/90";

            return (
              <Card
                key={article.id}
                className="group card overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredArticle(article.id)}
                onMouseLeave={() => setHoveredArticle(null)}
                onClick={() => handleReadArticle(article.id)}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-48">
                  <Image
                    src={article.imageUrl}
                    alt={localizedContent.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      // FIX: Use theme-aware category color map
                      className={`${categoryBgClass} text-white border-0 shadow-lg`}
                    >
                      {formatCategory(article.category)}
                    </Badge>
                  </div>

                  {/* Read Time Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      {article.readTime} min
                    </span>
                  </div>

                  {/* Stats on Hover */}
                  {isHovered && (
                    <div className="absolute bottom-4 left-4 right-4 flex gap-4 text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {article.views}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart
                          // FIX: Use theme's destructive color for liked status
                          className={`w-4 h-4 ${
                            isLiked ? "fill-destructive text-destructive" : ""
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {article.likes}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {localizedContent.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                    {localizedContent.content}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-medium">{article.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-xs text-muted-foreground"
                      >
                        +{article.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadArticle(article.id);
                      }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      // FIX: Use theme's destructive color for the like button
                      className={`
                        ${
                          isLiked
                            ? "text-destructive hover:text-destructive/80"
                            : "text-muted-foreground hover:text-destructive"
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(article.id);
                      }}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
