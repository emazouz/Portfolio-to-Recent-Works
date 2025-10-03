"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";

// Mock related templates data
const allTemplates = [
  {
    id: 1,
    title_en: "E-commerce Dashboard",
    title_ar: "لوحة تحكم التجارة الإلكترونية",
    description_en: "Complete admin dashboard for e-commerce platforms",
    description_ar: "لوحة تحكم كاملة لمنصات التجارة الإلكترونية",
    price: 49,
    rating: 4.9,
    downloads: 1200,
    category: "ADMIN_DASHBOARDS",
    imageUrl: "/modern-ecommerce-dashboard.png",
    difficulty: "ADVANCED",
  },
  {
    id: 2,
    title_en: "SaaS Landing Page",
    title_ar: "صفحة هبوط SaaS",
    description_en: "Modern landing page template for SaaS products",
    description_ar: "قالب صفحة هبوط حديث لمنتجات SaaS",
    price: 29,
    rating: 4.8,
    downloads: 890,
    category: "LANDING_PAGES",
    imageUrl: "/saas-landing-page.png",
    difficulty: "INTERMEDIATE",
  },
  {
    id: 6,
    title_en: "Crypto Dashboard",
    title_ar: "لوحة تداول العملات الرقمية",
    description_en: "Cryptocurrency trading dashboard with real-time data",
    description_ar: "لوحة تداول العملات الرقمية مع بيانات لحظية",
    price: 59,
    rating: 4.8,
    downloads: 290,
    category: "ADMIN_DASHBOARDS",
    imageUrl: "/crypto-trading-dashboard.png",
    difficulty: "ADVANCED",
  },
];

interface RelatedTemplatesProps {
  currentTemplate: {
    id: number;
    category: string;
  };
}

export function RelatedTemplates({ currentTemplate }: RelatedTemplatesProps) {
  const { currentLanguage } = useTranslation();

  const getLocalizedContent = (item: any, field: string) => {
    const langSuffix = currentLanguage === "ar" ? "_ar" : "_en";
    return item[`${field}${langSuffix}`] || item[`${field}_en`] || item[field];
  };

  // Filter related templates (same category, exclude current)
  const relatedTemplates = allTemplates
    .filter(
      (template) =>
        template.category === currentTemplate.category &&
        template.id !== currentTemplate.id
    )
    .slice(0, 3);

  if (relatedTemplates.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8">
        {currentLanguage === "ar" ? "قوالب ذات صلة" : "Related Templates"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTemplates.map((template) => (
          <Card
            key={template.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={template.imageUrl || "/placeholder.svg"}
                alt={getLocalizedContent(template, "title")}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                ${template.price}
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">
                {getLocalizedContent(template, "title")}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {getLocalizedContent(template, "description")}
              </CardDescription>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {template.downloads}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/templates/view/${template.id}`}>
                  {currentLanguage === "ar" ? "عرض القالب" : "View Template"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
