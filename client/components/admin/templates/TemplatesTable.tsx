"use client";

import { useState } from "react";
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
import {
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Download,
  Star,
  DollarSign,
} from "lucide-react";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown-menu";

const mockTemplates = [
  {
    id: 1,
    title_en: "Modern Dashboard Template",
    title_ar: "قالب لوحة تحكم حديثة",
    description_en:
      "A comprehensive dashboard template with modern design and advanced features. Perfect for admin panels, analytics dashboards, and business applications.",
    description_ar:
      "قالب لوحة تحكم شامل بتصميم حديث وميزات متقدمة. مثالي للوحات الإدارة ولوحات التحليلات وتطبيقات الأعمال.",
    price: "49",
    originalPrice: "79",
    rating: 0,
    ratingsCount: 0,
    downloads: 0,
    views: 1,
    tags: ["React", "TypeScript", "Tailwind CSS", "Dashboard", "Admin"],
    category: "ADMIN_DASHBOARDS",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500579/ecommerce/Templates/imageUrl/goxca2tyb0qfcqsjzb3p.jpg",
    previewImages: [
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500581/ecommerce/Templates/previewImages/zsiybuco6v6l5ygktuln.png",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/wyuh2xz5nyqmvi4n23bl.jpg",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/dkou5gxiyn167q2as02l.png",
    ],
    previewUrl: "https://preview.example.com/dashboard",
    downloadUrl:
      "https://cdruyxotyhgrkdvjskpo.supabase.co/storage/v1/object/public/templates/templates/1759500568535-ip6kq6x2zmm.zip",
    fileSize: "10.01 MB",
    difficulty: "ADVANCED",
    featured: true,
    isActive: true,
    version: "1.0.0",
    changelog:
      "Added dark mode support, improved mobile responsiveness, new chart components",
    slug_en: "modern-dashboard-template",
    slug_ar: "قالب-لوحة-تحكم-حديثة",
    metaTitle_en: "Modern Dashboard Template - Premium React Admin Panel",
    metaTitle_ar: "قالب لوحة تحكم حديثة - لوحة إدارة React متميزة",
    metaDesc_en:
      "Professional dashboard template with modern design, built with React and TypeScript. Perfect for admin panels and business applications.",
    metaDesc_ar:
      "قالب لوحة تحكم احترافي بتصميم حديث، مبني بـ React و TypeScript. مثالي للوحات الإدارة وتطبيقات الأعمال.",
    createdAt: "2025-10-03T14:09:43.047Z",
    updatedAt: "2025-10-03T14:11:47.114Z",
    lastUpdated: null,
    _count: {
      orders: 0,
      reviews: 0,
    },
  },
  {
    id: 2,
    title_en: "Modern Dashboard Template",
    title_ar: "قالب لوحة تحكم حديثة",
    description_en:
      "A comprehensive dashboard template with modern design and advanced features. Perfect for admin panels, analytics dashboards, and business applications.",
    description_ar:
      "قالب لوحة تحكم شامل بتصميم حديث وميزات متقدمة. مثالي للوحات الإدارة ولوحات التحليلات وتطبيقات الأعمال.",
    price: "49",
    originalPrice: "79",
    rating: 0,
    ratingsCount: 0,
    downloads: 0,
    views: 1,
    tags: ["React", "TypeScript", "Tailwind CSS", "Dashboard", "Admin"],
    category: "ADMIN_DASHBOARDS",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500579/ecommerce/Templates/imageUrl/goxca2tyb0qfcqsjzb3p.jpg",
    previewImages: [
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500581/ecommerce/Templates/previewImages/zsiybuco6v6l5ygktuln.png",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/wyuh2xz5nyqmvi4n23bl.jpg",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/dkou5gxiyn167q2as02l.png",
    ],
    previewUrl: "https://preview.example.com/dashboard",
    downloadUrl:
      "https://cdruyxotyhgrkdvjskpo.supabase.co/storage/v1/object/public/templates/templates/1759500568535-ip6kq6x2zmm.zip",
    fileSize: "10.01 MB",
    difficulty: "ADVANCED",
    featured: true,
    isActive: true,
    version: "1.0.0",
    changelog:
      "Added dark mode support, improved mobile responsiveness, new chart components",
    slug_en: "modern-dashboard-template",
    slug_ar: "قالب-لوحة-تحكم-حديثة",
    metaTitle_en: "Modern Dashboard Template - Premium React Admin Panel",
    metaTitle_ar: "قالب لوحة تحكم حديثة - لوحة إدارة React متميزة",
    metaDesc_en:
      "Professional dashboard template with modern design, built with React and TypeScript. Perfect for admin panels and business applications.",
    metaDesc_ar:
      "قالب لوحة تحكم احترافي بتصميم حديث، مبني بـ React و TypeScript. مثالي للوحات الإدارة وتطبيقات الأعمال.",
    createdAt: "2025-10-03T14:09:43.047Z",
    updatedAt: "2025-10-03T14:11:47.114Z",
    lastUpdated: null,
    _count: {
      orders: 0,
      reviews: 0,
    },
  },
  {
    id: 3,
    title_en: "Modern Dashboard Template",
    title_ar: "قالب لوحة تحكم حديثة",
    description_en:
      "A comprehensive dashboard template with modern design and advanced features. Perfect for admin panels, analytics dashboards, and business applications.",
    description_ar:
      "قالب لوحة تحكم شامل بتصميم حديث وميزات متقدمة. مثالي للوحات الإدارة ولوحات التحليلات وتطبيقات الأعمال.",
    price: "49",
    originalPrice: "79",
    rating: 0,
    ratingsCount: 0,
    downloads: 0,
    views: 1,
    tags: ["React", "TypeScript", "Tailwind CSS", "Dashboard", "Admin"],
    category: "ADMIN_DASHBOARDS",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500579/ecommerce/Templates/imageUrl/goxca2tyb0qfcqsjzb3p.jpg",
    previewImages: [
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500581/ecommerce/Templates/previewImages/zsiybuco6v6l5ygktuln.png",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/wyuh2xz5nyqmvi4n23bl.jpg",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/dkou5gxiyn167q2as02l.png",
    ],
    previewUrl: "https://preview.example.com/dashboard",
    downloadUrl:
      "https://cdruyxotyhgrkdvjskpo.supabase.co/storage/v1/object/public/templates/templates/1759500568535-ip6kq6x2zmm.zip",
    fileSize: "10.01 MB",
    difficulty: "ADVANCED",
    featured: true,
    isActive: true,
    version: "1.0.0",
    changelog:
      "Added dark mode support, improved mobile responsiveness, new chart components",
    slug_en: "modern-dashboard-template",
    slug_ar: "قالب-لوحة-تحكم-حديثة",
    metaTitle_en: "Modern Dashboard Template - Premium React Admin Panel",
    metaTitle_ar: "قالب لوحة تحكم حديثة - لوحة إدارة React متميزة",
    metaDesc_en:
      "Professional dashboard template with modern design, built with React and TypeScript. Perfect for admin panels and business applications.",
    metaDesc_ar:
      "قالب لوحة تحكم احترافي بتصميم حديث، مبني بـ React و TypeScript. مثالي للوحات الإدارة وتطبيقات الأعمال.",
    createdAt: "2025-10-03T14:09:43.047Z",
    updatedAt: "2025-10-03T14:11:47.114Z",
    lastUpdated: null,
    _count: {
      orders: 0,
      reviews: 0,
    },
  },
  {
    id: 4,
    title_en: "Modern Dashboard Template",
    title_ar: "قالب لوحة تحكم حديثة",
    description_en:
      "A comprehensive dashboard template with modern design and advanced features. Perfect for admin panels, analytics dashboards, and business applications.",
    description_ar:
      "قالب لوحة تحكم شامل بتصميم حديث وميزات متقدمة. مثالي للوحات الإدارة ولوحات التحليلات وتطبيقات الأعمال.",
    price: "49",
    originalPrice: "79",
    rating: 0,
    ratingsCount: 0,
    downloads: 0,
    views: 1,
    tags: ["React", "TypeScript", "Tailwind CSS", "Dashboard", "Admin"],
    category: "ADMIN_DASHBOARDS",
    imageUrl:
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500579/ecommerce/Templates/imageUrl/goxca2tyb0qfcqsjzb3p.jpg",
    previewImages: [
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500581/ecommerce/Templates/previewImages/zsiybuco6v6l5ygktuln.png",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/wyuh2xz5nyqmvi4n23bl.jpg",
      "https://res.cloudinary.com/doa8ii7kz/image/upload/v1759500582/ecommerce/Templates/previewImages/dkou5gxiyn167q2as02l.png",
    ],
    previewUrl: "https://preview.example.com/dashboard",
    downloadUrl:
      "https://cdruyxotyhgrkdvjskpo.supabase.co/storage/v1/object/public/templates/templates/1759500568535-ip6kq6x2zmm.zip",
    fileSize: "10.01 MB",
    difficulty: "ADVANCED",
    featured: true,
    isActive: true,
    version: "1.0.0",
    changelog:
      "Added dark mode support, improved mobile responsiveness, new chart components",
    slug_en: "modern-dashboard-template",
    slug_ar: "قالب-لوحة-تحكم-حديثة",
    metaTitle_en: "Modern Dashboard Template - Premium React Admin Panel",
    metaTitle_ar: "قالب لوحة تحكم حديثة - لوحة إدارة React متميزة",
    metaDesc_en:
      "Professional dashboard template with modern design, built with React and TypeScript. Perfect for admin panels and business applications.",
    metaDesc_ar:
      "قالب لوحة تحكم احترافي بتصميم حديث، مبني بـ React و TypeScript. مثالي للوحات الإدارة وتطبيقات الأعمال.",
    createdAt: "2025-10-03T14:09:43.047Z",
    updatedAt: "2025-10-03T14:11:47.114Z",
    lastUpdated: null,
    _count: {
      orders: 0,
      reviews: 0,
    },
  },
];

export function TemplatesTable() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.title_ar.includes(searchTerm);
    const matchesCategory =
      categoryFilter === "all" || template.category === categoryFilter;
    const matchesDifficulty =
      difficultyFilter === "all" || template.difficulty === difficultyFilter;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Templates", "admin.templates.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage your template collection", "admin.templates.subtitle")}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/templates/add">
            <Plus className="mr-2 h-4 w-4" />
            {t("Add Template", "admin.templates.add")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("All Templates", "admin.templates.all")}</CardTitle>
          <CardDescription>
            {t(
              "View and manage all templates in your collection",
              "admin.templates.description"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search templates...", "admin.templates.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("Category", "admin.templates.category")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Categories", "admin.templates.allCategories")}
                </SelectItem>
                <SelectItem value="ADMIN_DASHBOARDS">
                  ADMIN_DASHBOARDS
                </SelectItem>
                {/* Additional categories can be added here */}
              </SelectContent>
            </Select>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("Difficulty", "admin.templates.difficulty")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Levels", "admin.templates.allLevels")}
                </SelectItem>
                <SelectItem value="ADVANCED">ADVANCED</SelectItem>
                {/* Additional difficulties can be added here */}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
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
                  <div className="absolute top-3 left-3 flex gap-2">
                    {template.featured && (
                      <Badge variant="default" className="text-xs shadow-sm">
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant={template.isActive ? "default" : "secondary"}
                      className="text-xs shadow-sm"
                    >
                      {template.isActive
                        ? t("Active", "admin.templates.active")
                        : t("Inactive", "admin.templates.inactive")}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <CustomDropdown
                      align="end"
                      trigger={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
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
                <CardHeader className="pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.difficulty}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {template.title_en}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {template.title_ar}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-lg">
                          ${template.price}
                        </span>
                        {template.originalPrice > template.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${template.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{template.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({template.ratingsCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        <span>
                          {template.downloads.toLocaleString()} downloads
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{template.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
