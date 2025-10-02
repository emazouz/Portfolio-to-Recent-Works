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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Layers,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Star,
  DollarSign,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Mock data for admin dashboard
const dashboardStats = {
  totalTemplates: 24,
  totalProjects: 12,
  totalBlogs: 18,
  activeUsers: 1247,
  recentOrders: 89,
  totalDownloads: 3456,
  monthlyRevenue: 12450,
  totalViews: 45678,
};

const recentTemplates = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    category: "Admin",
    downloads: 234,
    rating: 4.8,
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    title: "SaaS Landing Page",
    category: "Landing",
    downloads: 189,
    rating: 4.9,
    createdAt: "2025-01-12",
  },
  {
    id: 3,
    title: "Portfolio Template",
    category: "Portfolio",
    downloads: 156,
    rating: 4.7,
    createdAt: "2025-01-10",
  },
];

const recentOrders = [
  {
    id: 1,
    user: "John Doe",
    template: "E-commerce Dashboard",
    price: 49,
    status: "completed",
    date: "2025-01-15",
  },
  {
    id: 2,
    user: "Jane Smith",
    template: "SaaS Landing Page",
    price: 29,
    status: "pending",
    date: "2025-01-14",
  },
  {
    id: 3,
    user: "Mike Johnson",
    template: "Portfolio Template",
    price: 19,
    status: "completed",
    date: "2025-01-13",
  },
];

const allUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    registeredAt: "2024-12-01",
    lastLogin: "2025-01-15",
    active: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    registeredAt: "2024-11-15",
    lastLogin: "2025-01-14",
    active: true,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "user",
    registeredAt: "2024-10-20",
    lastLogin: "2025-01-10",
    active: false,
  },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("Admin Dashboard")}</h1>
        <p className="text-muted-foreground">
          {t("Manage your entire platform content and users")}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="templates">{t("Templates")}</TabsTrigger>
          <TabsTrigger value="projects">{t("Projects")}</TabsTrigger>
          <TabsTrigger value="blogs">{t("Blogs")}</TabsTrigger>
          <TabsTrigger value="users">{t("Users")}</TabsTrigger>
          <TabsTrigger value="orders">{t("Orders")}</TabsTrigger>
          <TabsTrigger value="settings">{t("Settings")}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Total Templates")}
                </CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalTemplates}
                </div>
                <p className="text-xs text-muted-foreground">
                  +2 {t("from last month")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Active Users")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.activeUsers}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% {t("from last month")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Monthly Revenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardStats.monthlyRevenue}
                </div>
                <p className="text-xs text-muted-foreground">
                  +8% {t("from last month")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("Total Downloads")}
                </CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalDownloads}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% {t("from last month")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Recent Templates")}</CardTitle>
                <CardDescription>
                  {t("Latest templates added to the platform")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{template.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.category} • {template.downloads} downloads
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{template.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Recent Orders")}</CardTitle>
                <CardDescription>
                  {t("Latest template purchases")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{order.user}</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.template}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                        <span className="font-semibold">${order.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Templates Management Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("Templates Management")}</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Template")}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("All Templates")}</CardTitle>
              <CardDescription>
                {t("Manage your template collection")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{template.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.category} • {template.downloads} downloads •{" "}
                        {template.rating} rating
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {template.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        {t("View")}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("Delete")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Management Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("Projects Management")}</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Project")}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("All Projects")}</CardTitle>
              <CardDescription>
                {t("Manage your project portfolio")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {t("Projects management interface will be displayed here")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blog Management Tab */}
        <TabsContent value="blogs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("Blog Management")}</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Article")}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("All Articles")}</CardTitle>
              <CardDescription>{t("Manage your blog content")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                {t("Blog management interface will be displayed here")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("User Management")}</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("All Users")}</CardTitle>
              <CardDescription>
                {t("Manage platform users and permissions")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Registered: {user.registeredAt} • Last login:{" "}
                          {user.lastLogin}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      <Badge variant={user.active ? "default" : "destructive"}>
                        {user.active ? "Active" : "Inactive"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Management Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("Orders Management")}</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("All Orders")}</CardTitle>
              <CardDescription>
                {t("Track and manage template purchases")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{order.user}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.template}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Order date: {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          order.status === "completed" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="font-semibold">${order.price}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          {t("View")}
                        </Button>
                        {order.status === "completed" && (
                          <Button size="sm" variant="outline">
                            {t("Refund")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t("Platform Settings")}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Site Configuration")}</CardTitle>
                <CardDescription>
                  {t("Manage global site settings")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("Default Language")}</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("Default Currency")}</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t("Dark Mode Default")}</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Payment Settings")}</CardTitle>
                <CardDescription>
                  {t("Configure payment gateways")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t("Stripe Integration")}</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t("PayPal Integration")}</Label>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label>{t("Commission Rate (%)")}</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
