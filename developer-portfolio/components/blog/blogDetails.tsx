"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, Heart, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { CommentSection } from "@/components/blog/comment-section";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { SocialShare } from "@/components/blog/SocialShare";
import { blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import { useBlogsData } from "@/hooks/blogs/useBlogsData";
import Loader from "@/components/ui/Loader";

interface BlogDetailsProps {
  blogId: number;
}

export default function BlogDetails({ blogId }: BlogDetailsProps) {
  const { addLikeBlog } = blogStore();
  const { t, currentLanguage } = useTranslation();
  const { getBlog, blog, isLoading } = useBlogsData();
  const [isLiked, setIsLiked] = useState(false);

  const fetchBlog = useCallback(async () => {
    if (!blogId) {
      return;
    }
    try {
      const result = await getBlog(blogId);

      if (!result) return;
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
  }, [blogId, getBlog, t]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const handleLike = async () => {
    if (blog?.userLiked) return;

    try {
      const result = await addLikeBlog(blogId);

      if (!result.success) {
        toast({
          title: t("Error", "common.error"),
          description: result.message,
          variant: "error",
        });
        return;
      }

      // Update liked blogs in localStorage
      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
      if (!isLiked) {
        likedBlogs.push(blogId);
        localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));
      }

      setIsLiked(!isLiked);

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

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        currentLanguage === "ar" ? "ar-SA" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      );
    } catch {
      return dateString.toString();
    }
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Not found state
  if (!blog) {
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

  const title = currentLanguage === "ar" ? blog.title_ar : blog.title_en;
  const content = currentLanguage === "ar" ? blog.content_ar : blog.content_en;
  const excerpt = currentLanguage === "ar" ? blog.excerpt_ar : blog.excerpt_en;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentLanguage === "ar" ? "العودة للمدونة" : "Back to Blog"}
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>

            {excerpt && <p className="text-lg text-white/90 mb-6">{excerpt}</p>}

            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={blog.author?.avatar || "/placeholder.svg"}
                    alt={blog.author?.name || "Author"}
                  />
                  <AvatarFallback>
                    {blog.author?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {blog.author?.name || "Unknown"}
                  </p>
                  {blog.author?.email && (
                    <p className="text-sm text-white/70">{blog.author.email}</p>
                  )}
                </div>
              </div>

              <Separator orientation="vertical" className="h-8 bg-white/20" />

              {blog.publishDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(blog.publishDate)}
                </div>
              )}

              {blog.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blog.readTime}{" "}
                  {currentLanguage === "ar" ? "دقيقة" : "min read"}
                </div>
              )}

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.views || 0}
              </div>

              <button
                onClick={handleLike}
                disabled={blog?.userLiked}
                className="flex items-center gap-1 hover:text-red-300 transition-colors disabled:cursor-not-allowed"
              >
                <Heart
                  className={`h-4 w-4 ${
                    blog?.userLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {blog.likes || 0}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {blog.imageUrl && (
        <div className="relative h-96 overflow-hidden">
          <Image
            src={blog.imageUrl}
            alt={title}
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.category && (
                  <Badge variant="outline" className="text-sm">
                    {blog.category}
                  </Badge>
                )}
                {blog.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Article Content */}
              <div
                className={`prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground ${
                  currentLanguage === "ar" ? "text-right" : ""
                }`}
                dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              >
                {/* Render content as HTML or plain text based on your needs */}
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  className="whitespace-pre-wrap"
                />
              </div>

              {/* Social Share */}
              <div className="mt-12 pt-8 border-t">
                <SocialShare
                  url={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/blog/${blog.slug}`
                      : ""
                  }
                  title={title}
                />
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <CommentSection
                  blogId={Number(blog.id)}
                  comments={blog?.comments || []}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Author Info */}
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

                {/* Popular Tags */}
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
                            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Blog Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {currentLanguage === "ar" ? "إحصائيات" : "Statistics"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {currentLanguage === "ar" ? "المشاهدات" : "Views"}
                      </span>
                      <Badge variant="secondary">{blog.views || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {currentLanguage === "ar" ? "الإعجابات" : "Likes"}
                      </span>
                      <Badge variant="secondary">{blog.likes || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {currentLanguage === "ar" ? "التعليقات" : "Comments"}
                      </span>
                      <Badge variant="secondary">
                        {blog.comments?.length || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {/* {relatedBlogs && relatedBlogs.length > 0 && (
            <div className="mt-16">
              <RelatedPosts
                currentBlogId={Number(blog.id)}
                category={blog.category}
                blogs={relatedBlogs}
              />
            </div>
       )} */}
        </div>
      </div>
    </div>
  );
}
