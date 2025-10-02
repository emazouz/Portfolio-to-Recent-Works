"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Download, CreditCard, User, Settings, LogOut, Star, MessageSquare, Folder } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/professional-man-avatar.png",
  joinDate: "2024-01-15",
  totalPurchases: 5,
  totalSpent: 187,
  totalComments: 12,
  totalProjects: 3,
}

const purchaseHistory = [
  {
    id: 1,
    templateName: "E-commerce Dashboard",
    price: 49,
    purchaseDate: "2025-01-10",
    downloadUrl: "#",
    status: "completed",
    downloadCount: 3,
  },
  {
    id: 2,
    templateName: "SaaS Landing Page",
    price: 29,
    purchaseDate: "2025-01-05",
    downloadUrl: "#",
    status: "completed",
    downloadCount: 1,
  },
  {
    id: 3,
    templateName: "Portfolio Template",
    price: 19,
    purchaseDate: "2024-12-28",
    downloadUrl: "#",
    status: "completed",
    downloadCount: 2,
  },
]

const userProjects = [
  {
    id: 1,
    title: "Personal Portfolio",
    status: "completed",
    technologies: ["React", "Next.js", "Tailwind"],
    liveUrl: "https://johndoe.dev",
    githubUrl: "https://github.com/johndoe/portfolio",
    createdAt: "2024-12-01",
  },
  {
    id: 2,
    title: "E-commerce Store",
    status: "in-progress",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "",
    githubUrl: "https://github.com/johndoe/ecommerce",
    createdAt: "2024-11-15",
  },
]

const userComments = [
  {
    id: 1,
    articleTitle: "Getting Started with React",
    comment: "Great article! Very helpful for beginners.",
    date: "2025-01-10",
    status: "approved",
  },
  {
    id: 2,
    articleTitle: "Advanced Next.js Patterns",
    comment: "Could you provide more examples on server components?",
    date: "2025-01-08",
    status: "pending",
  },
]

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("Dashboard")}</h1>
        <p className="text-muted-foreground">{t("Manage your account and access your purchased templates")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{userData.name}</h3>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {t("Premium Member")}
                </Badge>
              </div>

              <div className="space-y-2">
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <User className="mr-2 h-4 w-4" />
                  {t("Overview")}
                </Button>
                <Button
                  variant={activeTab === "templates" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("templates")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("My Templates")}
                </Button>
                <Button
                  variant={activeTab === "projects" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("projects")}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  {t("My Projects")}
                </Button>
                <Button
                  variant={activeTab === "comments" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("comments")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t("My Comments")}
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("Settings")}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("Sign Out")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("Templates")}</CardTitle>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.totalPurchases}</div>
                    <p className="text-xs text-muted-foreground">{t("Purchased")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("Total Spent")}</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${userData.totalSpent}</div>
                    <p className="text-xs text-muted-foreground">{t("Lifetime value")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("Projects")}</CardTitle>
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">{t("Created")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t("Comments")}</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userData.totalComments}</div>
                    <p className="text-xs text-muted-foreground">{t("Posted")}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Recent Purchases")}</CardTitle>
                    <CardDescription>{t("Your latest template downloads")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {purchaseHistory.slice(0, 3).map((purchase) => (
                        <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{purchase.templateName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t("Purchased on")} {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">${purchase.price}</span>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {t("Download")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("Recent Projects")}</CardTitle>
                    <CardDescription>{t("Your latest project updates")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userProjects.slice(0, 2).map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{project.title}</h4>
                            <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{project.technologies.join(", ")}</p>
                          <div className="flex gap-2">
                            {project.liveUrl && (
                              <Button size="sm" variant="outline">
                                {t("Live Demo")}
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              {t("GitHub")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("My Templates")}</CardTitle>
                  <CardDescription>{t("All your purchased templates and downloads")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {purchaseHistory.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{purchase.templateName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t("Purchased on")} {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("Downloaded")} {purchase.downloadCount} {t("times")}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {purchase.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">${purchase.price}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-2" />
                              {t("Review")}
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              {t("Download")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("My Projects")}</CardTitle>
                  <CardDescription>{t("Your personal and professional projects")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProjects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-lg">{project.title}</h4>
                          <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            <strong>{t("Technologies")}:</strong> {project.technologies.join(", ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>{t("Created")}:</strong> {new Date(project.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {project.liveUrl && (
                            <Button size="sm" variant="outline">
                              {t("Live Demo")}
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            {t("GitHub")}
                          </Button>
                          <Button size="sm" variant="outline">
                            {t("Edit")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("My Comments")}</CardTitle>
                  <CardDescription>{t("Your comments on blog articles")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userComments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{comment.articleTitle}</h4>
                          <Badge variant={comment.status === "approved" ? "default" : "secondary"}>
                            {comment.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{comment.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("Posted on")} {new Date(comment.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Account Settings")}</CardTitle>
                  <CardDescription>{t("Manage your account preferences and information")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">{t("Profile Information")}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{t("Full Name")}</Label>
                          <Input type="text" defaultValue={userData.name} className="mt-1" />
                        </div>
                        <div>
                          <Label>{t("Email")}</Label>
                          <Input type="email" defaultValue={userData.email} className="mt-1" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">{t("Preferences")}</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>{t("Email notifications for new templates")}</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>{t("Marketing emails and promotions")}</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>{t("SMS notifications")}</Label>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>{t("Dark mode")}</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button>{t("Save Changes")}</Button>
                      <Button variant="outline">{t("Cancel")}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
