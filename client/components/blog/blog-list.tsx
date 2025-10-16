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
  ArrowLeft,
  TrendingUp,
  MessageSquare,
  Grid3x3,
  List,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { BLOG_CATEGORIES } from "@/constants/BlogConstants";
import { Blog, blogStore } from "@/store/blogStore";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "mostViewed" | "mostLiked" | "trending";

interface FilterState {
  search: string;
  category: string;
  sortBy: SortOption;
  viewMode: ViewMode;
}

// ============================================================================
// CONSTANTS
// ============================================================================

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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

const calculateTrendingScore = (post: any): number => {
  const daysSincePublish = Math.floor(
    (Date.now() - new Date(post.publishDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyFactor = Math.max(0, 30 - daysSincePublish) / 30;
  return (post.views || 0) * 0.3 + (post.likes || 0) * 2 + recencyFactor * 100;
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  );
}

const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: any) => (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
    {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
  </div>
);

const BlogStats = ({ post, currentLanguage }: any) => (
  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

const BlogMetadata = ({ post, currentLanguage }: any) => (
  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
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

const FeaturedBlogCard = ({ post, currentLanguage }: any) => (
  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-primary/20">
    <div className="relative overflow-hidden">
      <img
        src={post.imageUrl || "/placeholder.svg"}
        alt={currentLanguage === "ar" ? post.title_ar : post.title_en}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900 font-semibold">
        ⭐ {currentLanguage === "ar" ? "مميز" : "Featured"}
      </Badge>
      {post.category && (
        <Badge className="absolute top-4 right-4 bg-background/90">
          {CATEGORY_ICONS[post.category]} {post.category.replace(/_/g, " ")}
        </Badge>
      )}
    </div>
    <CardHeader>
      <BlogMetadata post={post} currentLanguage={currentLanguage} />
      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
        {currentLanguage === "ar" ? post.title_ar : post.title_en}
      </CardTitle>
      <CardDescription className="line-clamp-3">
        {currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags?.slice(0, 3).map((tag: string) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            #{tag}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Link href={`/blog/view/${post.id}`}>
          <Button
            variant="ghost"
            className="p-0 h-auto text-primary hover:text-primary/80"
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

const RegularBlogCard = ({ post, currentLanguage, viewMode }: any) => {
  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="relative overflow-hidden md:w-64 h-48 md:h-auto">
            <img
              src={post.imageUrl || "/placeholder.svg"}
              alt={currentLanguage === "ar" ? post.title_ar : post.title_en}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.category && (
              <Badge
                variant="outline"
                className="absolute top-3 left-3 bg-background/90"
              >
                {CATEGORY_ICONS[post.category]}{" "}
                {post.category.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <div className="flex-1">
            <CardHeader>
              <BlogMetadata post={post} currentLanguage={currentLanguage} />
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                {currentLanguage === "ar" ? post.title_ar : post.title_en}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/blog/ViewBlog/${post.id}`}>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-primary hover:text-primary/80"
                  >
                    {currentLanguage === "ar" ? "اقرأ المزيد" : "Read More"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <BlogStats post={post} currentLanguage={currentLanguage} />
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl || "/placeholder.svg"}
          alt={currentLanguage === "ar" ? post.title_ar : post.title_en}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {post.category && (
          <Badge
            variant="outline"
            className="absolute top-3 right-3 bg-background/90"
          >
            {CATEGORY_ICONS[post.category]} {post.category.replace(/_/g, " ")}
          </Badge>
        )}
      </div>
      <CardHeader>
        <BlogMetadata post={post} currentLanguage={currentLanguage} />
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
          {currentLanguage === "ar" ? post.title_ar : post.title_en}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Link href={`/blog/ViewBlog/${post.id}`}>
            <Button
              variant="ghost"
              className="p-0 h-auto text-primary hover:text-primary/80"
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
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BlogList() {
  const { currentLanguage } = useTranslation();
  const { getBlogs, isLoading, error } = blogStore();

  // State Management
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "All",
    sortBy: "newest",
    viewMode: "grid",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[] | []>([]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    const fetchBlogs = async () => {
      const result = await getBlogs();
      if (result.success && result.data) {
        setBlogs(result.data?.blogs);
      }
      console.error("Failed to fetch blogs:", result.message);
      return;
    };
    fetchBlogs();
  }, [getBlogs]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const publishedBlogs = useMemo(() => {
    return blogs?.filter((blog) => blog.published);
  }, [blogs]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = publishedBlogs?.filter((post) => {
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

    // Apply sorting
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
      case "newest":
      default:
        filtered?.sort(
          (a, b) =>
            new Date(String(b.publishDate)).getTime() -
            new Date(String(a.publishDate)).getTime()
        );
    }

    return filtered;
  }, [publishedBlogs, filters, currentLanguage]);

  const featuredPosts = useMemo(
    () => filteredAndSortedPosts?.filter((post) => post.featured),
    [filteredAndSortedPosts]
  );

  const regularPosts = useMemo(
    () => filteredAndSortedPosts?.filter((post) => !post.featured),
    [filteredAndSortedPosts]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return regularPosts?.slice(startIndex, endIndex);
  }, [regularPosts, currentPage]);

  const totalPages = Math.ceil(regularPosts?.length / ITEMS_PER_PAGE);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

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

  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon="⚠️"
          title={currentLanguage === "ar" ? "حدث خطأ" : "An error occurred"}
          description={error}
          actionLabel={
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </>
          }
          onAction={() => (window.location.href = "/")}
        />
      </div>
    );
  }

  if (publishedBlogs?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          icon="📝"
          title={
            currentLanguage === "ar" ? "لا توجد مقالات" : "No blog posts yet"
          }
          description={
            currentLanguage === "ar"
              ? "المقالات قادمة قريباً. تابعنا للحصول على آخر التحديثات!"
              : "Blog posts are coming soon. Stay tuned for updates!"
          }
          actionLabel={
            <>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </>
          }
          onAction={() => (window.location.href = "/")}
        />
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            {publishedBlogs?.length}{" "}
            {currentLanguage === "ar" ? "مقالة" : "Articles"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {currentLanguage === "ar" ? "المدونة التقنية" : "Technical Blog"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentLanguage === "ar"
              ? "رؤى ودروس وأفكار حول تطوير الويب وأنماط التصميم وأحدث اتجاهات الصناعة"
              : "Insights, tutorials, and thoughts on web development, design patterns, and the latest industry trends"}
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-12 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={
                  currentLanguage === "ar"
                    ? "ابحث عن المقالات، الوسوم..."
                    : "Search articles, tags..."
                }
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {CATEGORY_ICONS[category.value] || "📝"}{" "}
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <Select
                value={filters.sortBy}
                onValueChange={(value: SortOption) =>
                  handleFilterChange("sortBy", value)
                }
              >
                <SelectTrigger className="w-48">
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

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border rounded-md p-1">
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

          {/* Active Filters Display */}
          {(filters.search ||
            filters.category !== "All" ||
            filters.sortBy !== "newest") && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {currentLanguage === "ar"
                  ? "الفلاتر النشطة:"
                  : "Active filters:"}
              </span>
              {filters.search && (
                <Badge variant="secondary">
                  {currentLanguage === "ar" ? "بحث:" : "Search:"}{" "}
                  {filters.search}
                </Badge>
              )}
              {filters.category !== "All" && (
                <Badge variant="secondary">
                  {filters.category.replace(/_/g, " ")}
                </Badge>
              )}
              {filters.sortBy !== "newest" && (
                <Badge variant="secondary">
                  {
                    SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.[
                      currentLanguage === "ar" ? "labelAr" : "label"
                    ]
                  }
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-6 text-xs"
              >
                {currentLanguage === "ar" ? "مسح الكل" : "Clear all"}
              </Button>
            </div>
          )}
        </div>

        {/* Featured Posts Section */}
        {featuredPosts?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span>⭐</span>
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

        {/* Regular Posts Section */}
        {regularPosts?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">
                {currentLanguage === "ar" ? "جميع المقالات" : "All Articles"}
                <span className="text-muted-foreground text-lg ml-2">
                  ({regularPosts?.length})
                </span>
              </h2>
            </div>

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
                >
                  {currentLanguage === "ar" ? "السابق" : "Previous"}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
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
                >
                  {currentLanguage === "ar" ? "التالي" : "Next"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results State */}
        {filteredAndSortedPosts?.length === 0 && (
          <EmptyState
            icon="🔍"
            title={
              currentLanguage === "ar"
                ? "لم يتم العثور على مقالات"
                : "No articles found"
            }
            description={
              currentLanguage === "ar"
                ? "حاول تعديل معايير البحث أو استعراض جميع الأقسام"
                : "Try adjusting your search criteria or browse all categories"
            }
            actionLabel={
              currentLanguage === "ar" ? "مسح الفلاتر" : "Clear Filters"
            }
            onAction={resetFilters}
          />
        )}
      </div>
    </div>
  );
}
