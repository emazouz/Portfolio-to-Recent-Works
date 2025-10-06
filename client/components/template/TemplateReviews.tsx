"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Edit2, Loader2, X, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/hooks/use-toast";
import { reviewStore, ReviewType } from "@/store/reviewStore";
import { formatDate } from "@/utils/dateHelpers";
import { authStore } from "@/store/authStore";

interface TemplateReviewsProps {
  templateId: number;
}

export function TemplateReviews({ templateId }: TemplateReviewsProps) {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewId, setReviewId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentLanguage } = useTranslation();
  const {
    addReviews,
    updateReview,
    getTemplateReviews,
    reviews,
    isLoading,
    error,
  } = reviewStore();
  const { getUser, isLoading: isLoadingUser, user } = authStore();

  const getLocalizedComment = useCallback(
    (review: ReviewType) => {
      if (currentLanguage === "ar" && review.comment_ar) {
        return review.comment_ar;
      }
      return review.comment;
    },
    [currentLanguage]
  );

  const fetchAllReviews = useCallback(
    async (id: number) => {
      // Only fetch user if not already loaded
      if (!user) {
        await getUser();
      }

      const result = await getTemplateReviews(id);

      if (!result.success) {
        toast({
          title: currentLanguage === "ar" ? "خطأ" : "Error",
          description: result.message,
          variant: "error",
        });
      }
    },
    [getTemplateReviews, getUser, user, currentLanguage]
  );

  useEffect(() => {
    if (templateId) {
      fetchAllReviews(templateId);
    }
  }, [templateId, fetchAllReviews]);

  const resetForm = useCallback(() => {
    setNewReview("");
    setNewRating(0);
    setReviewId(null);
    setHoveredRating(0);
  }, []);

  const handleEdit = useCallback(
    (review: ReviewType) => {
      setReviewId(Number(review.id));
      setNewRating(review.rating);
      setNewReview(getLocalizedComment(review));

      // Scroll to form
      setTimeout(() => {
        const form = document.getElementById("review-form");
        if (form) {
          form.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          // Focus on the textarea
          const textarea = form.querySelector("textarea");
          if (textarea) {
            textarea.focus();
          }
        }
      }, 100);
    },
    [getLocalizedComment]
  );

  const handleCancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleSubmitReview = async () => {
    // Validation
    if (!newRating) {
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description:
          currentLanguage === "ar"
            ? "الرجاء تحديد تقييم"
            : "Please select a rating",
        variant: "error",
      });
      return;
    }

    const trimmedComment = newReview.trim();

    if (!trimmedComment) {
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description:
          currentLanguage === "ar"
            ? "الرجاء كتابة تعليق"
            : "Please write a comment",
        variant: "error",
      });
      return;
    }

    if (trimmedComment.length < 10) {
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description:
          currentLanguage === "ar"
            ? "التعليق قصير جداً (10 أحرف على الأقل)"
            : "Comment is too short (minimum 10 characters)",
        variant: "error",
      });
      return;
    }

    if (newReview.length > 1000) {
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description:
          currentLanguage === "ar"
            ? "التعليق طويل جداً (1000 حرف كحد أقصى)"
            : "Comment is too long (maximum 1000 characters)",
        variant: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let result;

      if (reviewId) {
        result = await updateReview(reviewId, newRating, trimmedComment);
      } else {
        result = await addReviews(templateId, newRating, trimmedComment);
      }

      if (!result.success) {
        toast({
          title: currentLanguage === "ar" ? "خطأ" : "Error",
          description: result.message,
          variant: "error",
        });
        return;
      }

      toast({
        title: currentLanguage === "ar" ? "نجح" : "Success",
        description: reviewId
          ? currentLanguage === "ar"
            ? "تم تحديث مراجعتك بنجاح"
            : "Your review has been updated successfully"
          : currentLanguage === "ar"
          ? "تم إرسال مراجعتك بنجاح"
          : "Your review has been submitted successfully",
        variant: "success",
      });

      resetForm();

      // Refresh reviews after successful submission
      await fetchAllReviews(templateId);
    } catch (error) {
      console.error("Submit review error:", error);
      toast({
        title: currentLanguage === "ar" ? "خطأ" : "Error",
        description:
          currentLanguage === "ar"
            ? "فشل في إرسال المراجعة"
            : "Failed to submit review",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setNewReview(value);
    }
  };

  const displayRating = hoveredRating || newRating;

  // Loading state
  if (isLoading || isLoadingUser) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          {currentLanguage === "ar"
            ? "التقييمات والمراجعات"
            : "Reviews & Ratings"}
        </h2>
        {reviews && reviews.length > 0 && (
          <p className="text-sm sm:text-base text-muted-foreground">
            {reviews.length}{" "}
            {currentLanguage === "ar"
              ? reviews.length === 1
                ? "مراجعة"
                : "مراجعات"
              : reviews.length === 1
              ? "review"
              : "reviews"}
          </p>
        )}
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4 sm:space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  {/* User Avatar */}
                  <img
                    src={
                      review.user.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                        review.user.name
                      )}`
                    }
                    alt={review.user.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 object-cover"
                  />

                  {/* User Info and Rating */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base truncate">
                        {review.user.name}
                      </h4>
                      {review.verified && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs flex-shrink-0"
                        >
                          {currentLanguage === "ar"
                            ? "مشتري موثق"
                            : "Verified Purchase"}
                        </Badge>
                      )}
                    </div>

                    {/* Rating and Date */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <div
                        className="flex"
                        aria-label={`Rating: ${review.rating} out of 5 stars`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {formatDate(
                          typeof review.createdAt === "string"
                            ? review.createdAt
                            : review.createdAt.toISOString()
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0">
                {/* Review Comment */}
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed break-words whitespace-pre-wrap">
                  {getLocalizedComment(review)}
                </p>

                {/* Action Buttons */}
                {user && review.userId === user.id && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <Button
                      onClick={() => handleEdit(review)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground text-xs sm:text-sm h-8 sm:h-9"
                      disabled={isSubmitting}
                    >
                      <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      {currentLanguage === "ar" ? "تعديل" : "Edit"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">
              {currentLanguage === "ar"
                ? "لا توجد مراجعات بعد"
                : "No reviews yet"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              {currentLanguage === "ar"
                ? "كن أول من يشارك تجربته مع هذا القالب"
                : "Be the first to share your experience with this template"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Review Form */}
      {user && (
        <Card id="review-form" className="border-2 scroll-mt-8">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl">
                  {reviewId
                    ? currentLanguage === "ar"
                      ? "تعديل المراجعة"
                      : "Edit Review"
                    : currentLanguage === "ar"
                    ? "اكتب مراجعة"
                    : "Write a Review"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {currentLanguage === "ar"
                    ? "شارك تجربتك مع هذا القالب"
                    : "Share your experience with this template"}
                </CardDescription>
              </div>
              {reviewId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-muted-foreground"
                  disabled={isSubmitting}
                  aria-label={
                    currentLanguage === "ar" ? "إلغاء التعديل" : "Cancel edit"
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6 pt-0">
            {/* Rating */}
            <div>
              <label className="text-sm font-medium mb-2 sm:mb-3 block">
                {currentLanguage === "ar" ? "التقييم" : "Rating"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center gap-1 sm:gap-2">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNewRating(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Rate ${i + 1} stars`}
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`h-6 w-6 sm:h-7 sm:w-7 transition-colors ${
                        i < displayRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
                {displayRating > 0 && (
                  <span className="ml-2 text-xs sm:text-sm text-muted-foreground">
                    {displayRating}{" "}
                    {currentLanguage === "ar"
                      ? displayRating === 1
                        ? "نجمة"
                        : "نجوم"
                      : displayRating === 1
                      ? "star"
                      : "stars"}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="review-comment"
                className="text-sm font-medium mb-2 sm:mb-3 block"
              >
                {currentLanguage === "ar" ? "التعليق" : "Comment"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                id="review-comment"
                placeholder={
                  currentLanguage === "ar"
                    ? "اكتب مراجعتك هنا... (10 أحرف على الأقل)"
                    : "Write your review here... (minimum 10 characters)"
                }
                value={newReview}
                onChange={handleReviewChange}
                rows={4}
                className="resize-none text-sm sm:text-base"
                disabled={isSubmitting}
                aria-describedby="character-count"
              />
              <p
                id="character-count"
                className={`text-xs mt-1.5 ${
                  newReview.length > 1000
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {newReview.length} / 1000{" "}
                {currentLanguage === "ar" ? "حرف" : "characters"}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={
                  !newRating ||
                  !newReview.trim() ||
                  isSubmitting ||
                  newReview.length > 1000 ||
                  newReview.trim().length < 10
                }
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentLanguage === "ar"
                      ? "جاري الإرسال..."
                      : "Submitting..."}
                  </>
                ) : reviewId ? (
                  currentLanguage === "ar" ? (
                    "تحديث المراجعة"
                  ) : (
                    "Update Review"
                  )
                ) : currentLanguage === "ar" ? (
                  "إرسال المراجعة"
                ) : (
                  "Submit Review"
                )}
              </Button>
              {reviewId && (
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  size="lg"
                  disabled={isSubmitting}
                  className="text-sm sm:text-base"
                >
                  {currentLanguage === "ar" ? "إلغاء" : "Cancel"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
