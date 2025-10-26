import { CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FeatureCardProps } from "@/types/index.types";
import { getChartGradientVar } from "@/handlers/index.handlers";

function StatCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon;
  const gradientVar = getChartGradientVar(feature.gradient);

  return (
    <Card
      className="group relative pt-6"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* 1. Gradient Glow on Hover: FIX - Use inline style for gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10"
        aria-hidden="true"
        style={{ backgroundImage: gradientVar }}
      />

      <CardHeader>
        {/* 2. Icon Container: FIX - Use inline style for gradient background */}
        <div
          className="h-14 w-14 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ backgroundImage: gradientVar }}
        >
          <Icon className="h-7 w-7 text-white" aria-hidden="true" />
        </div>

        {/* 3. Title: FIX - Use inline style for gradient on hover/clip */}
        <CardTitle
          // Text color defaults to foreground, changes to gradient clip on hover
          className="text-xl font-black text-foreground group-hover:text-transparent bg-clip-text transition-all duration-300"
          style={{
            // Apply the gradient as a background image only on hover
            backgroundImage: gradientVar,
          }}
        >
          {feature.title}
        </CardTitle>
      </CardHeader>

      {/* Description */}
      <CardDescription>{feature.description}</CardDescription>

      <CardContent>
        {/* Benefits List */}
        <ul className="space-y-2" role="list">
          {feature.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-xs">
              {/* FIX: Check icon uses theme secondary color */}
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary"
                aria-hidden="true"
              />
              {/* FIX: Benefit text uses muted-foreground */}
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10`}
        // FIX: Use inline style for gradient glow effect
        style={{ backgroundImage: gradientVar }}
        aria-hidden="true"
      />
    </Card>
  );
}

export default StatCard;
