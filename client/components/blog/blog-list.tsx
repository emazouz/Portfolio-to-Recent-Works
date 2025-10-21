"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  ArrowRight,
  Eye,
  Heart,
  MessageSquare,
  Grid3x3,
  List,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Blog, blogStore } from "@/store/blogStore";

// Types
type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "mostViewed" | "mostLiked" | "trending";

const CATEGORIES = [
  { value: "All", label: "All Categories", icon: "📚" },
  { value: "WEB_DEVELOPMENT", label: "Web Development", icon: "🌐" },
  { value: "MOBILE_DEVELOPMENT", label: "Mobile Development", icon: "📱" },
  { value: "BACKEND", label: "Backend", icon: "⚙️" },
  { value: "AI_ML", label: "AI/ML", icon: "🤖" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "mostViewed", label: "Most Viewed" },
  { value: "mostLiked", label: "Most Liked" },
  { value: "trending", label: "Trending" },
];

const CATEGORY_ICONS: Record<string, string> = {
  MOBILE_DEVELOPMENT: "📱",
  WEB_DEVELOPMENT: "🌐",
  BACKEND: "⚙️",
  AI_ML: "🤖",
};

// Skeleton Component
function BlogCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardHeader>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
    </Card>
  );
}

// Blog Stats Component
function BlogStats({ post }: { post: Blog }) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{post.views}</span>
      </div>
      <div className="flex items-center gap-1">
        <Heart className="h-4 w-4" />
        <span>{post.likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4" />
        <span>{post.comments?.length || 0}</span>
      </div>
    </div>
  );
}

// Blog Metadata Component
function BlogMetadata({ post }: { post: Blog }) {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        {new Date(String(post.publishDate)).toLocaleDateString()}
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        {post.readTime} min
      </div>
      {post.author?.name && (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {post.author.name}
        </div>
      )}
    </div>
  );
}

// Featured Blog Card
function FeaturedBlogCard({ post }: { post: Blog }) {
  return (
    <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title_en}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

        {/* Featured Badge */}
        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 animate-pulse shadow-lg">
          <Sparkles className="w-3 h-3 mr-1" />
          Featured
        </Badge>

        {/* Category Badge */}
        {post.category && (
          <Badge className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm">
            {CATEGORY_ICONS[post.category]} {post.category.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      <CardHeader>
        <BlogMetadata post={post} />
        <CardTitle className="text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/60 transition-all line-clamp-2">
          {post.title_en}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {post.excerpt_en}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="p-0 h-auto text-primary hover:text-primary/80 group/btn"
            asChild
          >
            <a href={`/blog/view/${post.id}`}>
              Read More
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </Button>
          <BlogStats post={post} />
        </div>
      </CardContent>
    </Card>
  );
}

// Regular Blog Card
function RegularBlogCard({
  post,
  viewMode,
}: {
  post: Blog;
  viewMode: ViewMode;
}) {
  const content = (
    <>
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title_en}
          className={`w-full ${
            viewMode === "list" ? "h-full md:h-auto" : "h-48"
          } object-cover group-hover:scale-110 transition-transform duration-700`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {post.category && (
          <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm">
            {CATEGORY_ICONS[post.category]} {post.category.replace(/_/g, " ")}
          </Badge>
        )}
      </div>

      <div className="flex-1">
        <CardHeader>
          <BlogMetadata post={post} />
          <CardTitle className="text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/60 transition-all line-clamp-2">
            {post.title_en}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {post.excerpt_en}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.slice(0, viewMode === "list" ? 4 : 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="p-0 h-auto text-primary hover:text-primary/80 group/btn"
              asChild
            >
              <a href={`/blog/view/${post.id}`}>
                Read More
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </Button>
            <BlogStats post={post} />
          </div>
        </CardContent>
      </div>
    </>
  );

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-72 h-48 md:h-auto overflow-hidden">
            {content}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      {content}
    </Card>
  );
}

// Main Component
export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const { getBlogs, isLoading } = blogStore();

  const fetchBlogs = useCallback(async () => {
    const result = await getBlogs();
    if (result.success && result.data) {
      setBlogs(result.data?.blogs || []);
    }
  }, [getBlogs]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const ITEMS_PER_PAGE = 9;

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = blogs.filter((post) => {
      const matchesSearch =
        post.title_en.toLowerCase().includes(search.toLowerCase()) ||
        (post.excerpt_en ?? "").toLowerCase().includes(search.toLowerCase()) ||
        post.tags?.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory = category === "All" || post.category === category;

      return matchesSearch && matchesCategory && post.published;
    });

    switch (sortBy) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(String(a.publishDate)).getTime() -
            new Date(String(b.publishDate)).getTime()
        );
        break;
      case "mostViewed":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "mostLiked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(String(b.publishDate)).getTime() -
            new Date(String(a.publishDate)).getTime()
        );
    }

    return filtered;
  }, [blogs, search, category, sortBy]);

  const featuredPosts = useMemo(
    () => filteredAndSortedPosts.filter((post) => post.featured),
    [filteredAndSortedPosts]
  );

  const regularPosts = useMemo(
    () => filteredAndSortedPosts.filter((post) => !post.featured),
    [filteredAndSortedPosts]
  );

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return regularPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [regularPosts, currentPage]);

  const totalPages = Math.ceil(regularPosts.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6 px-5 py-2.5">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            {blogs.length} ARTICLES
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(v: SortOption) => setSortBy(v)}
              >
                <SelectTrigger className="w-48">
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

              <div className="flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedBlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
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
              {paginatedPosts.map((post) => (
                <RegularBlogCard
                  key={post.id}
                  post={post}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
