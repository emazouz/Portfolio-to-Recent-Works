"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Heart,
  MessageCircle,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Blog } from "@/store/blogStore";
import { useBlogsData } from "@/hooks/blogs/useBlogsData";
import { BLOG_CATEGORIES } from "@/constants/BlogConstants";

// Custom Hooks
function useBlogFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  }, []);

  return {
    filters: { searchTerm, categoryFilter, statusFilter },
    setters: { setSearchTerm, setCategoryFilter, setStatusFilter },
    resetFilters,
  };
}

function BlogCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function BlogCard({
  blog,
  onDelete,
}: {
  blog: Blog;
  onDelete: (id: number, title: string) => void;
}) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {BLOG_CATEGORIES.find((cat) => cat.value === blog.category)
                  ?.label || blog.category}
              </Badge>
              {blog.featured && (
                <Badge variant="default" className="text-xs">
                  {t("Featured", "admin.blogs.featured")}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title_en}
            </h3>
            {blog.title_ar && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {blog.title_ar}
              </p>
            )}
          </div>
          <CustomDropdown
            align="end"
            trigger={
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">
                  {t("Open menu for", "admin.blogs.openMenu")} {blog.title_en}
                </span>
              </Button>
            }
          >
            <DropdownItem asChild>
              <Link href={`/admin/blogs/view/${blog.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                {t("View", "admin.blogs.view")}
              </Link>
            </DropdownItem>
            <DropdownItem asChild>
              <Link href={`/admin/blogs/edit/${blog.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                {t("Edit", "admin.blogs.edit")}
              </Link>
            </DropdownItem>
            <DropdownItem
              variant="destructive"
              onClick={() => onDelete(Number(blog.id), blog.title_en)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("Delete", "admin.blogs.delete")}
            </DropdownItem>
          </CustomDropdown>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="h-3 w-3" />
              <span>
                {blog.author?.name ||
                  t("Unknown Author", "admin.blogs.unknownAuthor")}
              </span>
            </div>
            <Badge
              variant={blog.published ? "default" : "secondary"}
              className="text-xs"
            >
              {blog.published
                ? t("Published", "admin.blogs.published")
                : t("Draft", "admin.blogs.draft")}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{blog.views?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{blog.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{blog.comments?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>
              {t("Created", "admin.blogs.created")}:{" "}
              {formatDate(String(blog.createdAt))}
            </span>
            {blog.publishDate && (
              <span className="ml-2">
                • {t("Published", "admin.blogs.published")}:{" "}
                {formatDate(String(blog.publishDate))}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  hasFilters,
  onResetFilters,
}: {
  hasFilters: boolean;
  onResetFilters: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {hasFilters
          ? t("No blogs match your filters", "admin.blogs.noMatch")
          : t("No blog posts yet", "admin.blogs.empty")}
      </h3>
      <p className="text-muted-foreground mb-4">
        {hasFilters
          ? t("Try adjusting your search criteria", "admin.blogs.adjustFilters")
          : t(
              "Create your first blog post to get started",
              "admin.blogs.createFirst"
            )}
      </p>
      {hasFilters ? (
        <Button variant="outline" onClick={onResetFilters}>
          {t("Clear Filters", "admin.blogs.clearFilters")}
        </Button>
      ) : (
        <Button asChild>
          <Link href="/admin/blogs/add">
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Blog Post", "admin.blogs.add")}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function BlogsTable() {
  const { t } = useTranslation();
  const { filters, setters, resetFilters } = useBlogFilters();
  const { blogs, pagination, isLoading, error, fetchBlogs, handleDeleteBlog } =
    useBlogsData();

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title_en
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        (blog.title_ar && blog.title_ar.includes(filters.searchTerm));

      const matchesCategory =
        filters.categoryFilter === "all" ||
        blog.category === filters.categoryFilter;

      const matchesStatus =
        filters.statusFilter === "all" ||
        (filters.statusFilter === "published" && blog.published) ||
        (filters.statusFilter === "draft" && !blog.published);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, filters]);

  const hasActiveFilters =
    filters.searchTerm ||
    filters.categoryFilter !== "all" ||
    filters.statusFilter !== "all";

  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Blog Posts", "admin.blogs.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("Manage your blog content", "admin.blogs.subtitle")}
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchBlogs}>
              {t("Retry", "common.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Blog Posts", "admin.blogs.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage your blog content", "admin.blogs.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/add">
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Blog Post", "admin.blogs.add")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {t("All Blog Posts", "admin.blogs.all")}
            {pagination && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({pagination.totalCount} {t("total", "common.total")})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {t("View and manage all blog posts", "admin.blogs.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search blog posts...", "admin.blogs.search")}
                value={filters.searchTerm}
                onChange={(e) => setters.setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.categoryFilter}
              onValueChange={setters.setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("Category", "admin.blogs.category")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Categories", "admin.blogs.allCategories")}
                </SelectItem>
                {BLOG_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.statusFilter}
              onValueChange={setters.setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Status", "admin.blogs.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Status", "admin.blogs.allStatus")}
                </SelectItem>
                <SelectItem value="published">
                  {t("Published", "admin.blogs.published")}
                </SelectItem>
                <SelectItem value="draft">
                  {t("Draft", "admin.blogs.draft")}
                </SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                {t("Clear Filters", "admin.blogs.clearFilters")}
              </Button>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  onDelete={handleDeleteBlog}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              hasFilters={hasActiveFilters as boolean}
              onResetFilters={resetFilters}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
