"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Send,
  Settings,
  TestTube,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmailSettings {
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    encryption: "none" | "tls" | "ssl";
    fromName: string;
    fromEmail: string;
  };
  templates: {
    welcome: { subject: string; body: string };
    passwordReset: { subject: string; body: string };
    orderConfirmation: { subject: string; body: string };
    newsletter: { subject: string; body: string };
  };
  notifications: {
    newUser: boolean;
    newOrder: boolean;
    contactForm: boolean;
    systemAlerts: boolean;
  };
  limits: {
    dailyLimit: number;
    hourlyLimit: number;
    enabled: boolean;
  };
}

export function SettingsEmail() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<EmailSettings>({
    smtp: {
      host: "smtp.gmail.com",
      port: 587,
      username: "",
      password: "",
      encryption: "tls",
      fromName: "Your Company",
      fromEmail: "noreply@yourcompany.com",
    },
    templates: {
      welcome: {
        subject: "Welcome to Our Platform!",
        body: "Dear {{name}},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest regards,\nThe Team",
      },
      passwordReset: {
        subject: "Password Reset Request",
        body: "Dear {{name}},\n\nYou requested a password reset. Click the link below:\n{{resetLink}}\n\nIf you didn't request this, please ignore this email.",
      },
      orderConfirmation: {
        subject: "Order Confirmation #{{orderNumber}}",
        body: "Dear {{name}},\n\nThank you for your order! Your order #{{orderNumber}} has been confirmed.\n\nOrder Details:\n{{orderDetails}}\n\nThank you for your business!",
      },
      newsletter: {
        subject: "Newsletter - {{date}}",
        body: "Dear {{name}},\n\nHere's our latest newsletter with updates and news.\n\n{{content}}\n\nBest regards,\nThe Team",
      },
    },
    notifications: {
      newUser: true,
      newOrder: true,
      contactForm: true,
      systemAlerts: true,
    },
    limits: {
      dailyLimit: 1000,
      hourlyLimit: 100,
      enabled: true,
    },
  });

  const [testEmail, setTestEmail] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(
    null
  );

  const handleSave = async () => {
    try {
      // Save email settings
      toast({
        title: t("Success"),
        description: t("Email settings saved successfully"),
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to save email settings"),
        variant: "error",
      });
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return;

    setIsTesting(true);
    setTestResult(null);

    try {
      // Simulate test email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTestResult("success");
      toast({
        title: t("Test Email Sent"),
        description: "Test email sent successfully to {{email}}",
      });
    } catch (error) {
      setTestResult("error");
      toast({
        title: t("Test Failed"),
        description: t("Failed to send test email"),
        variant: "error",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-5 w-5" />
        <h2 className="text-2xl font-bold">{t("Email Settings")}</h2>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="smtp">{t("SMTP Configuration")}</TabsTrigger>
          <TabsTrigger value="templates">{t("Email Templates")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("Notifications")}</TabsTrigger>
          <TabsTrigger value="limits">{t("Limits & Testing")}</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t("SMTP Server Configuration")}
              </CardTitle>
              <CardDescription>
                {t("Configure your SMTP server settings for sending emails")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">{t("SMTP Host")}</Label>
                  <Input
                    id="smtp-host"
                    value={settings.smtp.host}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, host: e.target.value },
                      }))
                    }
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">{t("Port")}</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={settings.smtp.port}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        smtp: {
                          ...prev.smtp,
                          port: Number.parseInt(e.target.value),
                        },
                      }))
                    }
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-username">{t("Username")}</Label>
                  <Input
                    id="smtp-username"
                    value={settings.smtp.username}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, username: e.target.value },
                      }))
                    }
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">{t("Password")}</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={settings.smtp.password}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, password: e.target.value },
                      }))
                    }
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="encryption">{t("Encryption")}</Label>
                <Select
                  value={settings.smtp.encryption}
                  onValueChange={(value: "none" | "tls" | "ssl") =>
                    setSettings((prev) => ({
                      ...prev,
                      smtp: { ...prev.smtp, encryption: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("None")}</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-name">{t("From Name")}</Label>
                  <Input
                    id="from-name"
                    value={settings.smtp.fromName}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, fromName: e.target.value },
                      }))
                    }
                    placeholder="Your Company"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">{t("From Email")}</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={settings.smtp.fromEmail}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        smtp: { ...prev.smtp, fromEmail: e.target.value },
                      }))
                    }
                    placeholder="noreply@yourcompany.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Email Templates")}</CardTitle>
              <CardDescription>
                {t(
                  "Customize email templates for different actions. Use {{variable}} for dynamic content."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(settings.templates).map(([key, template]) => (
                <div key={key} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize">
                      {t(key.replace(/([A-Z])/g, " $1"))}
                    </h4>
                    <Badge variant="outline">{key}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${key}-subject`}>{t("Subject")}</Label>
                    <Input
                      id={`${key}-subject`}
                      value={template.subject}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            [key]: { ...template, subject: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`${key}-body`}>{t("Body")}</Label>
                    <Textarea
                      id={`${key}-body`}
                      value={template.body}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          templates: {
                            ...prev.templates,
                            [key]: { ...template, body: e.target.value },
                          },
                        }))
                      }
                      rows={6}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Email Notifications")}</CardTitle>
              <CardDescription>
                {t("Configure which events should trigger email notifications")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={key} className="text-base">
                      {t(key.replace(/([A-Z])/g, " $1"))}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        `Notify when ${key
                          .replace(/([A-Z])/g, " $1")
                          .toLowerCase()}`
                      )}
                    </p>
                  </div>
                  <Switch
                    id={key}
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          [key]: checked,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Email Limits")}</CardTitle>
                <CardDescription>
                  {t("Set limits to prevent spam and manage email usage")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="limits-enabled">{t("Enable Limits")}</Label>
                  <Switch
                    id="limits-enabled"
                    checked={settings.limits.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        limits: { ...prev.limits, enabled: checked },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daily-limit">{t("Daily Limit")}</Label>
                  <Input
                    id="daily-limit"
                    type="number"
                    value={settings.limits.dailyLimit}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        limits: {
                          ...prev.limits,
                          dailyLimit: Number.parseInt(e.target.value),
                        },
                      }))
                    }
                    disabled={!settings.limits.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly-limit">{t("Hourly Limit")}</Label>
                  <Input
                    id="hourly-limit"
                    type="number"
                    value={settings.limits.hourlyLimit}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        limits: {
                          ...prev.limits,
                          hourlyLimit: Number.parseInt(e.target.value),
                        },
                      }))
                    }
                    disabled={!settings.limits.enabled}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  {t("Test Email")}
                </CardTitle>
                <CardDescription>
                  {t("Send a test email to verify your configuration")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-email">{t("Test Email Address")}</Label>
                  <Input
                    id="test-email"
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                  />
                </div>

                <Button
                  onClick={handleTestEmail}
                  disabled={!testEmail || isTesting}
                  className="w-full"
                >
                  {isTesting ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-spin" />
                      {t("Sending...")}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t("Send Test Email")}
                    </>
                  )}
                </Button>

                {testResult && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      testResult === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {testResult === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">
                      {testResult === "success"
                        ? t("Test email sent successfully!")
                        : t(
                            "Failed to send test email. Check your configuration."
                          )}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          {t("Save Email Settings")}
        </Button>
      </div>
    </div>
  );
}
