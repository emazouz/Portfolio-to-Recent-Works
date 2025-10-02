"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Settings,
  Globe,
  Mail,
  CreditCard,
  Users,
  Upload,
} from "lucide-react";

export function SettingsSEO() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Developer Portfolio - Professional Templates & Projects",
    metaDescription:
      "Discover premium developer templates, showcase projects, and read insightful blog posts. Professional portfolio platform for developers.",
    metaKeywords:
      "developer, portfolio, templates, projects, blog, web development",
    ogTitle: "Developer Portfolio",
    ogDescription: "Professional developer portfolio and template store",
    ogImage: "/placeholder.svg?height=630&width=1200",
    twitterCard: "summary_large_image",
    twitterSite: "@yourhandle",
    googleAnalyticsId: "GA-XXXXXXXXX",
    googleSearchConsole: "",
    facebookPixelId: "",
    structuredDataEnabled: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("[v0] SEO settings saved:", seoSettings);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSeoSettings((prev) => ({ ...prev, [field]: value }));
  };

  const settingsTabs = [
    {
      value: "general",
      label: t("General", "admin.settings.general"),
      icon: Settings,
      href: "/admin/settings",
    },
    {
      value: "seo",
      label: t("SEO", "admin.settings.seo"),
      icon: Globe,
      href: "/admin/settings/seo",
    },
    {
      value: "payments",
      label: t("Payments", "admin.settings.payments"),
      icon: CreditCard,
      href: "/admin/settings/payments",
    },
    {
      value: "email",
      label: t("Email", "admin.settings.email"),
      icon: Mail,
      href: "/admin/settings/email",
    },
    {
      value: "roles",
      label: t("Roles", "admin.settings.roles"),
      icon: Users,
      href: "/admin/settings/roles",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("Settings", "admin.settings.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("Manage your platform settings", "admin.settings.subtitle")}
        </p>
      </div>

      <Tabs value="seo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {settingsTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link href={tab.href} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="seo" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Meta Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Meta Tags", "admin.settings.metaTags")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Configure default meta tags for SEO",
                      "admin.settings.metaTagsDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">
                      {t("Meta Title", "admin.settings.metaTitle")}
                    </Label>
                    <Input
                      id="metaTitle"
                      value={seoSettings.metaTitle}
                      onChange={(e) =>
                        handleInputChange("metaTitle", e.target.value)
                      }
                      placeholder={t(
                        "Enter meta title",
                        "admin.settings.enterMetaTitle"
                      )}
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoSettings.metaTitle.length}/60{" "}
                      {t("characters", "admin.settings.characters")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">
                      {t("Meta Description", "admin.settings.metaDescription")}
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={seoSettings.metaDescription}
                      onChange={(e) =>
                        handleInputChange("metaDescription", e.target.value)
                      }
                      placeholder={t(
                        "Enter meta description",
                        "admin.settings.enterMetaDescription"
                      )}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoSettings.metaDescription.length}/160{" "}
                      {t("characters", "admin.settings.characters")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">
                      {t("Meta Keywords", "admin.settings.metaKeywords")}
                    </Label>
                    <Input
                      id="metaKeywords"
                      value={seoSettings.metaKeywords}
                      onChange={(e) =>
                        handleInputChange("metaKeywords", e.target.value)
                      }
                      placeholder={t(
                        "Enter keywords separated by commas",
                        "admin.settings.enterKeywords"
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Open Graph */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Open Graph", "admin.settings.openGraph")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Configure Open Graph tags for social media sharing",
                      "admin.settings.openGraphDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">
                      {t("OG Title", "admin.settings.ogTitle")}
                    </Label>
                    <Input
                      id="ogTitle"
                      value={seoSettings.ogTitle}
                      onChange={(e) =>
                        handleInputChange("ogTitle", e.target.value)
                      }
                      placeholder={t(
                        "Enter Open Graph title",
                        "admin.settings.enterOgTitle"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogDescription">
                      {t("OG Description", "admin.settings.ogDescription")}
                    </Label>
                    <Textarea
                      id="ogDescription"
                      value={seoSettings.ogDescription}
                      onChange={(e) =>
                        handleInputChange("ogDescription", e.target.value)
                      }
                      placeholder={t(
                        "Enter Open Graph description",
                        "admin.settings.enterOgDescription"
                      )}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Twitter Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Twitter Cards", "admin.settings.twitterCards")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Configure Twitter card settings",
                      "admin.settings.twitterCardsDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitterCard">
                      {t("Twitter Card Type", "admin.settings.twitterCardType")}
                    </Label>
                    <Input
                      id="twitterCard"
                      value={seoSettings.twitterCard}
                      onChange={(e) =>
                        handleInputChange("twitterCard", e.target.value)
                      }
                      placeholder="summary_large_image"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterSite">
                      {t("Twitter Handle", "admin.settings.twitterHandle")}
                    </Label>
                    <Input
                      id="twitterSite"
                      value={seoSettings.twitterSite}
                      onChange={(e) =>
                        handleInputChange("twitterSite", e.target.value)
                      }
                      placeholder="@yourhandle"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Analytics & Tracking", "admin.settings.analytics")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Configure analytics and tracking codes",
                      "admin.settings.analyticsDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalyticsId">
                      {t(
                        "Google Analytics ID",
                        "admin.settings.googleAnalyticsId"
                      )}
                    </Label>
                    <Input
                      id="googleAnalyticsId"
                      value={seoSettings.googleAnalyticsId}
                      onChange={(e) =>
                        handleInputChange("googleAnalyticsId", e.target.value)
                      }
                      placeholder="GA-XXXXXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="googleSearchConsole">
                      {t(
                        "Google Search Console",
                        "admin.settings.googleSearchConsole"
                      )}
                    </Label>
                    <Textarea
                      id="googleSearchConsole"
                      value={seoSettings.googleSearchConsole}
                      onChange={(e) =>
                        handleInputChange("googleSearchConsole", e.target.value)
                      }
                      placeholder={t(
                        "Paste verification meta tag",
                        "admin.settings.pasteVerificationTag"
                      )}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookPixelId">
                      {t("Facebook Pixel ID", "admin.settings.facebookPixelId")}
                    </Label>
                    <Input
                      id="facebookPixelId"
                      value={seoSettings.facebookPixelId}
                      onChange={(e) =>
                        handleInputChange("facebookPixelId", e.target.value)
                      }
                      placeholder="XXXXXXXXXXXXXXX"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* OG Image */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Default OG Image", "admin.settings.defaultOgImage")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Upload default Open Graph image",
                      "admin.settings.defaultOgImageDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="aspect-[1200/630] bg-muted rounded-lg overflow-hidden">
                      <img
                        src={seoSettings.ogImage || "/placeholder.svg"}
                        alt="OG Image Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {t("Upload OG Image", "admin.settings.uploadOgImage")}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "Recommended size: 1200x630 pixels",
                        "admin.settings.ogImageSize"
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading
                ? t("Saving...", "common.saving")
                : t("Save Changes", "admin.settings.saveChanges")}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
