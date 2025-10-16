"use client";

import { useTranslation } from "@/hooks/use-translation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  FolderOpen,
  BookOpen,
  Users,
  TrendingUp,
  Eye,
  Download,
  Star,
} from "lucide-react";

export function AdminDashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      title: t("Total Templates", "admin.stats.templates"),
      value: "24",
      change: "+12%",
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: t("Total Projects", "admin.stats.projects"),
      value: "18",
      change: "+8%",
      changeType: "positive" as const,
      icon: FolderOpen,
    },
    {
      title: t("Blog Posts", "admin.stats.blogs"),
      value: "42",
      change: "+15%",
      changeType: "positive" as const,
      icon: BookOpen,
    },
    {
      title: t("Total Users", "admin.stats.users"),
      value: "1,234",
      change: "+23%",
      changeType: "positive" as const,
      icon: Users,
    },
  ];

  const recentActivity = [
    {
      type: "template",
      title: "Modern Dashboard Template",
      action: "purchased",
      user: "John Doe",
      time: "2 hours ago",
    },
    {
      type: "project",
      title: "E-commerce Platform",
      action: "viewed",
      user: "Jane Smith",
      time: "4 hours ago",
    },
    {
      type: "blog",
      title: "React Best Practices",
      action: "commented",
      user: "Mike Johnson",
      time: "6 hours ago",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("Dashboard", "admin.dashboard.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("Welcome to your admin dashboard", "admin.dashboard.subtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {stat.change}
                </span>{" "}
                {t("from last month", "admin.stats.period")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              {t("Recent Activity", "admin.activity.title")}
            </CardTitle>
            <CardDescription>
              {t("Latest user interactions", "admin.activity.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.type === "template" && (
                      <FileText className="h-4 w-4 text-blue-500" />
                    )}
                    {activity.type === "project" && (
                      <FolderOpen className="h-4 w-4 text-green-500" />
                    )}
                    {activity.type === "blog" && (
                      <BookOpen className="h-4 w-4 text-purple-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} by {activity.user}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("Quick Stats", "admin.quickstats.title")}</CardTitle>
            <CardDescription>
              {t("Overview metrics", "admin.quickstats.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Total Views", "admin.stats.views")}
                  </span>
                </div>
                <Badge variant="secondary">45,231</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Downloads", "admin.stats.downloads")}
                  </span>
                </div>
                <Badge variant="secondary">12,543</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Avg Rating", "admin.stats.rating")}
                  </span>
                </div>
                <Badge variant="secondary">4.8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("Revenue", "admin.stats.revenue")}
                  </span>
                </div>
                <Badge variant="secondary">$12,450</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <TemplateAnalyticsDashboard /> */}
    </div>
  );
}
