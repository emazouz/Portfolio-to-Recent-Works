import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ComponentType<import("lucide-react").LucideProps>;
  label: string;
  value: string | number;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  color,
  trend,
  subtitle,
}) => {
  return (
    <Card
      className="relative overflow-hidden border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      style={{ borderLeftColor: color }}
    >
      {/* Background Gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-2xl rounded-full"
        style={{ backgroundColor: color }}
      />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          <div
            className="p-3 rounded-xl shadow-sm transition-transform duration-300 hover:scale-110"
            style={{
              backgroundColor: `${color}15`,
              boxShadow: `0 4px 12px ${color}20`,
            }}
          >
            <Icon size={24} style={{ color }} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
