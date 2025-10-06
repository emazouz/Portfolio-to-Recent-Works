"use client";
import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Download,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { TemplateFilters, templateStore } from "@/store/templateStore";
import { toast } from "@/hooks/use-toast";
import { TemplateFiltersComponent } from "./admin/templates/TemplateFiltersComponent";
import { difficultyLabels } from "@/constants/templateConstants";


export function TemplateStore() {
  const { currentLanguage } = useTranslation();
  const { getTemplates, templates } = templateStore();

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
    if(!template) return;
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

  const getLocalizedContent = (item: any, field: string) => {
    const langSuffix = currentLanguage === "ar" ? "_ar" : "_en";
    return item[`${field}${langSuffix}`] || item[`${field}_en`] || item[field];
  };
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentLanguage === "ar" ? "القوالب المميزة" : "Premium Templates"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentLanguage === "ar"
              ? "قوالب جاهزة للإنتاج لتسريع عملية التطوير. جميع القوالب تتضمن الكود المصدري والوثائق والتحديثات مدى الحياة."
              : "Production-ready templates to accelerate your development process. All templates include source code, documentation, and lifetime updates."}
          </p>
        </div>

        {/* Filters */}
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

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={template.imageUrl || "/placeholder.svg"}
                  alt={getLocalizedContent(template, "title")}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay with preview button */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link href={`/templates/view/${template.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 text-black hover:bg-white"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {currentLanguage === "ar" ? "معاينة" : "Preview"}
                    </Button>
                  </Link>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {template.featured && (
                    <Badge className="bg-yellow-500 text-yellow-900">
                      {currentLanguage === "ar" ? "مميز" : "Featured"}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-background/90">
                    {
                      difficultyLabels[
                        template.difficulty as keyof typeof difficultyLabels
                      ][currentLanguage === "ar" ? "ar" : "en"]
                    }
                  </Badge>
                </div>

                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                  <div className="flex items-center gap-1">
                    <span className="text-xs line-through text-muted-foreground">
                      ${template.originalPrice}
                    </span>
                    <span>${template.price}</span>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors line-clamp-1">
                      {getLocalizedContent(template, "title")}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {getLocalizedContent(template, "description")}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {template.rating} ({template.ratingsCount})
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {template.downloads}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                    {currentLanguage === "ar"
                      ? `اشتري الآن - $${template.price}`
                      : `Buy Now - $${template.price}`}
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/templates/view/${template.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  {currentLanguage === "ar" ? "آخر تحديث: " : "Updated: "}
                  {new Date(template.updatedAt).toLocaleDateString(
                    currentLanguage === "ar" ? "ar-SA" : "en-US"
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

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
        </div>

        {/* No results */}
        {paginatedTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">
              {currentLanguage === "ar"
                ? "لم يتم العثور على قوالب"
                : "No templates found"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {currentLanguage === "ar"
                ? "حاول تعديل معايير البحث أو تصفح جميع الفئات"
                : "Try adjusting your search criteria or browse all categories"}
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setSortBy("createdAt");
              }}
            >
              {currentLanguage === "ar" ? "مسح المرشحات" : "Clear Filters"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
