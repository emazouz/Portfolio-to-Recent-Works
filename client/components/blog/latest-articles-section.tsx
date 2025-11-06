"use client";

import { useCallback, useEffect, useState } from "react";
import { Rss } from "lucide-react";
import HeaderSection from "../header-section";
import BlogCard from "./blog-card";
import { blogStore } from "@/store/blogStore";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/hooks/use-toast";
import { Blog } from "@/types/blog.types";
import { blogs } from "@/lib/data";

export function LatestArticlesSection() {
  const { t } = useTranslation();
  const [likedBlogs, setLikedBlogs] = useState<Set<number>>(new Set());
  // const [blogs, setBlogs] = useState<Blog[]>([]);
  // const { getBlogs, error } = blogStore();

  // const fetchBlogs = useCallback(async () => {
  //   try {
  //     const result = await getBlogs();
  //     if (result.success && result.data) {
  //       setBlogs(result.data.blogs || []);
  //     } else {
  //       toast({
  //         title: t("Error", "common.error"),
  //         description:
  //           result.message || t("Failed to fetch blogs", "blog.fetchError"),
  //         variant: "error",
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error fetching blogs:", err);
  //     toast({
  //       title: t("Error", "common.error"),
  //       description: t(
  //         "An unexpected error occurred",
  //         "common.unexpectedError"
  //       ),
  //       variant: "error",
  //     });
  //   }
  // }, [getBlogs, t]);

  // useEffect(() => {
  //   fetchBlogs();
  // }, [fetchBlogs]);

  // // Error state
  // if (error) {
  //   return (
  //     <section>
  //       <div className="wrapper">
  //         <HeaderSection
  //           icon={<Rss className="animate-pulse" />}
  //           badgeTitle="Blogs"
  //           title="Latest Articles"
  //           description="Stay updated with my latest thoughts, tutorials, and tips on web development and design."
  //         />
  //         <div className="text-center py-12">
  //           <p className="text-muted-foreground mb-4">
  //             {t(
  //               "Unable to load articles. Please try again later.",
  //               "blog.loadError"
  //             )}
  //           </p>
  //           <button
  //             onClick={fetchBlogs}
  //             className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
  //           >
  //             {t("Retry", "common.retry")}
  //           </button>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // Empty state
  if (blogs.length === 0) {
    return (
      <section>
        <div className="wrapper">
          <HeaderSection
            icon={<Rss className="animate-pulse" />}
            badgeTitle="Blogs"
            title="Latest Articles"
            description="Stay updated with my latest thoughts, tutorials, and tips on web development and design."
          />
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("No articles available yet.", "blog.noArticles")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="wrapper">
        <HeaderSection
          icon={<Rss className="animate-pulse" />}
          badgeTitle="Blogs"
          title="Latest Articles"
          description="Stay updated with my latest thoughts, tutorials, and tips on web development and design."
          ctaText={`View All ${blogs.length}+ Articles`}
          ctaHref="/blog"
        />

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 6).map((article, index) => (
            <BlogCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
