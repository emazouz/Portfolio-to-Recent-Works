import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BlogHeaderProps } from "@/types/blog.types";
import { ArrowLeft, Bookmark, Clock, Eye, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

function BlogHeader({
  blog,
  localizedContent,
  formatDate,
  currentLanguage,
  isLiked,
  handleLike,
  handleBookmark,
  isBookmarked,
}: BlogHeaderProps) {
  return (
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
                isBookmarked
                  ? "fill-secondary text-secondary"
                  : "hover:scale-110"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogHeader;
