"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import type { TemplateFilters } from "@/store/templateStore";

interface TemplateFiltersComponentProps {
  searchTerm: string;
  categoryFilter: string;
  difficultyFilter: string;
  featuredFilter: boolean | undefined;
  minPrice: string;
  maxPrice: string;
  sortBy: TemplateFilters["sortBy"];
  sortOrder: TemplateFilters["sortOrder"];
  itemsPerPage: number;
  showFilters: boolean;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onFeaturedChange: (value: boolean | undefined) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortByChange: (value: TemplateFilters["sortBy"]) => void;
  onSortOrderChange: (value: TemplateFilters["sortOrder"]) => void;
  onItemsPerPageChange: (value: number) => void;
  onClearFilters: () => void;
}

export function TemplateFiltersComponent({
  searchTerm,
  categoryFilter,
  difficultyFilter,
  featuredFilter,
  minPrice,
  maxPrice,
  sortBy,
  sortOrder,
  itemsPerPage,
  showFilters,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onFeaturedChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortByChange,
  onSortOrderChange,
  onItemsPerPageChange,
  onClearFilters,
}: TemplateFiltersComponentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Primary filters - always visible */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("Search templates...", "admin.templates.search")}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue
                placeholder={t("Category", "admin.templates.category")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Categories", "admin.templates.allCategories")}
              </SelectItem>
              <SelectItem value="WEBSITE_TEMPLATES">
                Website Templates
              </SelectItem>
              <SelectItem value="ADMIN_DASHBOARDS">Admin Dashboards</SelectItem>
              <SelectItem value="LANDING_PAGES">Landing Pages</SelectItem>
              <SelectItem value="E_COMMERCE">E-Commerce</SelectItem>
              <SelectItem value="PORTFOLIO">Portfolio</SelectItem>
              <SelectItem value="BLOG_THEMES">Blog Themes</SelectItem>
              <SelectItem value="MOBILE_TEMPLATES">Mobile Templates</SelectItem>
              <SelectItem value="COMPONENTS">Components</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={onDifficultyChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue
                placeholder={t("Difficulty", "admin.templates.difficulty")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("All Levels", "admin.templates.allLevels")}
              </SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
              <SelectItem value="EXPERT">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters - Responsive Grid */}
      {showFilters && (
        <Card className="p-3 sm:p-4 bg-muted/50">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="space-y-2">
              <Label className="text-sm">Featured Only</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={featuredFilter === true}
                  onCheckedChange={(checked) =>
                    onFeaturedChange(checked ? true : undefined)
                  }
                />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {featuredFilter ? "Featured only" : "All templates"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minPrice" className="text-sm">
                Min Price ($)
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice" className="text-sm">
                Max Price ($)
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="999"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  onSortByChange(value as TemplateFilters["sortBy"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                  <SelectItem value="views">Views</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Sort Order</Label>
              <Select
                value={sortOrder}
                onValueChange={(value) =>
                  onSortOrderChange(value as TemplateFilters["sortOrder"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Items Per Page</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) =>
                  onItemsPerPageChange(Number.parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 per page</SelectItem>
                  <SelectItem value="9">9 per page</SelectItem>
                  <SelectItem value="12">12 per page</SelectItem>
                  <SelectItem value="24">24 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
