"use client";

/*
|--------------------------------------------------------------------------
| IMPORTS
|--------------------------------------------------------------------------
| All necessary React hooks, Next.js components, UI components, icons,
| and utility functions for the Blog Details page.
*/
import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Clock,
  Eye,
  Heart,
  ArrowLeft,
  Bookmark,
  Share2,
  TrendingUp,
  MessageSquare,
  Sparkles,
  User,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { CommentSection } from "@/components/blog/comment-section";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { SocialShare } from "@/components/blog/SocialShare";
import { Blog, blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
import { MarkdownContent } from "../markdown/markdown-content";

/*
|--------------------------------------------------------------------------
| TYPES & INTERFACES
|--------------------------------------------------------------------------
| TypeScript interfaces for component props and data structures.
*/
interface BlogDetailsProps {
  blogId: number;
}

/*
|--------------------------------------------------------------------------
| CONSTANTS & CONFIGURATION
|--------------------------------------------------------------------------
| Category-to-gradient mappings using CSS chart variables for consistent
| theming across light and dark modes.
*/

// Maps blog categories to chart gradient variables from globals.css
const CATEGORY_GRADIENTS: Record<string, string> = {
  MOBILE_DEVELOPMENT: "chart-3", // Blue/Cyan gradient
  WEB_DEVELOPMENT: "chart-5", // Green/Emerald gradient
  BACKEND: "chart-6", // Purple/Violet gradient
  DEVOPS: "chart-7", // Orange/Red gradient
  AI_ML: "chart-2", // Pink/Rose gradient
  DESIGN: "chart-4", // Yellow/Amber gradient
  OTHER: "chart-9", // Grey/Slate gradient
};

/*
|--------------------------------------------------------------------------
| UTILITY FUNCTIONS
|--------------------------------------------------------------------------
| Helper functions for data formatting and theme variable access.
*/

/**
 * Converts a chart key to a CSS variable reference
 * @param gradientKey - The chart key (e.g., "chart-1")
 * @returns CSS variable string (e.g., "var(--chart-1)")
 */
const getChartGradientVar = (gradientKey: string): string => {
  return `var(--${gradientKey})`;
};

/**
 * Formats a date string according to locale
 * @param dateString - ISO date string or Date object
 * @param locale - Language locale ("ar" or "en")
 * @returns Formatted date string
 */
const formatDate = (dateString: string | Date, locale: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString.toString();
  }
};

/**
 * Gets the gradient chart key for a given category
 * @param category - Blog category name
 * @returns Chart gradient key
 */
const getCategoryGradient = (category: string): string => {
  return CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.OTHER;
};

/*
|--------------------------------------------------------------------------
| SUB-COMPONENTS
|--------------------------------------------------------------------------
| Modular components for different sections of the blog detail page.
*/

/**
 * BLOG HEADER COMPONENT
 * Displays the blog title, metadata, author info, and action buttons.
 * Uses theme colors: primary, muted-foreground, foreground, destructive, secondary
 */
interface BlogHeaderProps {
  blog: Blog;
  localizedContent: any;
  formatDate: (date: string) => string;
  currentLanguage: string;
  isLiked: boolean;
  handleLike: () => void;
  handleBookmark: () => void;
  isBookmarked: boolean;
}

const BlogHeader = ({
  blog,
  localizedContent,
  formatDate,
  currentLanguage,
  isLiked,
  handleLike,
  handleBookmark,
  isBookmarked,
}: BlogHeaderProps) => (
  <div className="relative overflow-hidden">
    <div className="container relative z-10">
      {/* Back to Blog Link - Uses muted-foreground with foreground hover */}
      <Link
        href="/blog"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        {currentLanguage === "ar" ? "العودة للمدونة" : "Back to Blog"}
      </Link>

      {/* Category Badge - Uses primary color with backdrop blur */}
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl mb-6 w-fit">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-primary font-bold text-sm">
          {blog.category?.replace(/_/g, " ") || "ARTICLE"}
        </span>
      </div>

      {/* Blog Title - Uses foreground color */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
        {localizedContent.title}
      </h1>

      {/* Excerpt - Uses muted-foreground */}
      {localizedContent.excerpt && (
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {localizedContent.excerpt}
        </p>
      )}

      {/* Metadata Bar */}
      <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
        {/* Author Info - Avatar uses primary ring, name uses foreground */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 ring-2 ring-primary/50">
            <AvatarImage
              src={blog.author?.avatar || "/placeholder.svg"}
              alt={blog.author?.name || "Author"}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {blog.author?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-foreground">
              {blog.author?.name || "Unknown"}
            </p>
            {blog.publishDate && (
              <p className="text-sm text-muted-foreground">
                {formatDate(String(blog.publishDate))}
              </p>
            )}
          </div>
        </div>

        {/* Separator - Uses border color */}
        <Separator orientation="vertical" className="h-8 bg-border" />

        {/* Read Time */}
        {blog.readTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {blog.readTime} {currentLanguage === "ar" ? "دقيقة" : "min"}
            </span>
          </div>
        )}

        {/* Views Counter */}
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{blog.views || 0}</span>
        </div>

        {/* Like Button - Uses destructive color for active state */}
        <button
          onClick={handleLike}
          disabled={blog.userLiked || isLiked}
          className="flex items-center gap-2 hover:text-destructive transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={currentLanguage === "ar" ? "إعجاب" : "Like"}
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              blog.userLiked || isLiked
                ? "fill-destructive text-destructive"
                : "hover:scale-110"
            }`}
          />
          <span>{blog.likes || 0}</span>
        </button>

        {/* Bookmark Button - Uses secondary color for active state */}
        <button
          onClick={handleBookmark}
          className="flex items-center gap-2 hover:text-secondary transition-colors"
          aria-label={currentLanguage === "ar" ? "حفظ" : "Bookmark"}
        >
          <Bookmark
            className={`h-4 w-4 transition-all ${
              isBookmarked ? "fill-secondary text-secondary" : "hover:scale-110"
            }`}
          />
        </button>
      </div>
    </div>
  </div>
);

/**
 * BLOG STATISTICS CARD COMPONENT
 * Displays blog engagement metrics (views, likes, comments, shares).
 * Uses theme colors: card, border, primary, muted, foreground
 */
interface BlogStatisticsCardProps {
  blog: Blog;
  currentLanguage: string;
}

const BlogStatisticsCard = ({
  blog,
  currentLanguage,
}: BlogStatisticsCardProps) => {
  // Statistics data array
  const statistics = [
    {
      icon: Eye,
      label: currentLanguage === "ar" ? "المشاهدات" : "Views",
      value: blog.views || 0,
    },
    {
      icon: Heart,
      label: currentLanguage === "ar" ? "الإعجابات" : "Likes",
      value: blog.likes || 0,
    },
    {
      icon: MessageSquare,
      label: currentLanguage === "ar" ? "التعليقات" : "Comments",
      value: blog.comments?.length || 0,
    },
    {
      icon: Share2,
      label: currentLanguage === "ar" ? "المشاركات" : "Shares",
    },
  ];

  return (
    <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          {currentLanguage === "ar" ? "إحصائيات" : "Statistics"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {statistics.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between group hover:bg-muted/50 p-2 rounded-lg transition-colors"
          >
            <span className="text-sm text-muted-foreground flex items-center gap-2 group-hover:text-foreground transition-colors">
              <stat.icon className="h-4 w-4" />
              {stat.label}
            </span>
            <Badge className="bg-muted/50 border border-border text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {stat.value}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

/*
|--------------------------------------------------------------------------
| MAIN COMPONENT
|--------------------------------------------------------------------------
| The main BlogDetails component that orchestrates all sub-components
| and handles data fetching, state management, and user interactions.
*/
export default function BlogDetails({ blogId }: BlogDetailsProps) {
  /*
  |--------------------------------------------------------------------------
  | HOOKS & STATE
  |--------------------------------------------------------------------------
  */
  const { t, currentLanguage } = useTranslation();
  const { getBlogById, addLikeBlog, isLoading, getLocalizedContent } =
    blogStore();

  // Component state
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | DATA FETCHING
  |--------------------------------------------------------------------------
  */

  /**
   * Fetches blog data from the store
   * Also checks localStorage for bookmark status
   */
  const fetchBlog = useCallback(async () => {
    if (!blogId) return;

    try {
      const result = await getBlogById(blogId);

      if (result.success && result.data) {
        setBlog(result.data);
        setIsLiked(result.data.userLiked || false);

        // Check bookmark status from localStorage
        const bookmarks = JSON.parse(
          localStorage.getItem("blogBookmarks") || "[]"
        );
        setIsBookmarked(bookmarks.includes(blogId));
      } else {
        toast({
          title: t("Error", "common.error"),
          description:
            result.message || t("Failed to load blog", "blog.loadError"),
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast({
        title: t("Error", "common.error"),
        description: t(
          "An unexpected error occurred",
          "common.unexpectedError"
        ),
        variant: "error",
      });
    }
  }, [blogId, getBlogById, t]);

  // Fetch blog on component mount
  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  /*
  |--------------------------------------------------------------------------
  | EVENT HANDLERS
  |--------------------------------------------------------------------------
  */

  /**
   * Handles the like action for the blog post
   * Updates the server and local state
   */
  const handleLike = async () => {
    if (!blog || blog.userLiked || isLiked) return;

    try {
      const result = await addLikeBlog(blogId);

      if (!result.success) {
        toast({
          title: t("Error", "common.error"),
          description:
            result.message || t("Failed to like blog", "blog.likeError"),
          variant: "error",
        });
        return;
      }

      setIsLiked(true);
      toast({
        title: t("Success", "common.success"),
        description: t("Blog liked successfully!", "blog.likeSuccess"),
      });

      await fetchBlog();
    } catch (error) {
      console.error("Error liking blog:", error);
      toast({
        title: t("Error", "common.error"),
        description: t("Failed to like blog", "blog.likeError"),
        variant: "error",
      });
    }
  };

  /**
   * Handles bookmark toggle
   * Stores bookmark status in localStorage
   */
  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("blogBookmarks") || "[]");

    if (isBookmarked) {
      // Remove bookmark
      const updated = bookmarks.filter((id: number) => id !== blogId);
      localStorage.setItem("blogBookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      toast({
        title: t("Success", "common.success"),
        description: t("Bookmark removed", "blog.bookmarkRemoved"),
      });
    } else {
      // Add bookmark
      bookmarks.push(blogId);
      localStorage.setItem("blogBookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast({
        title: t("Success", "common.success"),
        description: t("Blog bookmarked!", "blog.bookmarkAdded"),
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COMPUTED VALUES
  |--------------------------------------------------------------------------
  */

  /**
   * Memoized localized content based on current language
   */
  const localizedContent = useMemo(() => {
    return blog ? getLocalizedContent(blog, currentLanguage) : null;
  }, [blog, currentLanguage, getLocalizedContent]);

  /*
  |--------------------------------------------------------------------------
  | RENDER CONDITIONS
  |--------------------------------------------------------------------------
  */

  // Loading state - Uses theme background
  if (isLoading) {
    return <Loader />;
  }

  // Not found state - Uses theme colors throughout
  if (!blog || !localizedContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {currentLanguage === "ar"
              ? "المقال غير موجود"
              : "Blog post not found"}
          </h1>
          <Link href="/blog">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للمدونة" : "Back to Blog"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div className="min-h-screen space-y-12 bg-background">
      {/* HEADER SECTION */}
      <BlogHeader
        blog={blog}
        localizedContent={localizedContent}
        formatDate={(date: string) => formatDate(date, currentLanguage)}
        currentLanguage={currentLanguage}
        isLiked={isLiked}
        handleLike={handleLike}
        handleBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />

      {/* FEATURED IMAGE SECTION - Uses background gradient overlay */}
      {blog.imageUrl && (
        <div className="relative h-[500px] overflow-hidden group">
          <Image
            src={blog.imageUrl}
            alt={localizedContent.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
            sizes="100vw"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          {/* Gradient overlay - Uses theme background color */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      {/* MAIN CONTENT SECTION */}
      <div className="container mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-12">
        {/* Content separator - Uses border color */}
        <Separator className="my-10 bg-border" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* LEFT COLUMN - Article Content (75% width on large screens) */}
          <div className="lg:col-span-3 space-y-8">
            {/* TAGS SECTION - Category uses chart gradient, tags use muted colors */}
            <div className="flex flex-wrap gap-2">
              {blog.category && (
                <Badge
                  className="text-primary-foreground border-0 hover:scale-105 transition-transform"
                  style={{
                    backgroundImage: getChartGradientVar(
                      getCategoryGradient(blog.category)
                    ),
                  }}
                >
                  {blog.category.replace(/_/g, " ")}
                </Badge>
              )}
              {blog.tags?.map((tag: string) => (
                <Badge
                  key={tag}
                  className="bg-muted/50 border border-border text-muted-foreground hover:border-primary/50 hover:bg-muted transition-all"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* ARTICLE BODY - Uses card background and border */}
            <article className="prose prose-lg max-w-none dark:prose-invert">
              {localizedContent.content && (
                <Card className="border-2 border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-8">
                    <MarkdownContent content={localizedContent.content} />
                  </CardContent>
                </Card>
              )}

              {/* META DESCRIPTION SECTION */}
              {localizedContent.metaDesc && (
                <>
                  <Separator className="my-12 bg-border" />
                  <Card className="border-2 border-border">
                    <CardContent className="p-8">
                      <MarkdownContent content={localizedContent.metaDesc} />
                    </CardContent>
                  </Card>
                </>
              )}
            </article>

            {/* IMAGE GALLERY SECTION - Uses card styling */}
            {blog.previewImages && blog.previewImages.length > 0 && (
              <Card className="border-2 border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">
                    {currentLanguage === "ar" ? "معرض الصور" : "Image Gallery"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6">
                    {blog.previewImages.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all group"
                      >
                        <Image
                          src={image}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="100vw"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SOCIAL SHARE SECTION - Uses card styling */}
            <Card className="border-2 border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  {currentLanguage === "ar" ? "شارك المقال" : "Share Article"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SocialShare
                  url={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/blog/${blog.slug}`
                      : ""
                  }
                  title={localizedContent.title}
                />
              </CardContent>
            </Card>

            {/* COMMENTS SECTION */}
            <div className="mt-12">
              <CommentSection
                blogId={Number(blog.id)}
                comments={blog.comments || []}
              />
            </div>
          </div>

          {/* RIGHT COLUMN - Sidebar (25% width on large screens) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* AUTHOR CARD - Uses card, primary ring, and theme colors */}
              {blog.author && (
                <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      {currentLanguage === "ar" ? "عن الكاتب" : "Author"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/50">
                        <AvatarImage
                          src={blog.author.avatar || "/placeholder.svg"}
                          alt={blog.author.name}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {blog.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-foreground">
                          {blog.author.name}
                        </h4>
                        {blog.author.email && (
                          <p className="text-xs text-muted-foreground">
                            {blog.author.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* KEYWORDS CARD - Uses muted colors with primary hover */}
              {blog.keywords && blog.keywords.length > 0 && (
                <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      {currentLanguage === "ar"
                        ? "الكلمات المفتاحية"
                        : "Keywords"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {blog.keywords.map((keyword: string) => (
                        <Badge
                          key={keyword}
                          className="bg-muted/50 border border-border text-muted-foreground hover:border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* STATISTICS CARD */}
              <BlogStatisticsCard
                blog={blog}
                currentLanguage={currentLanguage}
              />
            </div>
          </aside>
        </div>

        {/* RELATED POSTS SECTION */}
        <div className="mt-16">
          <RelatedPosts
            currentBlogId={Number(blog.id)}
            category={String(blog.category)}
          />
        </div>
      </div>
    </div>
  );
}
