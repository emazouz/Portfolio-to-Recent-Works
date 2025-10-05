import { useEffect, useState } from "react";
import {
  Eye,
  Download,
  Star,
  TrendingUp,
  Package,
  DollarSign,
  Activity,
  Sparkles,
  Archive,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCard from "../StatCard";
import { formatDate } from "@/utils/dateHelpers";
import { templateStore } from "@/store/templateStore";
import { toast } from "@/hooks/use-toast";
import { TemplateAnalyticsType } from "@/types/TemplateType";
import Loader from "../ui/Loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";

export default function TemplateAnalyticsDashboard() {
  const { getAnalytics, isLoading } = templateStore();
  const [data, setData] = useState<TemplateAnalyticsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplateAnalytics = async () => {
      try {
        const result = await getAnalytics();

        if (!result.success) {
          const errorMessage =
            result.message || "Failed to fetch analytics data";
          toast({
            title: "Error",
            description: errorMessage,
            variant: "error",
          });
          setError(errorMessage);
          return;
        }

        setData(result.data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Error fetching analytics:", err);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "error",
        });
        setError(errorMessage);
      }
    };

    fetchTemplateAnalytics();
  }, [getAnalytics]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-4">
        <Alert variant={"destructive"} className="max-w-md">
          <AlertTitle>Failed to load analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 p-4">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No analytics data</h3>
          <p className="text-muted-foreground mt-2">
            No analytics data available to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Activity className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Template Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time insights into your marketplace performance
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            label="Total Templates"
            value={data?.overview?.totalTemplates}
            color="#3b82f6"
            subtitle="Active in marketplace"
          />
          <StatCard
            icon={Eye}
            label="Total Views"
            value={data.overview.totalViews}
            color="#10b981"
            trend={{ value: 8.2, isPositive: true }}
            subtitle="Last 30 days"
          />
          <StatCard
            icon={Download}
            label="Total Downloads"
            value={data.overview.totalDownloads}
            color="#f59e0b"
            subtitle="All time"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`$${data.overview.totalRevenue}`}
            color="#8b5cf6"
            subtitle="Total earnings"
          />
        </div>

        {/* Secondary Stats with Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-green-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp
                    className="text-green-500"
                    size={24}
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="font-semibold text-lg">Active Templates</h3>
              </div>
              <p className="text-4xl font-bold text-green-500 mb-2">
                {data.overview.activeTemplates}
              </p>
              <p className="text-sm text-muted-foreground">
                Out of {data.overview.totalTemplates} total templates
              </p>
              <div className="mt-4 h-1 bg-green-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{
                    width: `${
                      (data.overview.activeTemplates /
                        data.overview.totalTemplates) *
                      100
                    }%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-yellow-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles
                    className="text-yellow-500"
                    size={24}
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="font-semibold text-lg">Featured</h3>
              </div>
              <p className="text-4xl font-bold text-yellow-500 mb-2">
                {data.overview.featuredTemplates}
              </p>
              <p className="text-sm text-muted-foreground">
                Premium showcase templates
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`${
                      i < data.overview.featuredTemplates
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted"
                    }`}
                    size={16}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-muted">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-muted rounded-xl group-hover:scale-110 transition-transform">
                  <Archive
                    className="text-muted-foreground"
                    size={24}
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="font-semibold text-lg">Inactive</h3>
              </div>
              <p className="text-4xl font-bold text-muted-foreground mb-2">
                {data.overview.inactiveTemplates}
              </p>
              <p className="text-sm text-muted-foreground">
                Archived or draft templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* Top Performing Templates */}
          <Card className="border-2 hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Star className="text-purple-500" size={18} />
                </div>
                <div>
                  <CardTitle className="text-xl">Top Performing</CardTitle>
                  <CardDescription className="text-xs">
                    Best templates by engagement metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data.topPerformingTemplates.map((template, index) => (
                  <div
                    key={template.id}
                    className="group relative border-l-4 border-blue-500 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent p-5 rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-lg">
                            {template.title_en}
                          </h4>
                          {template.rating > 4 && (
                            <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                              Hot
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full">
                            <Eye size={14} className="text-green-500" />
                            <span className="font-medium">
                              {template.views}
                            </span>{" "}
                            views
                          </span>
                          <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full">
                            <Download size={14} className="text-blue-500" />
                            <span className="font-medium">
                              {template.downloads}
                            </span>{" "}
                            downloads
                          </span>
                          <span className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full">
                            <Star size={14} className="text-yellow-500" />
                            <span className="font-medium">
                              {template.rating}
                            </span>{" "}
                            rating
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                          #{index + 1}
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          Rank
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently Added Templates */}
        <Card className="border-2 hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="text-green-500" size={18} />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Recently Added Templates
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest additions to your marketplace
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="font-semibold">Template</TableHead>
                  <TableHead className="font-semibold">Date Added</TableHead>
                  <TableHead className="text-center font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Featured
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recentlyAdded.map((template) => (
                  <TableRow
                    key={template.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        {template.title_en}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {formatDate(template.createdAt)}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <Badge
                        variant={template.isActive ? "default" : "destructive"}
                        className="font-semibold"
                      >
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {template.featured ? (
                        <div className="inline-flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                          <Star
                            className="text-yellow-500 fill-yellow-500"
                            size={16}
                          />
                          <span className="text-xs font-medium text-yellow-600">
                            Featured
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
