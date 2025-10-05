"use client";

import { useCallback, useEffect, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { RelatedTemplates } from "@/components/template/RelatedTemplates";
import { TemplateReviews } from "@/components/template/TemplateReviews";
import { SocialShare } from "@/components/template/SocialShare";
import { toast } from "@/hooks/use-toast";
import { templateStore } from "@/store/templateStore";
import NotFound from "./ui/NotFound";
import Loader from "@/components/ui/Loader";
import {
  categoryLabels,
  difficultyLabels,
} from "@/constants/templateConstants";

interface ViewTemplateProps {
  templateId: number;
}

export function ViewTemplate({ templateId }: ViewTemplateProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const { currentLanguage } = useTranslation();
  const { getTemplateById, isLoading, template } = templateStore();

  const fetchTemplate = useCallback(async () => {
    try {
      const result = await getTemplateById(templateId);
      if (!result.success) {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast({
        title: "Error",
        description: `Failed to fetch template: ${error}`,
        variant: "error",
      });
    }
  }, [getTemplateById, templateId]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  useEffect(() => {
    // Initialize likes when template loads
    if (template) {
      setLikes(Math.floor(Math.random() * 100) + 50);
    }
  }, [template]);

  const getLocalizedContent = useCallback(
    (field: string) => {
      if (!template) return "";
      const langSuffix = currentLanguage === "ar" ? "_ar" : "_en";
      return (
        (template as any)[`${field}${langSuffix}`] ||
        (template as any)[`${field}_en`] ||
        (template as any)[field] ||
        ""
      );
    },
    [template, currentLanguage]
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (template?.previewImages.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (template?.previewImages.length || 1) - 1 ? 0 : prev + 1
    );
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

  // if (isLoading) {
  //   return <Loader />;
  // }

  if (!template) {
    return <NotFound />;
  }

  const discount =
    template.originalPrice > template.price
      ? Math.round(
          ((template.originalPrice - template.price) / template.originalPrice) *
            100
        )
      : 0;

  const currentPreviewImage =
    template.previewImages?.[currentImageIndex] || template.imageUrl;

  return (
    <div className="py-8 sm:py-12 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Header Section - Responsive */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: Template Info */}
            <div className="flex-1">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs sm:text-sm"
                >
                  {
                    categoryLabels[
                      template.category as keyof typeof categoryLabels
                    ]?.[currentLanguage === "ar" ? "ar" : "en"]
                  }
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm">
                  {
                    difficultyLabels[
                      template.difficulty as keyof typeof difficultyLabels
                    ]?.[currentLanguage === "ar" ? "ar" : "en"]
                  }
                </Badge>
                {template.featured && (
                  <Badge className="bg-yellow-500 text-yellow-900 text-xs sm:text-sm">
                    {currentLanguage === "ar" ? "مميز" : "Featured"}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-balance">
                {getLocalizedContent("title")}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-4 sm:mb-6 text-pretty">
                {getLocalizedContent("description")}
              </p>

              {/* Stats - Responsive */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                {/* Rating */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.floor(template.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-sm sm:text-base">
                    {template.rating}
                  </span>
                  <span className="text-muted-foreground text-xs sm:text-sm">
                    ({template.ratingsCount}{" "}
                    {currentLanguage === "ar" ? "تقييم" : "reviews"})
                  </span>
                </div>

                {/* Downloads */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {template.downloads.toLocaleString()}{" "}
                    {currentLanguage === "ar" ? "تحميل" : "downloads"}
                  </span>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>
                    {(
                      template.views || Math.floor(Math.random() * 5000) + 1000
                    ).toLocaleString()}{" "}
                    {currentLanguage === "ar" ? "مشاهدة" : "views"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={`${
                    isLiked ? "text-red-500 border-red-500" : ""
                  } text-xs sm:text-sm`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${
                      isLiked ? "fill-current" : ""
                    }`}
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

            {/* Right: Purchase Card - Sticky on desktop */}
            <div className="lg:w-96 xl:w-[420px]">
              <Card className="lg:sticky lg:top-8">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-2xl sm:text-3xl font-bold">
                          ${template.price}
                        </span>
                        {discount > 0 && (
                          <>
                            <span className="text-base sm:text-lg text-muted-foreground line-through">
                              ${template.originalPrice}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              -{discount}%
                            </Badge>
                          </>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {currentLanguage === "ar"
                          ? "سعر لمرة واحدة"
                          : "One-time payment"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  {/* Action Buttons */}
                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                      size="lg"
                    >
                      {currentLanguage === "ar" ? "اشتري الآن" : "Buy Now"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent text-sm sm:text-base"
                      asChild
                    >
                      <a
                        href={template.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                        {currentLanguage === "ar"
                          ? "معاينة مباشرة"
                          : "Live Preview"}
                      </a>
                    </Button>
                  </div>

                  <Separator />

                  {/* Features List */}
                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>
                        {currentLanguage === "ar"
                          ? "كود مصدري كامل"
                          : "Complete source code"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>
                        {currentLanguage === "ar"
                          ? "وثائق شاملة"
                          : "Comprehensive documentation"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>
                        {currentLanguage === "ar"
                          ? "تحديثات مدى الحياة"
                          : "Lifetime updates"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                      <span>
                        {currentLanguage === "ar"
                          ? "دعم لمدة 6 أشهر"
                          : "6 months support"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Template Details */}
                  <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex justify-between gap-2">
                      <span>
                        {currentLanguage === "ar" ? "حجم الملف:" : "File size:"}
                      </span>
                      <span className="font-medium text-foreground">
                        {template.fileSize || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>
                        {currentLanguage === "ar" ? "الإصدار:" : "Version:"}
                      </span>
                      <span className="font-medium text-foreground">
                        {template.version}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span>
                        {currentLanguage === "ar"
                          ? "آخر تحديث:"
                          : "Last updated:"}
                      </span>
                      <span className="font-medium text-foreground">
                        {new Date(template.updatedAt).toLocaleDateString(
                          currentLanguage === "ar" ? "ar-SA" : "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Template Preview with Gallery */}
        <div className="mb-8 sm:mb-12">
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 sm:p-6 lg:p-8">
            {/* Main Image */}
            <div className="relative group">
              <img
                src={currentPreviewImage || "/placeholder.svg"}
                alt={getLocalizedContent("title")}
                className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
              />

              {/* Navigation Arrows - Only show if multiple images */}
              {template.previewImages && template.previewImages.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Image Indicators */}
            {template.previewImages && template.previewImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                {template.previewImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-purple-600 w-6 sm:w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section - Responsive Grid */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
            {currentLanguage === "ar" ? "المميزات الرئيسية" : "Key Features"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 sm:mb-4">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8">
            {currentLanguage === "ar"
              ? "التقنيات المستخدمة"
              : "Technologies Used"}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {template.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description & Changelog - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                {currentLanguage === "ar" ? "نظرة عامة" : "Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {getLocalizedContent("description")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                {currentLanguage === "ar" ? "سجل التغييرات" : "Changelog"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    v{template.version}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground break-words">
                      {template.changelog || "Initial release"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(template.updatedAt).toLocaleDateString(
                        currentLanguage === "ar" ? "ar-SA" : "en-US",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="mb-8 sm:mb-12">
          {/* reviews */}
          <TemplateReviews templateId={template.id} />
        </div>

        {/* Related Templates */}
        <RelatedTemplates templateId={template.id} />
      </div>
    </div>
  );
}
