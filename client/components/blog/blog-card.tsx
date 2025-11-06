import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight, Calendar, Clock, Eye, Heart, User } from "lucide-react";
import { formatCategory } from "@/handlers/index.handlers";
import { formatDate } from "@/handlers/date.handlers";
import { BlogCardProps } from "@/types/blog.types";
import { categoryColorMap } from "@/constants/blog.constants";

function BlogCard({
  article,
  index,
  language = "en",
  onReadMore,
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Get localized content
  const title = language === "en" ? article.title_en : article.title_ar;
  const content = language === "en" ? article.content_en : article.content_ar;

  // Get category color with fallback
  const categoryBgClass = categoryColorMap[article.category] || "bg-primary/90";

  // Limit tags displayed
  const maxTags = 3;
  const displayedTags = article.tags.slice(0, maxTags);
  const remainingTags = article.tags.length - maxTags;

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReadMore) {
      onReadMore(article.id);
    }
  };

  return (
    <Card
      className="group card overflow-hidden cursor-pointer pt-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-60">
        <img
          src={article.imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${categoryBgClass} text-white border-0 shadow-lg`}>
            {formatCategory(article.category)}
          </Badge>
        </div>

        {/* Read Time Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-card/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <Clock className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground">
            {article.readTime} min
          </span>
        </div>

        {/* Stats on Hover */}
        {isHovered && (
          <div className="absolute bottom-4 left-4 right-4 flex gap-4 text-white animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span
                className="text-sm font-medium"
                aria-label={`${article.views} views`}
              >
                {article.views}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Heart
                className={`w-4 h-4 ${
                  article.userLiked ? "fill-destructive text-destructive" : ""
                }`}
                aria-hidden="true"
              />
              <span
                className="text-sm font-medium"
                aria-label={`${article.likes} likes`}
              >
                {article.likes}
              </span>
            </div>
          </div>
        )}
      </div>

      <CardContent className="px-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
          {content}
        </p>

        {/* Author & Date */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-3 h-3 text-primary" aria-hidden="true" />
            </div>
            <span className="font-medium">{article.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <time dateTime={String(article.publishDate)}>
              {formatDate(String(article.publishDate))}
            </time>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {displayedTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {remainingTags > 0 && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              +{remainingTags}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-between group/btn"
            onClick={handleReadMoreClick}
          >
            Read More
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BlogCard;
