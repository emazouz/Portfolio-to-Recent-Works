"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Download,
  Eye,
  ExternalLink,
  Heart,
  Code,
  Palette,
  Smartphone,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { RelatedTemplates } from "@/components/template/RelatedTemplates";
import { TemplateReviews } from "@/components/template/TemplateReviews";
import { SocialShare } from "@/components/template/SocialShare";

interface Template {
  id: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  originalPrice: number;
  rating: number;
  ratingsCount: number;
  downloads: number;
  views: number;
  tags: string[];
  category: string;
  imageUrl: string;
  previewImages: string[];
  previewUrl: string;
  downloadUrl: string;
  fileSize: string;
  difficulty: string;
  featured: boolean;
  isActive: boolean;
  version: string;
  changelog: string;
  slug_en: string;
  slug_ar: string;
  metaTitle_en: string;
  metaTitle_ar: string;
  metaDesc_en: string;
  metaDesc_ar: string;
  createdAt: Date;
  updatedAt: Date;
  lastUpdated: Date;
}

interface ViewTemplateProps {
  template: Template;
}

const categoryLabels = {
  ADMIN_DASHBOARDS: { en: "Admin Dashboard", ar: "لوحة إدارة" },
  LANDING_PAGES: { en: "Landing Page", ar: "صفحة هبوط" },
  PORTFOLIO: { en: "Portfolio", ar: "معرض أعمال" },
  BLOG_THEMES: { en: "Blog Theme", ar: "قالب مدونة" },
  WEBSITE_TEMPLATES: { en: "Website Template", ar: "قالب موقع" },
};

const difficultyLabels = {
  BEGINNER: { en: "Beginner", ar: "مبتدئ" },
  INTERMEDIATE: { en: "Intermediate", ar: "متوسط" },
  ADVANCED: { en: "Advanced", ar: "متقدم" },
  EXPERT: { en: "Expert", ar: "خبير" },
};

export function ViewTemplate({ template }: ViewTemplateProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100) + 50);
  const { currentLanguage } = useTranslation();

  const getLocalizedContent = (field: string) => {
    const langSuffix = currentLanguage === "ar" ? "_ar" : "_en";
    return (
      (template as any)[`${field}${langSuffix}`] ||
      (template as any)[`${field}_en`] ||
      (template as any)[field]
    );
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const features = [
    {
      icon: Code,
      title: currentLanguage === "ar" ? "كود نظيف" : "Clean Code",
      description:
        currentLanguage === "ar"
          ? "كود منظم وموثق جيداً"
          : "Well-structured, documented code",
    },
    {
      icon: Palette,
      title: currentLanguage === "ar" ? "تصميم حديث" : "Modern Design",
      description:
        currentLanguage === "ar"
          ? "أنماط UI/UX معاصرة"
          : "Contemporary UI/UX patterns",
    },
    {
      icon: Smartphone,
      title: currentLanguage === "ar" ? "متجاوب" : "Responsive",
      description:
        currentLanguage === "ar"
          ? "يعمل على جميع الأجهزة"
          : "Works on all devices",
    },
  ];

  const discount = Math.round(
    ((template.originalPrice - template.price) / template.originalPrice) * 100
  );

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Template Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                >
                  {
                    categoryLabels[
                      template.category as keyof typeof categoryLabels
                    ][currentLanguage === "ar" ? "ar" : "en"]
                  }
                </Badge>
                <Badge variant="outline">
                  {
                    difficultyLabels[
                      template.difficulty as keyof typeof difficultyLabels
                    ][currentLanguage === "ar" ? "ar" : "en"]
                  }
                </Badge>
                {template.featured && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    {currentLanguage === "ar" ? "مميز" : "Featured"}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {getLocalizedContent("title")}
              </h1>

              <p className="text-xl text-muted-foreground mb-6 text-pretty">
                {getLocalizedContent("description")}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(template.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{template.rating}</span>
                  <span className="text-muted-foreground">
                    ({template.ratingsCount}{" "}
                    {currentLanguage === "ar" ? "تقييم" : "reviews"})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <span>
                    {template.downloads}{" "}
                    {currentLanguage === "ar" ? "تحميل" : "downloads"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>
                    {template.views || Math.floor(Math.random() * 5000) + 1000}{" "}
                    {currentLanguage === "ar" ? "مشاهدة" : "views"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={isLiked ? "text-red-500 border-red-500" : ""}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {likes}
                </Button>
                <SocialShare
                  title={getLocalizedContent("title")}
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:w-96">
              <Card className="sticky top-8">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl font-bold">
                          ${template.price}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ${template.originalPrice}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          -{discount}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {currentLanguage === "ar"
                          ? "سعر لمرة واحدة"
                          : "One-time payment"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      {currentLanguage === "ar" ? "اشتري الآن" : "Buy Now"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      asChild
                    >
                      <a
                        href={template.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {currentLanguage === "ar"
                          ? "معاينة مباشرة"
                          : "Live Preview"}
                      </a>
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>
                        {currentLanguage === "ar"
                          ? "كود مصدري كامل"
                          : "Complete source code"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>
                        {currentLanguage === "ar"
                          ? "وثائق شاملة"
                          : "Comprehensive documentation"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>
                        {currentLanguage === "ar"
                          ? "تحديثات مدى الحياة"
                          : "Lifetime updates"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>
                        {currentLanguage === "ar"
                          ? "دعم لمدة 6 أشهر"
                          : "6 months support"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>
                        {currentLanguage === "ar" ? "حجم الملف:" : "File size:"}
                      </span>
                      <span>{template.fileSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {currentLanguage === "ar" ? "الإصدار:" : "Version:"}
                      </span>
                      <span>{template.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {currentLanguage === "ar"
                          ? "آخر تحديث:"
                          : "Last updated:"}
                      </span>
                      <span>
                        {new Date(template.lastUpdated).toLocaleDateString(
                          currentLanguage === "ar" ? "ar-SA" : "en-US"
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Template Preview */}
        <div className="mb-12">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-8">
            <img
              src={template.imageUrl || "/placeholder.svg"}
              alt={getLocalizedContent("title")}
              className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
            />

            {/* Image Navigation */}
            {template.previewImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {template.previewImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-purple-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {currentLanguage === "ar" ? "المميزات الرئيسية" : "Key Features"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8">
            {currentLanguage === "ar"
              ? "التقنيات المستخدمة"
              : "Technologies Used"}
          </h2>
          <div className="flex flex-wrap gap-3">
            {template.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-sm px-4 py-2"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description & Changelog */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {currentLanguage === "ar" ? "نظرة عامة" : "Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {getLocalizedContent("description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {currentLanguage === "ar" ? "سجل التغييرات" : "Changelog"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs">
                    v{template.version}
                  </Badge>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {template.changelog}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(template.lastUpdated).toLocaleDateString(
                        currentLanguage === "ar" ? "ar-SA" : "en-US"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <TemplateReviews templateId={template.id} />

        {/* Related Templates */}
        <RelatedTemplates currentTemplate={template} />
      </div>
    </div>
  );
}
