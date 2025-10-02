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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Save,
  Upload,
  Settings,
  Globe,
  Mail,
  CreditCard,
  Users,
} from "lucide-react";

export function SettingsGeneral() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Developer Portfolio",
    siteDescription: "Professional developer portfolio and template store",
    logo: "/placeholder.svg?height=80&width=80",
    favicon: "/placeholder.svg?height=32&width=32",
    defaultLanguage: "en",
    defaultCurrency: "USD",
    timezone: "UTC",
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("[v0] General settings saved:", generalSettings);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setGeneralSettings((prev) => ({ ...prev, [field]: value }));
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

      <Tabs value="general" className="space-y-6">
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

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Site Information */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Site Information", "admin.settings.siteInfo")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Basic information about your website",
                      "admin.settings.siteInfoDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">
                      {t("Site Name", "admin.settings.siteName")}
                    </Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        handleInputChange("siteName", e.target.value)
                      }
                      placeholder={t(
                        "Enter site name",
                        "admin.settings.enterSiteName"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">
                      {t("Site Description", "admin.settings.siteDescription")}
                    </Label>
                    <Input
                      id="siteDescription"
                      value={generalSettings.siteDescription}
                      onChange={(e) =>
                        handleInputChange("siteDescription", e.target.value)
                      }
                      placeholder={t(
                        "Enter site description",
                        "admin.settings.enterSiteDescription"
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Localization */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Localization", "admin.settings.localization")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Configure language and regional settings",
                      "admin.settings.localizationDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage">
                        {t(
                          "Default Language",
                          "admin.settings.defaultLanguage"
                        )}
                      </Label>
                      <Select
                        value={generalSettings.defaultLanguage}
                        onValueChange={(value) =>
                          handleInputChange("defaultLanguage", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "Select language",
                              "admin.settings.selectLanguage"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">
                        {t(
                          "Default Currency",
                          "admin.settings.defaultCurrency"
                        )}
                      </Label>
                      <Select
                        value={generalSettings.defaultCurrency}
                        onValueChange={(value) =>
                          handleInputChange("defaultCurrency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "Select currency",
                              "admin.settings.selectCurrency"
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">
                      {t("Timezone", "admin.settings.timezone")}
                    </Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) =>
                        handleInputChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select timezone",
                            "admin.settings.selectTimezone"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Site Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Site Settings", "admin.settings.siteSettings")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Configure site behavior and access",
                      "admin.settings.siteSettingsDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {t(
                          "Maintenance Mode",
                          "admin.settings.maintenanceMode"
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Temporarily disable site access for maintenance",
                          "admin.settings.maintenanceModeDesc"
                        )}
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        handleInputChange("maintenanceMode", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {t(
                          "Allow Registration",
                          "admin.settings.allowRegistration"
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Allow new users to register accounts",
                          "admin.settings.allowRegistrationDesc"
                        )}
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.allowRegistration}
                      onCheckedChange={(checked) =>
                        handleInputChange("allowRegistration", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {t(
                          "Require Email Verification",
                          "admin.settings.requireEmailVerification"
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Require users to verify their email before accessing the site",
                          "admin.settings.requireEmailVerificationDesc"
                        )}
                      </p>
                    </div>
                    <Switch
                      checked={generalSettings.requireEmailVerification}
                      onCheckedChange={(checked) =>
                        handleInputChange("requireEmailVerification", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Logo & Branding */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("Logo & Branding", "admin.settings.logoBranding")}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      "Upload your site logo and favicon",
                      "admin.settings.logoBrandingDesc"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>{t("Site Logo", "admin.settings.siteLogo")}</Label>
                      <div className="mt-2 flex flex-col items-center space-y-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={generalSettings.logo || "/placeholder.svg"}
                            alt="Site Logo"
                          />
                          <AvatarFallback>Logo</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          {t("Upload Logo", "admin.settings.uploadLogo")}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>{t("Favicon", "admin.settings.favicon")}</Label>
                      <div className="mt-2 flex flex-col items-center space-y-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={generalSettings.favicon || "/placeholder.svg"}
                            alt="Favicon"
                          />
                          <AvatarFallback>Fav</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          {t("Upload Favicon", "admin.settings.uploadFavicon")}
                        </Button>
                      </div>
                    </div>
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
