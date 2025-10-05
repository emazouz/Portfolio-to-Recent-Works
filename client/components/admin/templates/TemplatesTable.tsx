"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Star,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { templateStore, type TemplateFilters } from "@/store/templateStore";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/Loader";
import { TemplateFiltersComponent } from "./TemplateFiltersComponent";

export function TemplatesTable() {
  const { t } = useTranslation();
  const { isLoading, getTemplates, templates } = templateStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(
    undefined
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<TemplateFilters["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] =
    useState<TemplateFilters["sortOrder"]>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [showFilters, setShowFilters] = useState(false);

  const buildFilters = useCallback((): TemplateFilters => {
    const filters: TemplateFilters = {
      page: currentPage,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
    };

    if (searchTerm) filters.search = searchTerm;
    if (categoryFilter !== "all") filters.category = categoryFilter as any;
    if (difficultyFilter !== "all")
      filters.difficulty = difficultyFilter as any;
    if (featuredFilter !== undefined) filters.featured = featuredFilter;
    if (minPrice) filters.minPrice = Number.parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = Number.parseFloat(maxPrice);

    return filters;
  }, [
    searchTerm,
    categoryFilter,
    difficultyFilter,
    featuredFilter,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
  ]);

  const filter = buildFilters();

  const fetchAllTemplates = useCallback(async () => {
    try {
      const result = await getTemplates(filter);
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        return;
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error);
      toast({
        title: "Error",
        description: `Failed to fetch templates: ${error}`,
        variant: "error",
      });
    }
  }, [getTemplates]);

  useEffect(() => {
    fetchAllTemplates();
  }, [fetchAllTemplates]);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title_ar.includes(searchTerm);
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || template.difficulty === difficultyFilter;
    const matchesFeatured =
      featuredFilter === undefined || template.featured === featuredFilter;

    const templatePrice = template.price;
    const matchesMinPrice =
      !minPrice || templatePrice >= Number.parseFloat(minPrice);
    const matchesMaxPrice =
      !maxPrice || templatePrice <= Number.parseFloat(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDifficulty &&
      matchesFeatured &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "price":
        comparison = a.price - b.price;
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
      case "downloads":
        comparison = a.downloads - b.downloads;
        break;
      case "views":
        comparison = a.views - b.views;
        break;
      case "createdAt":
      default:
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedTemplates.length / itemsPerPage);
  const paginatedTemplates = sortedTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    categoryFilter,
    difficultyFilter,
    featuredFilter,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setDifficultyFilter("all");
    setFeaturedFilter(undefined);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== "all" ||
    difficultyFilter !== "all" ||
    featuredFilter !== undefined ||
    minPrice ||
    maxPrice;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("Templates", "admin.templates.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("Manage your template collection", "admin.templates.subtitle")}
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/templates/add">
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Template", "admin.templates.add")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                {t("All Templates", "admin.templates.all")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t(
                  "View and manage all templates in your collection",
                  "admin.templates.description"
                )}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 mb-4 sm:mb-6">
            {/* Filters Component */}
            <TemplateFiltersComponent
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              difficultyFilter={difficultyFilter}
              featuredFilter={featuredFilter}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortBy={sortBy}
              sortOrder={sortOrder}
              itemsPerPage={itemsPerPage}
              showFilters={showFilters}
              hasActiveFilters={hasActiveFilters as boolean}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategoryFilter}
              onDifficultyChange={setDifficultyFilter}
              onFeaturedChange={setFeaturedFilter}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onSortByChange={setSortBy}
              onSortOrderChange={setSortOrder}
              onItemsPerPageChange={setItemsPerPage}
              onClearFilters={clearFilters}
            />

            {/* Results Counter - Responsive */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 text-xs sm:text-sm text-muted-foreground">
              <span>
                Showing {paginatedTemplates.length} of {sortedTemplates.length}{" "}
                templates
              </span>
              <span>
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedTemplates.map((template) => (
              <Card
                key={template.id}
                className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={template.imageUrl || "/placeholder.svg"}
                    alt={template.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2">
                    {template.featured && (
                      <Badge
                        variant="default"
                        className="text-[10px] sm:text-xs shadow-sm"
                      >
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={template.isActive ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs shadow-sm"
                    >
                      {template.isActive
                        ? t("Active", "admin.templates.active")
                        : t("Inactive", "admin.templates.inactive")}
                    </Badge>
                  </div>
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                    <CustomDropdown
                      align="end"
                      trigger={
                        <Button
                          variant="ghost"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      }
                    >
                      <DropdownItem asChild>
                        <Link href={`/admin/templates/view/${template.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("View", "admin.templates.view")}
                        </Link>
                      </DropdownItem>
                      <DropdownItem asChild>
                        <Link href={`/admin/templates/edit/${template.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("Edit", "admin.templates.edit")}
                        </Link>
                      </DropdownItem>
                      <DropdownItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("Delete", "admin.templates.delete")}
                      </DropdownItem>
                    </CustomDropdown>
                  </div>
                </div>
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs"
                      >
                        {template.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {template.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {template.title_en}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                      {template.title_ar}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                        <span className="font-semibold text-base sm:text-lg">
                          ${template.price}
                        </span>
                        {template?.originalPrice > template?.price && (
                          <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            ${template.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm sm:text-base">
                          {template.rating}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          ({template.ratingsCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span className="truncate">
                          {template.downloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span className="truncate">
                          {template.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination - Responsive */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </Button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-2 sm:pb-0">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  if (totalPages <= 7) return i + 1;
                  if (i < 2) return i + 1;
                  if (i >= totalPages - 2) return totalPages - (6 - i);
                  return currentPage + (i - 3);
                }).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 sm:w-10 sm:h-9 p-0 text-xs sm:text-sm flex-shrink-0"
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
                className="w-full sm:w-auto"
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
