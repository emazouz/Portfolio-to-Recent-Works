"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
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
import { Search, Grid3x3, List, Sparkles } from "lucide-react";
import { Blog, blogStore } from "@/store/blogStore";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import BlogCard from "./blog-card";
import { SortOption, ViewMode } from "@/types/blog.types";
import {
  CATEGORIES,
  ITEMS_PER_PAGE,
  MAX_PAGINATION_BUTTONS,
  SORT_OPTIONS,
} from "@/constants/blog.constants";

// Main Component
export default function BlogList() {
  const { t } = useTranslation();

  // State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const { getBlogs, isLoading, error } = blogStore();

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      const result = await getBlogs();
      if (result.success && result.data) {
        setBlogs(result.data.blogs || []);
      } else {
        toast({
          title: t("Error", "common.error"),
          description:
            result.message || t("Failed to fetch blogs", "blog.fetchError"),
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast({
        title: t("Error", "common.error"),
        description: t(
          "An unexpected error occurred",
          "common.unexpectedError"
        ),
        variant: "error",
      });
    }
  }, [getBlogs, t]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Filter and sort blogs
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogs.filter((post) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        post.title_en.toLowerCase().includes(searchLower) ||
        (post.excerpt_en ?? "").toLowerCase().includes(searchLower) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = category === "All" || post.category === category;

      // Only show published posts
      return matchesSearch && matchesCategory && post.published;
    });

    // Sort
    const sortFunctions: Record<SortOption, (a: Blog, b: Blog) => number> = {
      newest: (a, b) =>
        new Date(String(b.publishDate)).getTime() -
        new Date(String(a.publishDate)).getTime(),
      oldest: (a, b) =>
        new Date(String(a.publishDate)).getTime() -
        new Date(String(b.publishDate)).getTime(),
      mostViewed: (a, b) => b.views - a.views,
      mostLiked: (a, b) => b.likes - a.likes,
      trending: (a, b) => {
        // Trending algorithm: combination of recent engagement
        const aScore = b.views * 0.3 + b.likes * 0.7;
        const bScore = a.views * 0.3 + a.likes * 0.7;
        return bScore - aScore;
      },
    };

    filtered.sort(sortFunctions[sortBy]);

    return filtered;
  }, [blogs, search, category, sortBy]);

  // Split featured and regular posts
  const featuredPosts = useMemo(
    () => filteredAndSortedPosts.filter((post) => post.featured),
    [filteredAndSortedPosts]
  );

  const regularPosts = useMemo(
    () => filteredAndSortedPosts.filter((post) => !post.featured),
    [filteredAndSortedPosts]
  );

  // Pagination
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return regularPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [regularPosts, currentPage]);

  const totalPages = Math.ceil(regularPosts.length / ITEMS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sortBy]);

  // Pagination helpers
  const handlePreviousPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const getPaginationRange = () => {
    const range: number[] = [];
    const maxButtons = Math.min(totalPages, MAX_PAGINATION_BUTTONS);

    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            {t(
              "Unable to load blogs. Please try again later.",
              "blog.loadError"
            )}
          </p>
          <Button onClick={fetchBlogs}>{t("Retry", "common.retry")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 px-5 py-2.5">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            {blogs.length} {blogs.length === 1 ? "ARTICLE" : "ARTICLES"}
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Technical Blog
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Insights, tutorials, and thoughts on web development, design
            patterns, and the latest industry trends
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-12 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("Search articles...", "blog.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                aria-label="Search articles"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Select */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48" aria-label="Select category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Select */}
              <Select
                value={sortBy}
                onValueChange={(v) => setSortBy(v as SortOption)}
              >
                <SelectTrigger className="w-48" aria-label="Sort by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div
                className="flex items-center gap-1 border rounded-md p-1"
                role="group"
                aria-label="View mode"
              >
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, i) => (
                <BlogCard key={post.id} article={post} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 ? (
          <section>
            <h2 className="text-3xl font-black mb-8">
              All Articles
              <span className="text-muted-foreground text-lg ml-2">
                ({regularPosts.length})
              </span>
            </h2>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "space-y-6"
              }
            >
              {paginatedPosts.map((post, i) => (
                <BlogCard key={post.id} article={post} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-center gap-2 mt-12"
                aria-label="Pagination"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPaginationRange().map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </nav>
            )}
          </section>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {search || category !== "All"
                ? t(
                    "No articles found matching your criteria.",
                    "blog.noResults"
                  )
                : t("No articles available yet.", "blog.noArticles")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
