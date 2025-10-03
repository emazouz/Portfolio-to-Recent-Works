"use client";

import { useState } from "react";
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
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: {
      name: "Ahmed Hassan",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 5,
    comment:
      "Excellent template with clean code and great documentation. Highly recommended!",
    comment_ar: "قالب ممتاز مع كود نظيف ووثائق رائعة. أنصح به بشدة!",
    date: new Date("2025-01-10"),
    helpful: 12,
  },
  {
    id: 2,
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 4,
    comment:
      "Great design and easy to customize. Support team was very helpful.",
    comment_ar: "تصميم رائع وسهل التخصيص. فريق الدعم كان مفيداً جداً.",
    date: new Date("2025-01-08"),
    helpful: 8,
  },
  {
    id: 3,
    user: {
      name: "محمد علي",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    rating: 5,
    comment: "Perfect for my project needs. Well structured and modern design.",
    comment_ar: "مثالي لاحتياجات مشروعي. منظم جيداً وتصميم حديث.",
    date: new Date("2025-01-05"),
    helpful: 15,
  },
];

interface TemplateReviewsProps {
  templateId: number;
}

export function TemplateReviews({ templateId }: TemplateReviewsProps) {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const { currentLanguage } = useTranslation();

  const getLocalizedComment = (review: any) => {
    return currentLanguage === "ar" ? review.comment_ar : review.comment;
  };

  const handleSubmitReview = () => {
    // Handle review submission
    console.log("Submitting review:", {
      rating: newRating,
      comment: newReview,
    });
    setNewReview("");
    setNewRating(0);
  };

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8">
        {currentLanguage === "ar"
          ? "التقييمات والمراجعات"
          : "Reviews & Ratings"}
      </h2>

      {/* Reviews List */}
      <div className="space-y-6 mb-8">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user.avatar || "/placeholder.svg"}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{review.user.name}</h4>
                      {review.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          {currentLanguage === "ar" ? "مشتري موثق" : "Verified"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date.toLocaleDateString(
                          currentLanguage === "ar" ? "ar-SA" : "en-US"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {getLocalizedComment(review)}
              </p>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {currentLanguage === "ar" ? "مفيد" : "Helpful"} (
                  {review.helpful})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {currentLanguage === "ar" ? "رد" : "Reply"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentLanguage === "ar" ? "اكتب مراجعة" : "Write a Review"}
          </CardTitle>
          <CardDescription>
            {currentLanguage === "ar"
              ? "شارك تجربتك مع هذا القالب"
              : "Share your experience with this template"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {currentLanguage === "ar" ? "التقييم" : "Rating"}
            </label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setNewRating(i + 1)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < newRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {currentLanguage === "ar" ? "التعليق" : "Comment"}
            </label>
            <Textarea
              placeholder={
                currentLanguage === "ar"
                  ? "اكتب مراجعتك هنا..."
                  : "Write your review here..."
              }
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitReview}
            disabled={!newRating || !newReview.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentLanguage === "ar" ? "إرسال المراجعة" : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
