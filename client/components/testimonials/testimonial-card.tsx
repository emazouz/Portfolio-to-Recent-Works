import { Card, CardContent, CardHeader } from "../ui/card";
import { Quote, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { StarRating } from "../star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TestimonialCardProps } from "@/types/index.types";

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="group pt-6 relative h-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Quote Icon - Smaller for compact cards */}
      <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/10 group-hover:text-primary/20 transition-colors" />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {/* Smaller Avatar */}
          <Avatar className="w-12 h-12 ring-2 ring-border group-hover:ring-primary/50 transition-all">
            <AvatarImage
              src={testimonial.avatar || "/placeholder.svg"}
              alt={testimonial.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate">
              {testimonial.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {testimonial.role} at{" "}
              <span className="font-semibold text-foreground">
                {testimonial.company}
              </span>
            </p>
            <div className="mt-1">
              <StarRating rating={testimonial.rating} size="sm" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Truncated testimonial text */}
        <blockquote className="text-sm leading-relaxed text-muted-foreground mb-3 line-clamp-4 italic">
          "{testimonial.quote}"
        </blockquote>

        {/* Case Study Section - Compact version for regular cards */}
        {testimonial.caseStudy && (
          <div className="mb-3 p-3 bg-muted/20 rounded-md border border-border/50">
            <div className="space-y-2">
              {/* Problem - Compact */}
              <div className="flex gap-2">
                <Target className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground line-clamp-1">
                  <span className="font-semibold">Challenge:</span>{" "}
                  {testimonial.caseStudy.problem}
                </p>
              </div>

              {/* Solution - Compact */}
              <div className="flex gap-2">
                <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground line-clamp-1">
                  <span className="font-semibold">Solution:</span>{" "}
                  {testimonial.caseStudy.solution}
                </p>
              </div>

              {/* Result - Compact */}
              <div className="flex gap-2">
                <TrendingUp className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-foreground font-medium line-clamp-1">
                  <span className="font-semibold">Results:</span>{" "}
                  {testimonial.caseStudy.result}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer with project and date */}
        <div className="flex items-center justify-between gap-2">
          <Badge className="text-xs bg-muted/50 border border-border text-muted-foreground">
            {testimonial.project}
          </Badge>
          <p className="text-xs text-muted-foreground">{testimonial.date}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestimonialCard;
