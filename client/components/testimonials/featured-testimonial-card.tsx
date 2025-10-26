import { TestimonialCardProps } from "@/types/index.types";
import { Calendar, Quote, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { getChartGradientVar } from "@/handlers/index.handlers";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { StarRating } from "../star-rating";

function FeaturedTestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="group relative pt-6 overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      {/* Decorative Quote Icon - Uses primary color with low opacity */}
      <Quote className="absolute top-4 right-4 w-12 h-12 text-primary/10 group-hover:text-primary/20 transition-colors" />

      {/* Gradient Accent Border - Uses chart gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundImage: getChartGradientVar("chart-1") }}
      />

      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar with ring - Uses primary ring color */}
          <Avatar className="w-16 h-16 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all">
            <AvatarImage
              src={testimonial.avatar || "/placeholder.svg"}
              alt={testimonial.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Client Name - Uses foreground color */}
            <h3 className="font-bold text-lg text-foreground mb-1">
              {testimonial.name}
            </h3>

            {/* Role and Company - Uses muted-foreground */}
            <p className="text-sm text-muted-foreground mb-3">
              {testimonial.role} at{" "}
              <span className="font-semibold text-foreground">
                {testimonial.company}
              </span>
            </p>

            {/* Rating and Project Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <StarRating rating={testimonial.rating} size="md" />
              <Badge className="text-xs font-semibold bg-muted/50 border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                {testimonial.project}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Testimonial Text - Uses foreground color */}
        <blockquote className="text-base leading-relaxed text-foreground mb-4 italic">
          "{testimonial.quote}"
        </blockquote>

        {/* Case Study Section - Only shown if caseStudy data exists */}
        {testimonial.caseStudy && (
          <div className="mt-6 space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
            <h4 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full" />
              Case Study Highlights
            </h4>

            <div className="space-y-2">
              {/* Problem */}
              <div className="flex gap-3">
                <Target className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Challenge
                  </p>
                  <p className="text-sm text-foreground">
                    {testimonial.caseStudy.problem}
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="flex gap-3">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Solution
                  </p>
                  <p className="text-sm text-foreground">
                    {testimonial.caseStudy.solution}
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="flex gap-3">
                <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Results
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    {testimonial.caseStudy.result}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date - Uses muted-foreground with calendar icon */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
          <Calendar className="w-4 h-4" />
          {testimonial.date}
        </div>
      </CardContent>

      {/* Hover Glow Effect - Uses primary gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundImage: getChartGradientVar("chart-1") }}
      />
    </Card>
  );
}

export default FeaturedTestimonialCard;
