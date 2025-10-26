import StarRating from "@/components/star-rating";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Star } from "lucide-react";

export const ReviewsTab = ({ profile, reviewFilter, setReviewFilter }: any) => {
  const filteredReviews =
    reviewFilter === "all"
      ? profile?.reviews || []
      : (profile?.reviews || []).filter(
          (r: any) => r.rating === parseInt(reviewFilter)
        );

  const calculateAverage = () => {
    if (!profile?.reviews?.length) return "N/A";
    const sum = profile.reviews.reduce(
      (acc: number, r: any) => acc + r.rating,
      0
    );
    return (sum / profile.reviews.length).toFixed(1);
  };

  const getRatingDist = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (profile?.reviews || []).forEach((r: any) => {
      dist[r.rating as keyof typeof dist]++;
    });
    return dist;
  };

  const dist = getRatingDist();

  return (
    <Card className="tab">
      <CardHeader>
        <CardTitle>My Reviews</CardTitle>
        <CardDescription>View and manage your product reviews</CardDescription>
      </CardHeader>
      <CardContent>
        {!profile?.reviews?.length ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-border mx-auto mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h3 className="font-bold text-lg mb-3">Rating Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{calculateAverage()} / 5</p>
                  <StarRating rating={parseFloat(calculateAverage()) || 0} />
                  <span className="text-sm text-muted-foreground">
                    ({profile.reviews.length} reviews)
                  </span>
                </div>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-4">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${
                              profile.reviews.length
                                ? (dist[star as keyof typeof dist] /
                                    profile.reviews.length) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right">
                        {dist[star as keyof typeof dist]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label>Filter:</Label>
              <Select value={reviewFilter} onValueChange={setReviewFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All ({profile.reviews.length})
                  </SelectItem>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <SelectItem key={star} value={String(star)}>
                      {star} Stars ({dist[star as keyof typeof dist]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredReviews.map((review: any) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-1">
                    {review?.project?.title_en || "Product"}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
