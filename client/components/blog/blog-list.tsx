"use client";

import { useState, useMemo, useEffect } from "react";
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
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useBlogsData } from "@/hooks/blogs/useBlogsData";
import { BLOG_CATEGORIES } from "@/constants/BlogConstants";

// Loading skeleton component
function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-40" />
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

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { currentLanguage } = useTranslation();
  const { blogs, isLoading, error } = useBlogsData();

  // Filter only published blogs
  const publishedBlogs = useMemo(() => {
    return blogs.filter((blog) => blog.published);
  }, [blogs]);

  // Filtered posts based on search and category
  const filteredPosts = useMemo(() => {
    return publishedBlogs.filter((post) => {
      const title = currentLanguage === "ar" ? post.title_ar : post.title_en;
      const excerpt =
        currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en;

      const matchesSearch =
        title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [publishedBlogs, searchQuery, selectedCategory, currentLanguage]);

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured),
    [filteredPosts]
  );

  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => !post.featured),
    [filteredPosts]
  );

  // Format date helper
  const formatDate = (dateString: string | Date) => {
    try {
      const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
      return date.toLocaleDateString(
        currentLanguage === "ar" ? "ar-SA" : "en-US"
      );
    } catch {
      return dateString.toString();
    }
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            {currentLanguage === "ar" ? "حدث خطأ" : "An error occurred"}
          </h1>
          <p className="text-muted-foreground">{error}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // No blogs state
  if (publishedBlogs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold">
            {currentLanguage === "ar" ? "لا توجد مقالات" : "No blog posts yet"}
          </h1>
          <p className="text-muted-foreground">
            {currentLanguage === "ar"
              ? "المقالات قادمة قريباً"
              : "Blog posts are coming soon"}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentLanguage === "ar" ? "المدونة التقنية" : "Technical Blog"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentLanguage === "ar"
              ? "رؤى ودروس وأفكار حول تطوير الويب وأنماط التصميم وأحدث اتجاهات الصناعة."
              : "Insights, tutorials, and thoughts on web development, design patterns, and the latest industry trends."}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={
                currentLanguage === "ar"
                  ? "ابحث عن المقالات..."
                  : "Search articles..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue
                  placeholder={
                    currentLanguage === "ar" ? "اختر القسم" : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">
              {currentLanguage === "ar"
                ? "المقالات المميزة"
                : "Featured Articles"}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={
                        currentLanguage === "ar" ? post.title_ar : post.title_en
                      }
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-yellow-900">
                      {currentLanguage === "ar" ? "مميز" : "Featured"}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                      {post.publishDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishDate)}
                        </div>
                      )}
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}{" "}
                          {currentLanguage === "ar" ? "دقيقة" : "min read"}
                        </div>
                      )}
                      {post.author?.name && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author.name}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                      {currentLanguage === "ar" ? post.title_ar : post.title_en}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {currentLanguage === "ar"
                        ? post.excerpt_ar
                        : post.excerpt_en}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/ViewBlog/${post.id}`}>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-purple-600 hover:text-purple-700"
                        >
                          {currentLanguage === "ar"
                            ? "اقرأ المزيد"
                            : "Read More"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">
              {currentLanguage === "ar" ? "جميع المقالات" : "All Articles"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={
                        currentLanguage === "ar" ? post.title_ar : post.title_en
                      }
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      variant="outline"
                      className="absolute top-3 right-3 bg-background/90"
                    >
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                      {post.publishDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishDate)}
                        </div>
                      )}
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}{" "}
                          {currentLanguage === "ar" ? "دقيقة" : "min"}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                      {currentLanguage === "ar" ? post.title_ar : post.title_en}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {currentLanguage === "ar"
                        ? post.excerpt_ar
                        : post.excerpt_en}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/ViewBlog/${post.id}`}>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-purple-600 hover:text-purple-700"
                        >
                          {currentLanguage === "ar"
                            ? "اقرأ المزيد"
                            : "Read More"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2">
              {currentLanguage === "ar"
                ? "لم يتم العثور على مقالات"
                : "No articles found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {currentLanguage === "ar"
                ? "حاول تعديل معايير البحث أو استعراض جميع الأقسام"
                : "Try adjusting your search criteria or browse all categories"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              {currentLanguage === "ar" ? "مسح الفلاتر" : "Clear Filters"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
