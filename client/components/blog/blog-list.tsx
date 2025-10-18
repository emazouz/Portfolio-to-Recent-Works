"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Heart,
  TrendingUp,
  MessageSquare,
  Grid3x3,
  List,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { BLOG_CATEGORIES } from "@/constants/BlogConstants";
import { Blog, blogStore } from "@/store/blogStore";

// Types
type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "mostViewed" | "mostLiked" | "trending";

interface FilterState {
  search: string;
  category: string;
  sortBy: SortOption;
  viewMode: ViewMode;
}

// Constants
const ITEMS_PER_PAGE = 9;

const CATEGORY_ICONS: Record<string, string> = {
  MOBILE_DEVELOPMENT: "📱",
  WEB_DEVELOPMENT: "🌐",
  BACKEND: "⚙️",
  DEVOPS: "🚀",
  AI_ML: "🤖",
  DESIGN: "🎨",
  OTHER: "📝",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First", labelAr: "الأحدث أولاً" },
  { value: "oldest", label: "Oldest First", labelAr: "الأقدم أولاً" },
  { value: "mostViewed", label: "Most Viewed", labelAr: "الأكثر مشاهدة" },
  { value: "mostLiked", label: "Most Liked", labelAr: "الأكثر إعجاباً" },
  { value: "trending", label: "Trending", labelAr: "الرائج" },
];

// Utility Functions
const formatDate = (dateString: string | Date, locale: string) => {
  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString.toString();
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const calculateTrendingScore = (post: Blog): number => {
  const daysSincePublish = Math.floor(
    (Date.now() - new Date(String(post.publishDate)).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyFactor = Math.max(0, 30 - daysSincePublish) / 30;
  return (post.views || 0) * 0.3 + (post.likes || 0) * 2 + recencyFactor * 100;
};

// Sub-components
const BlogCardSkeleton = () => (
  <Card className="overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700">
    <Skeleton className="w-full h-48 bg-slate-800" />
    <CardHeader>
      <Skeleton className="h-4 w-20 bg-slate-800" />
      <Skeleton className="h-6 w-full bg-slate-800" />
      <Skeleton className="h-4 w-full bg-slate-800" />
    </CardHeader>
  </Card>
);

const BlogStats = ({
  post,
  currentLanguage,
}: {
  post: Blog;
  currentLanguage: string;
}) => (
  <div className="flex items-center gap-4 text-sm text-slate-400">
    <div
      className="flex items-center gap-1"
      title={currentLanguage === "ar" ? "المشاهدات" : "Views"}
    >
      <Eye className="h-4 w-4" />
      <span>{formatNumber(post.views || 0)}</span>
    </div>
    <div
      className="flex items-center gap-1"
      title={currentLanguage === "ar" ? "الإعجابات" : "Likes"}
    >
      <Heart className="h-4 w-4" />
      <span>{formatNumber(post.likes || 0)}</span>
    </div>
    <div
      className="flex items-center gap-1"
      title={currentLanguage === "ar" ? "التعليقات" : "Comments"}
    >
      <MessageSquare className="h-4 w-4" />
      <span>{formatNumber(post.comments?.length || 0)}</span>
    </div>
  </div>
);

const BlogMetadata = ({
  post,
  currentLanguage,
}: {
  post: Blog;
  currentLanguage: string;
}) => (
  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2 flex-wrap">
    {post.publishDate && (
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        {formatDate(post.publishDate, currentLanguage)}
      </div>
    )}
    {post.readTime && (
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {post.readTime} {currentLanguage === "ar" ? "دقيقة" : "min"}
      </div>
    )}
    {post.author?.name && (
      <div className="flex items-center gap-1">
        <User className="h-4 w-4" />
        {post.author.name}
      </div>
    )}
  </div>
);

const FeaturedBlogCard = ({
  post,
  currentLanguage,
}: {
  post: Blog;
  currentLanguage: string;
}) => (
  <Card className="group overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
    <div className="relative overflow-hidden">
      <img
        src={post.imageUrl || "/placeholder.svg"}
        alt={currentLanguage === "ar" ? post.title_ar : post.title_en}
        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse">
        <Sparkles className="w-3 h-3 mr-1" />
        {currentLanguage === "ar" ? "مميز" : "Featured"}
      </Badge>
      {post.category && (
        <Badge className="absolute top-4 right-4 bg-slate-900/90 border-slate-700">
          {CATEGORY_ICONS[post.category]} {post.category.replace(/_/g, " ")}
        </Badge>
      )}
    </div>
    <CardHeader>
      <BlogMetadata post={post} currentLanguage={currentLanguage} />
      <CardTitle className="text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all line-clamp-2">
        {currentLanguage === "ar" ? post.title_ar : post.title_en}
      </CardTitle>
      <CardDescription className="line-clamp-3 text-slate-400">
        {currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.slice(0, 3).map((tag: string) => (
          <Badge
            key={tag}
            className="text-xs bg-slate-800/80 border border-slate-700 text-slate-300"
          >
            #{tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Link href={`/blog/view/${post.id}`}>
          <Button
            variant="ghost"
            className="p-0 h-auto text-indigo-400 hover:text-indigo-300"
          >
            {currentLanguage === "ar" ? "اقرأ المزيد" : "Read More"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <BlogStats post={post} currentLanguage={currentLanguage} />
      </div>
    </CardContent>
  </Card>
);

const RegularBlogCard = ({
  post,
  currentLanguage,
  viewMode,
}: {
  post: Blog;
  currentLanguage: string;
  viewMode: ViewMode;
}) => {
  const cardContent = (
    <>
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl || "/placeholder.svg"}
          alt={currentLanguage === "ar" ? post.title_ar : post.title_en}
          className={`w-full ${
            viewMode === "list" ? "h-full md:h-auto" : "h-48"
          } object-cover group-hover:scale-110 transition-transform duration-700`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {post.category && (
          <Badge className="absolute top-3 right-3 bg-slate-900/90 border-slate-700">
            {CATEGORY_ICONS[post.category]} {post.category.replace(/_/g, " ")}
          </Badge>
        )}
      </div>
      <div className="flex-1">
        <CardHeader>
          <BlogMetadata post={post} currentLanguage={currentLanguage} />
          <CardTitle className="text-lg text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all line-clamp-2">
            {currentLanguage === "ar" ? post.title_ar : post.title_en}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-slate-400">
            {currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags
              ?.slice(0, viewMode === "list" ? 4 : 2)
              .map((tag: string) => (
                <Badge
                  key={tag}
                  className="text-xs bg-slate-800/80 border border-slate-700 text-slate-300"
                >
                  #{tag}
                </Badge>
              ))}
          </div>
          <div className="flex items-center justify-between">
            <Link href={`/blog/ViewBlog/${post.id}`}>
              <Button
                variant="ghost"
                className="p-0 h-auto text-indigo-400 hover:text-indigo-300"
              >
                {currentLanguage === "ar" ? "اقرأ المزيد" : "Read More"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <BlogStats post={post} currentLanguage={currentLanguage} />
          </div>
        </CardContent>
      </div>
    </>
  );

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto">{cardContent}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      {cardContent}
    </Card>
  );
};

// Main Component
export function BlogList() {
  const { currentLanguage } = useTranslation();
  const { getBlogs, isLoading, error } = blogStore();

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    sortBy: "newest",
    viewMode: "grid",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = useCallback(async () => {
    const result = await getBlogs();
    if (result.success && result.data) {
      setBlogs(result.data?.blogs || []);
    }
  }, [getBlogs]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const publishedBlogs = useMemo(
    () => blogs.filter((blog) => blog.published),
    [blogs]
  );

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = publishedBlogs.filter((post) => {
      const title = currentLanguage === "ar" ? post.title_ar : post.title_en;
      const excerpt =
        currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en;

      const matchesSearch =
        title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        excerpt?.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        );

      const matchesCategory =
        filters.category === "All" || post.category === filters.category;

      return matchesSearch && matchesCategory;
    });

    switch (filters.sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(String(a.publishDate)).getTime() -
            new Date(String(b.publishDate)).getTime()
        );
        break;
      case "mostViewed":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "mostLiked":
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "trending":
        filtered.sort(
          (a, b) => calculateTrendingScore(b) - calculateTrendingScore(a)
        );
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(String(b.publishDate)).getTime() -
            new Date(String(a.publishDate)).getTime()
        );
    }

    return filtered;
  }, [publishedBlogs, filters, currentLanguage]);

  const featuredPosts = useMemo(
    () => filteredAndSortedPosts.filter((post) => post.featured),
    [filteredAndSortedPosts]
  );
  const regularPosts = useMemo(
    () => filteredAndSortedPosts.filter((post) => !post.featured),
    [filteredAndSortedPosts]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return regularPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [regularPosts, currentPage]);

  const totalPages = Math.ceil(regularPosts.length / ITEMS_PER_PAGE);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      category: "All",
      sortBy: "newest",
      viewMode: "grid",
    });
    setCurrentPage(1);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4 sm:px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl mb-8">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-sm">
              {publishedBlogs.length}{" "}
              {currentLanguage === "ar" ? "مقالة" : "ARTICLES"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {currentLanguage === "ar" ? "المدونة التقنية" : "Technical Blog"}
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {currentLanguage === "ar"
              ? "رؤى ودروس وأفكار حول تطوير الويب وأنماط التصميم وأحدث اتجاهات الصناعة"
              : "Insights, tutorials, and thoughts on web development, design patterns, and the latest industry trends"}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder={
                  currentLanguage === "ar"
                    ? "ابحث عن المقالات..."
                    : "Search articles..."
                }
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {CATEGORY_ICONS[category.value]} {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value: SortOption) =>
                  handleFilterChange("sortBy", value)
                }
              >
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {currentLanguage === "ar" ? option.labelAr : option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 border border-slate-700 rounded-md p-1 bg-slate-800/50">
                <Button
                  variant={filters.viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={filters.viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => handleFilterChange("viewMode", "list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              {currentLanguage === "ar"
                ? "المقالات المميزة"
                : "Featured Articles"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedBlogCard
                  key={post.id}
                  post={post}
                  currentLanguage={currentLanguage}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-white mb-8">
              {currentLanguage === "ar" ? "جميع المقالات" : "All Articles"}
              <span className="text-slate-500 text-lg ml-2">
                ({regularPosts.length})
              </span>
            </h2>

            <div
              className={
                filters.viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {paginatedPosts.map((post) => (
                <RegularBlogCard
                  key={post.id}
                  post={post}
                  currentLanguage={currentLanguage}
                  viewMode={filters.viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  {currentLanguage === "ar" ? "السابق" : "Previous"}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage <= 3) page = i + 1;
                      else if (currentPage >= totalPages - 2)
                        page = totalPages - 4 + i;
                      else page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                            : "border-slate-700 hover:bg-slate-800"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border-slate-700 hover:bg-slate-800"
                >
                  {currentLanguage === "ar" ? "التالي" : "Next"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
