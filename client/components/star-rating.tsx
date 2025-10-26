import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { StarRatingProps } from "@/types/index.types";

export const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  animated = true,
  interactive = false,
  onRatingChange,
  className,
  variant = "default",
  ratingsCount = 0,
}: StarRatingProps) => {
  // Size configurations
  const sizeClasses = {
    xs: "w-2.5 h-2.5",
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  // Variant styles
  const variantStyles = {
    default: {
      filled: "fill-secondary text-secondary",
      empty: "text-muted-foreground/30",
      half: "fill-secondary text-secondary",
    },
    gradient: {
      filled: "fill-amber-400 text-amber-400",
      empty: "text-muted-foreground/20",
      half: "fill-amber-400 text-amber-400",
    },
    outlined: {
      filled: "fill-transparent text-secondary stroke-secondary stroke-2",
      empty:
        "fill-transparent text-muted-foreground/30 stroke-muted-foreground/30 stroke-2",
      half: "fill-transparent text-secondary stroke-secondary stroke-2",
    },
  };

  const styles = variantStyles[variant];

  // Normalize rating to be within bounds
  const normalizedRating = Math.max(0, Math.min(maxRating, rating));

  // Handle star click
  const handleStarClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  // Handle star hover for interactive mode
  const handleStarHover = (index: number) => {
    if (interactive) {
      // Could add hover preview logic here
    }
  };

  // Render individual star
  const renderStar = (index: number) => {
    const starValue = index + 1;
    const difference = normalizedRating - index;

    // Full star
    if (difference >= 1) {
      return (
        <Star
          key={index}
          className={cn(
            sizeClasses[size],
            styles.filled,
            animated && "transition-all duration-300",
            interactive && "cursor-pointer hover:scale-110",
            className
          )}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          style={
            animated
              ? {
                  animationDelay: `${index * 50}ms`,
                }
              : undefined
          }
        />
      );
    }

    // Half star
    if (difference > 0 && difference < 1) {
      return (
        <div key={index} className="relative inline-block">
          {/* Empty star background */}
          <Star
            className={cn(
              sizeClasses[size],
              styles.empty,
              animated && "transition-all duration-300"
            )}
          />
          {/* Half-filled star overlay */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${difference * 100}%` }}
          >
            <Star
              className={cn(
                sizeClasses[size],
                styles.half,
                animated && "transition-all duration-300"
              )}
            />
          </div>
        </div>
      );
    }

    // Empty star
    return (
      <Star
        key={index}
        className={cn(
          sizeClasses[size],
          styles.empty,
          animated && "transition-all duration-300",
          interactive &&
            "cursor-pointer hover:scale-110 hover:text-secondary/50",
          className
        )}
        onClick={() => handleStarClick(index)}
        onMouseEnter={() => handleStarHover(index)}
        style={
          animated
            ? {
                animationDelay: `${index * 50}ms`,
              }
            : undefined
        }
      />
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Stars Container */}
      <div
        className={cn(
          "flex items-center gap-0.5",
          animated && "animate-in fade-in slide-in-from-left-2 duration-500"
        )}
        role="img"
        aria-label={`Rating: ${normalizedRating} out of ${maxRating} stars`}
      >
        {[...Array(maxRating)].map((_, i) => renderStar(i))}
      </div>

      {/* Rating Value */}
      {showValue && (
        <span
          className={cn(
            "font-semibold text-foreground tabular-nums",
            textSizeClasses[size],
            animated &&
              "animate-in fade-in slide-in-from-right-2 duration-500 delay-100"
          )}
        >
          {normalizedRating.toFixed(1)}
        </span>
      )}

      {ratingsCount && (
        <span className="text-sm font-semibold text-muted-foreground">
          ({ratingsCount} reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
