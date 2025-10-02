"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface RelatedPostsProps {
  currentBlogId: number;
  category: string;
  blogs: any[];
}

export function RelatedPosts({
  currentBlogId,
  category,
  blogs,
}: RelatedPostsProps) {
  const { currentLanguage } = useTranslation();

  const relatedPosts = blogs
    .filter((blog) => blog.id !== currentBlogId && blog.category === category)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">
        {currentLanguage === "ar" ? "مقالات مشابهة" : "Related Posts"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link key={post.id} href={`/blog/ViewBlog/${post.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src={post.imageUrl || "/placeholder.svg"}
                  alt={currentLanguage === "ar" ? post.title_ar : post.title_en}
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
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.publishDate.toLocaleDateString(
                      currentLanguage === "ar" ? "ar-SA" : "en-US"
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime} {currentLanguage === "ar" ? "دقيقة" : "min"}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-2">
                  {currentLanguage === "ar" ? post.title_ar : post.title_en}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {currentLanguage === "ar" ? post.excerpt_ar : post.excerpt_en}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
