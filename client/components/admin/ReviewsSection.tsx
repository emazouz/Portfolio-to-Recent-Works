"use client";

import { Star, AlertCircle, Trash2, Package, Loader2 } from "lucide-react";
import { reviewStore, ReviewType } from "@/store/reviewStore";
import { formatDate } from "@/utils/dateHelpers";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import StatCard from "@/components/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GetReviewsOptions = {
  page?: number;
  limit?: number;
  minRating?: number;
  maxRating?: number;
  userId?: string;
  templateId?: number;
  verifiedOnly?: boolean | string;
};

// Components
const Avatar = ({
  src,
  alt,
  className = "",
}: {
  src: string | null;
  alt: string;
  className?: string;
}) => (
  <div className={`relative flex-shrink-0 ${className}`}>
    {src ? (
      <img
        src={src}
        alt={alt}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
      />
    ) : (
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-200 dark:border-gray-600">
        {alt.charAt(0).toUpperCase()}
      </div>
    )}
  </div>
);

const RatingStars = ({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) => (
  <div
    className={`flex ${className}`}
    aria-label={`Rating: ${rating} out of 5 stars`}
  >
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
        aria-hidden="true"
      />
    ))}
  </div>
);

const VerifiedBadge = ({ currentLanguage }: { currentLanguage: string }) => (
  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-[10px] sm:text-xs font-medium rounded-full">
    {currentLanguage === "ar" ? "مشتري موثق" : "Verified Purchase"}
  </span>
);

const TemplateInfo = ({
  template,
  currentLanguage,
}: {
  template: {
    title_en: string;
    title_ar: string;
    price: string;
  };
  currentLanguage: string;
}) => (
  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-3">
    <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <h5 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">
        {currentLanguage === "ar" ? template.title_ar : template.title_en}
      </h5>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        ${template.price}
      </p>
    </div>
  </div>
);

const EmptyState = ({ currentLanguage }: { currentLanguage: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 sm:p-12 text-center">
    <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
      {currentLanguage === "ar" ? "لا توجد مراجعات بعد" : "No reviews yet"}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {currentLanguage === "ar"
        ? "سيظهر هنا عندما يقوم العملاء بتقديم تقييمات"
        : "Reviews will appear here when customers submit them"}
    </p>
  </div>
);

const ReviewCard = ({
  review,
  currentLanguage,
  onDelete,
  isDeleting,
}: {
  review: ReviewType;
  currentLanguage: string;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}) => {
  const handleDelete = () => {
    const confirmMessage =
      currentLanguage === "ar"
        ? "هل أنت متأكد من حذف هذه المراجعة؟"
        : "Are you sure you want to delete this review?";

    if (confirm(confirmMessage)) {
      onDelete(review.id);
    }
  };

  return (
    <div className="bg-white dark:bg-background rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gray-700/50 transition-all duration-300 p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <Avatar src={review.user.avatar} alt={review.user.name} />

        <div className="flex-1 min-w-0 w-full">
          {/* Template Info */}
          <TemplateInfo
            template={review.template}
            currentLanguage={currentLanguage}
          />

          {/* User Info */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {review.user.name}
            </h4>
            {review.verified && (
              <VerifiedBadge currentLanguage={currentLanguage} />
            )}
          </div>

          {/* Rating and Date */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <RatingStars rating={review.rating} />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {formatDate(
                typeof review.createdAt === "string"
                  ? review.createdAt
                  : review.createdAt.toISOString()
              )}
            </span>
          </div>

          {/* Comment */}
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed break-words">
            {review.comment}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="ghost"
              size="sm"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              )}
              {currentLanguage === "ar" ? "حذف" : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsHeader = ({
  reviewsCount,
  currentLanguage,
}: {
  reviewsCount: number;
  currentLanguage: string;
}) => {
  const reviewsText =
    currentLanguage === "ar"
      ? reviewsCount === 1
        ? "مراجعة"
        : "مراجعات"
      : reviewsCount === 1
      ? "review"
      : "reviews";

  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {currentLanguage === "ar"
          ? "التقييمات والمراجعات"
          : "Reviews & Ratings"}
      </h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
        {reviewsCount} {reviewsText}
      </p>
    </div>
  );
};

// Stats Component
const ReviewsStats = ({
  reviews,
  currentLanguage,
}: {
  reviews: ReviewType[];
  currentLanguage: string;
}) => {
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
  const verifiedReviews = reviews.filter((review) => review.verified).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
      <StatCard
        icon={Star}
        label={currentLanguage === "ar" ? "متوسط التقييم" : "Average Rating"}
        value={averageRating.toFixed(1)}
        color="#155dfc"
      />

      <StatCard
        icon={Package}
        label={currentLanguage === "ar" ? "إجمالي المراجعات" : "Total Reviews"}
        value={totalReviews}
        color="#05df72"
      />

      <StatCard
        icon={Package}
        label={
          currentLanguage === "ar" ? "مشتريات موثقة" : "Verified Purchases"
        }
        value={verifiedReviews}
        color="#9810fa"
      />
    </div>
  );
};

// Filters Component
const ReviewsFilters = ({
  options,
  setOptions,
  currentLanguage,
}: {
  options: GetReviewsOptions;
  setOptions: (options: GetReviewsOptions) => void;
  currentLanguage: string;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {currentLanguage === "ar" ? "تصفية" : "Filters"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Min Rating */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentLanguage === "ar" ? "أقل تقييم" : "Min Rating"}
          </label>
          <Select
            value={options.minRating?.toString() || "all"}
            onValueChange={(value) =>
              setOptions({
                ...options,
                minRating: value === "all" ? undefined : parseInt(value),
              })
            }
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {currentLanguage === "ar" ? "الكل" : "All"}
              </SelectItem>
              {[1, 2, 3, 4, 5].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} {currentLanguage === "ar" ? "نجوم" : "stars"}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verified Only */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentLanguage === "ar" ? "موثق فقط" : "Verified Only"}
          </label>
          <Select
            value={
              options.verifiedOnly === undefined
                ? "all"
                : options.verifiedOnly.toString()
            }
            onValueChange={(value) =>
              setOptions({
                ...options,
                verifiedOnly: value === "all" ? undefined : value === "true",
              })
            }
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {currentLanguage === "ar" ? "الكل" : "All"}
              </SelectItem>
              <SelectItem value="true">
                {currentLanguage === "ar" ? "موثق فقط" : "Verified Only"}
              </SelectItem>
              <SelectItem value="false">
                {currentLanguage === "ar" ? "غير موثق" : "Not Verified"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Template ID */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentLanguage === "ar" ? "معرف القالب" : "Template ID"}
          </label>
          <Input
            type="number"
            placeholder={currentLanguage === "ar" ? "الكل" : "All"}
            value={options.templateId || ""}
            onChange={(e) =>
              setOptions({
                ...options,
                templateId: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
            className="text-sm"
          />
        </div>

        {/* Clear Filters */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-transparent">
            Action
          </label>
          <Button
            variant="outline"
            onClick={() => setOptions({})}
            className="w-full text-sm"
          >
            {currentLanguage === "ar" ? "مسح الفلاتر" : "Clear Filters"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ReviewsSection() {
  const { currentLanguage } = useTranslation();
  const { deleteReview, isLoading, error, reviews, getAllReviews, pagination } =
    reviewStore();
  const [options, setOptions] = useState<GetReviewsOptions>({
    page: 1,
    limit: 10,
  });

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAllReviews = useCallback(async () => {
    const result = await getAllReviews(options);

    if (!result.success) {
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description: result.message,
        variant: "error",
      });
    }
  }, [getAllReviews, options, currentLanguage]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);

      const isDeleted = await deleteReview(id);

      if (isDeleted.success) {
        toast({
          title: currentLanguage === "ar" ? "نجح" : "Success",
          description:
            isDeleted.message ||
            (currentLanguage === "ar"
              ? "تم حذف المراجعة بنجاح"
              : "Review deleted successfully"),
          variant: "success",
        });

        // Refresh reviews after deletion
        await fetchAllReviews();
      } else {
        toast({
          title: currentLanguage === "ar" ? "فشل" : "Failed",
          description: isDeleted.message,
          variant: "error",
        });
      }
    } catch (err) {
      console.error("Delete review error:", err);
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description:
          currentLanguage === "ar"
            ? "فشل في حذف المراجعة"
            : "Failed to delete review",
        variant: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (isLoading && !reviews) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (!reviews) {
    return null;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <ReviewsHeader
        reviewsCount={reviews.length}
        currentLanguage={currentLanguage}
      />

      {/* Reviews Stats */}
      <ReviewsStats reviews={reviews} currentLanguage={currentLanguage} />

      {/* Filters */}
      <ReviewsFilters
        options={options}
        setOptions={setOptions}
        currentLanguage={currentLanguage}
      />

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentLanguage={currentLanguage}
              onDelete={handleDelete}
              isDeleting={deletingId === review.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState currentLanguage={currentLanguage} />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setOptions({ ...options, page: (options.page || 1) - 1 })
            }
            disabled={!pagination.hasPrev}
          >
            {currentLanguage === "ar" ? "السابق" : "Previous"}
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
            {currentLanguage === "ar" ? "صفحة" : "Page"} {pagination.page}{" "}
            {currentLanguage === "ar" ? "من" : "of"} {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setOptions({ ...options, page: (options.page || 1) + 1 })
            }
            disabled={!pagination.hasNext}
          >
            {currentLanguage === "ar" ? "التالي" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}
