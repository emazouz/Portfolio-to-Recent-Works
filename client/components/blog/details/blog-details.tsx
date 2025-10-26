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
  Eye,
  Heart,
  ArrowLeft,
  Share2,
  TrendingUp,
  MessageSquare,
  User,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { CommentSection } from "@/components/blog/comment-section";
import { RelatedPosts } from "@/components/blog/related-posts";
import { SocialShare } from "@/components/blog/details/social-share";
import { Blog, blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
import { MarkdownContent } from "../../markdown/markdown-content";
import { BlogStatisticsCardProps } from "@/types/blog.types";
import BlogHeader from "./blog-header";
import { getCategoryGradient } from "@/handlers/blog.handlers";
import { getChartGradientVar } from "@/handlers/index.handlers";
import { GetParamsProps } from "@/types/params.types";
import { formatDate } from "@/handlers/date.handlers";

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

export default function BlogDetails({ id }: GetParamsProps) {
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
    if (!id) return;

    try {
      const result = await getBlogById(id);

      if (result.success && result.data) {
        setBlog(result.data);
        setIsLiked(result.data.userLiked || false);

        // Check bookmark status from localStorage
        const bookmarks = JSON.parse(
          localStorage.getItem("blogBookmarks") || "[]"
        );
        setIsBookmarked(bookmarks.includes(id));
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
  }, [id, getBlogById, t]);

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
      const result = await addLikeBlog(id);

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
      const updated = bookmarks.filter((id: number) => id !== id);
      localStorage.setItem("blogBookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      toast({
        title: t("Success", "common.success"),
        description: t("Bookmark removed", "blog.bookmarkRemoved"),
      });
    } else {
      // Add bookmark
      bookmarks.push(id);
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
        formatDate={(date: string) => formatDate(date)}
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
