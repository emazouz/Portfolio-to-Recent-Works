"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  ArrowLeft,
  Bookmark,
  Share2,
  TrendingUp,
  MessageSquare,
  ChevronUp,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { CommentSection } from "@/components/blog/comment-section";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { SocialShare } from "@/components/blog/SocialShare";
import { Blog, blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
import { MarkdownContent } from "../markdown/markdown-content";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface BlogDetailsProps {
  blogId: number;
}

interface BlogMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  avgReadTime: number;
  completionRate: number;
}

interface ReadingProgress {
  percentage: number;
  timeSpent: number;
  scrollDepth: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORY_COLORS: Record<string, string> = {
  MOBILE_DEVELOPMENT: "bg-blue-500",
  WEB_DEVELOPMENT: "bg-green-500",
  BACKEND: "bg-purple-500",
  DEVOPS: "bg-orange-500",
  AI_ML: "bg-pink-500",
  DESIGN: "bg-yellow-500",
  OTHER: "bg-gray-500",
};

const SCROLL_THRESHOLD = 100;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString: string | Date, locale: string) => {
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

const formatRelativeTime = (dateString: string | Date, locale: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return locale === "ar" ? "الآن" : "just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return locale === "ar" ? `منذ ${mins} دقيقة` : `${mins} min ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return locale === "ar" ? `منذ ${hours} ساعة` : `${hours} hours ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return locale === "ar" ? `منذ ${days} يوم` : `${days} days ago`;
};

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.OTHER;
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(scrollPercentage, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
};

const useScrollToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { showButton, scrollToTop };
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
    <div
      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const ScrollToTopButton = ({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) => {
  if (!show) return null;

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg z-40"
      size="icon"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
};

const BlogHeader = ({
  blog,
  localizedContent,
  formatDate,
  currentLanguage,
  isLiked,
  handleLike,
  handleBookmark,
  isBookmarked,
}: any) => (
  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
    <div className="wrapper">
      <Link
        href="/blog"
        className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {currentLanguage === "ar" ? "العودة للمدونة" : "Back to Blog"}
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
        {localizedContent.title}
      </h1>

      {localizedContent.excerpt && (
        <p className="text-lg text-white/90 mb-6">{localizedContent.excerpt}</p>
      )}

      <div className="flex flex-wrap items-center gap-6 text-white/90">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage
              src={blog.author?.avatar || "/placeholder.svg"}
              alt={blog.author?.name || "Author"}
            />
            <AvatarFallback>
              {blog.author?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{blog.author?.name || "Unknown"}</p>
            {blog.author?.email && (
              <p className="text-sm text-white/70">{blog.author.email}</p>
            )}
          </div>
        </div>

        <Separator orientation="vertical" className="h-8 bg-white/20" />

        {/* Publish Date */}
        {blog.publishDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(blog.publishDate)}
          </div>
        )}

        {/* Read Time */}
        {blog.readTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {blog.readTime} {currentLanguage === "ar" ? "دقيقة" : "min read"}
          </div>
        )}

        {/* Views */}
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {blog.views || 0}
        </div>

        {/* Likes */}
        <button
          onClick={handleLike}
          disabled={blog.userLiked || isLiked}
          className="flex items-center gap-1 hover:text-red-300 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={currentLanguage === "ar" ? "إعجاب" : "Like"}
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              blog.userLiked || isLiked
                ? "fill-red-500 text-red-500"
                : "hover:scale-110"
            }`}
          />
          {blog.likes || 0}
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          aria-label={currentLanguage === "ar" ? "حفظ" : "Bookmark"}
        >
          <Bookmark
            className={`h-4 w-4 transition-all ${
              isBookmarked
                ? "fill-yellow-500 text-yellow-500"
                : "hover:scale-110"
            }`}
          />
        </button>
      </div>
    </div>
  </div>
);

const BlogStatisticsCard = ({ blog, currentLanguage }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        {currentLanguage === "ar" ? "إحصائيات" : "Statistics"}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Eye className="h-4 w-4" />
          {currentLanguage === "ar" ? "المشاهدات" : "Views"}
        </span>
        <Badge variant="secondary">{blog.views || 0}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Heart className="h-4 w-4" />
          {currentLanguage === "ar" ? "الإعجابات" : "Likes"}
        </span>
        <Badge variant="secondary">{blog.likes || 0}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {currentLanguage === "ar" ? "التعليقات" : "Comments"}
        </span>
        <Badge variant="secondary">{blog.comments?.length || 0}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          {currentLanguage === "ar" ? "المشاركات" : "Shares"}
        </span>
        <Badge variant="secondary">{blog.shares || 0}</Badge>
      </div>
    </CardContent>
  </Card>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlogDetails({ blogId }: BlogDetailsProps) {
  const { t, currentLanguage } = useTranslation();
  const { getBlogById, addLikeBlog, isLoading, getLocalizedContent } =
    blogStore();

  // State Management
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({
    percentage: 0,
    timeSpent: 0,
    scrollDepth: 0,
  });

  // Custom Hooks
  const scrollProgress = useScrollProgress();
  const { showButton, scrollToTop } = useScrollToTop();

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

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

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

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

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("blogBookmarks") || "[]");

    if (isBookmarked) {
      const updated = bookmarks.filter((id: number) => id !== blogId);
      localStorage.setItem("blogBookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      toast({
        title: t("Success", "common.success"),
        description: t("Bookmark removed", "blog.bookmarkRemoved"),
      });
    } else {
      bookmarks.push(blogId);
      localStorage.setItem("blogBookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast({
        title: t("Success", "common.success"),
        description: t("Blog bookmarked!", "blog.bookmarkAdded"),
      });
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const localizedContent = useMemo(() => {
    return blog ? getLocalizedContent(blog, currentLanguage) : null;
  }, [blog, currentLanguage, getLocalizedContent]);

  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================

  if (isLoading) {
    return <Loader />;
  }

  if (!blog || !localizedContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {currentLanguage === "ar"
              ? "المقال غير موجود"
              : "Blog post not found"}
          </h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للمدونة" : "Back to Blog"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <ProgressBar progress={scrollProgress} />

      {/* Scroll to Top Button */}
      <ScrollToTopButton show={showButton} onClick={scrollToTop} />

      {/* Header Section */}
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

      {/* Featured Image */}
      {blog.imageUrl && (
        <div className="relative h-96 overflow-hidden">
          <Image
            src={blog.imageUrl}
            alt={localizedContent.title}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="wrapper py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-3">
            {/* Tags and Category */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.category && (
                <Badge
                  variant="outline"
                  className={`text-sm ${getCategoryColor(
                    blog.category
                  )} text-white border-none`}
                >
                  {blog.category.replace(/_/g, " ")}
                </Badge>
              )}
              {blog.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Article Body */}
            <article
              className={`prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground ${
                currentLanguage === "ar" ? "text-right" : ""
              }`}
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
            >
              {localizedContent.content && (
                <div className="prose prose-lg max-w-none">
                  <MarkdownContent content={localizedContent.content} />
                </div>
              )}

              {localizedContent.metaDesc && (
                <>
                  <Separator className="my-12" />
                  <div className="prose prose-lg max-w-none py-4 md:py-6">
                    <MarkdownContent content={localizedContent.metaDesc} />
                  </div>
                </>
              )}
            </article>

            {/* Preview Images Gallery */}
            {blog.previewImages && blog.previewImages.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">
                  {currentLanguage === "ar" ? "معرض الصور" : "Image Gallery"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blog.previewImages.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden border hover:border-primary transition-colors"
                    >
                      <Image
                        src={image}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share */}
            <div className="mt-12 pt-8 border-t">
              <SocialShare
                url={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/blog/${blog.slug}`
                    : ""
                }
                title={localizedContent.title}
              />
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <CommentSection
                blogId={Number(blog.id)}
                comments={blog.comments || []}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Card */}
              {blog.author && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {currentLanguage === "ar"
                        ? "عن الكاتب"
                        : "About the Author"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={blog.author.avatar || "/placeholder.svg"}
                          alt={blog.author.name}
                        />
                        <AvatarFallback>
                          {blog.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{blog.author.name}</h4>
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

              {/* Keywords Card */}
              {blog.keywords && blog.keywords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
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
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Blog Statistics Card */}
              <BlogStatisticsCard
                blog={blog}
                currentLanguage={currentLanguage}
              />
            </div>
          </aside>
        </div>

        {/* Related Posts Section */}
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
