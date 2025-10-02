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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Shield,
  Bell,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentSettings {
  stripe: {
    enabled: boolean;
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    testMode: boolean;
  };
  paypal: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    testMode: boolean;
  };
  razorpay: {
    enabled: boolean;
    keyId: string;
    keySecret: string;
    testMode: boolean;
  };
  general: {
    currency: string;
    taxRate: number;
    processingFee: number;
    minimumAmount: number;
    maximumAmount: number;
    autoCapture: boolean;
  };
  security: {
    fraudDetection: boolean;
    requireCvv: boolean;
    requireBillingAddress: boolean;
    allowSavedCards: boolean;
    sslRequired: boolean;
  };
  notifications: {
    paymentSuccess: boolean;
    paymentFailed: boolean;
    refundProcessed: boolean;
    chargebackAlert: boolean;
    emailReceipts: boolean;
  };
}

export function SettingsPayments() {
  const { t, isRTL } = useTranslation();
  const [settings, setSettings] = useState<PaymentSettings>({
    stripe: {
      enabled: true,
      publishableKey: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx",
      secretKey: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxx",
      webhookSecret: "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx",
      testMode: true,
    },
    paypal: {
      enabled: true,
      clientId:
        "AXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
      clientSecret:
        "EXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
      testMode: true,
    },
    razorpay: {
      enabled: false,
      keyId: "rzp_test_xxxxxxxxxxxxxxxxxx",
      keySecret: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
      testMode: true,
    },
    general: {
      currency: "USD",
      taxRate: 8.5,
      processingFee: 2.9,
      minimumAmount: 1,
      maximumAmount: 10000,
      autoCapture: true,
    },
    security: {
      fraudDetection: true,
      requireCvv: true,
      requireBillingAddress: false,
      allowSavedCards: true,
      sslRequired: true,
    },
    notifications: {
      paymentSuccess: true,
      paymentFailed: true,
      refundProcessed: true,
      chargebackAlert: true,
      emailReceipts: true,
    },
  });

  const [showSecrets, setShowSecrets] = useState({
    stripeSecret: false,
    stripeWebhook: false,
    paypalSecret: false,
    razorpaySecret: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const toggleSecret = (field: keyof typeof showSecrets) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const updateSettings = (
    section: keyof PaymentSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
    { value: "INR", label: "Indian Rupee (₹)" },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("Payment Settings")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {t(
                  "Configure payment gateways, security, and processing options"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge
              variant={settings.stripe.enabled ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {settings.stripe.enabled ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              Stripe {settings.stripe.enabled ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={settings.paypal.enabled ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {settings.paypal.enabled ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              PayPal {settings.paypal.enabled ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant={settings.razorpay.enabled ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {settings.razorpay.enabled ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
              Razorpay {settings.razorpay.enabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-xl" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 blur-xl" />
      </div>

      <Tabs defaultValue="gateways" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-12 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <TabsTrigger
            value="gateways"
            className="flex items-center gap-2 rounded-lg"
          >
            <CreditCard className="h-4 w-4" />
            {t("Payment Gateways")}
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 rounded-lg"
          >
            <Settings className="h-4 w-4" />
            {t("General")}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 rounded-lg"
          >
            <Shield className="h-4 w-4" />
            {t("Security")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 rounded-lg"
          >
            <Bell className="h-4 w-4" />
            {t("Notifications")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gateways" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Stripe</CardTitle>
                    <CardDescription>
                      {t("Accept credit cards, digital wallets, and more")}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={settings.stripe.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings("stripe", "enabled", checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stripe-publishable">
                    {t("Publishable Key")}
                  </Label>
                  <Input
                    id="stripe-publishable"
                    value={settings.stripe.publishableKey}
                    onChange={(e) =>
                      updateSettings("stripe", "publishableKey", e.target.value)
                    }
                    placeholder="pk_test_..."
                    disabled={!settings.stripe.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripe-secret">{t("Secret Key")}</Label>
                  <div className="relative">
                    <Input
                      id="stripe-secret"
                      type={showSecrets.stripeSecret ? "text" : "password"}
                      value={settings.stripe.secretKey}
                      onChange={(e) =>
                        updateSettings("stripe", "secretKey", e.target.value)
                      }
                      placeholder="sk_test_..."
                      disabled={!settings.stripe.enabled}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecret("stripeSecret")}
                    >
                      {showSecrets.stripeSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-webhook">{t("Webhook Secret")}</Label>
                <div className="relative">
                  <Input
                    id="stripe-webhook"
                    type={showSecrets.stripeWebhook ? "text" : "password"}
                    value={settings.stripe.webhookSecret}
                    onChange={(e) =>
                      updateSettings("stripe", "webhookSecret", e.target.value)
                    }
                    placeholder="whsec_..."
                    disabled={!settings.stripe.enabled}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleSecret("stripeWebhook")}
                  >
                    {showSecrets.stripeWebhook ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="stripe-test"
                  checked={settings.stripe.testMode}
                  onCheckedChange={(checked) =>
                    updateSettings("stripe", "testMode", checked)
                  }
                  disabled={!settings.stripe.enabled}
                />
                <Label htmlFor="stripe-test">{t("Test Mode")}</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                    <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">PayPal</CardTitle>
                    <CardDescription>
                      {t("Accept PayPal payments and digital wallets")}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={settings.paypal.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings("paypal", "enabled", checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paypal-client-id">{t("Client ID")}</Label>
                  <Input
                    id="paypal-client-id"
                    value={settings.paypal.clientId}
                    onChange={(e) =>
                      updateSettings("paypal", "clientId", e.target.value)
                    }
                    placeholder="AXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX"
                    disabled={!settings.paypal.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paypal-secret">{t("Client Secret")}</Label>
                  <div className="relative">
                    <Input
                      id="paypal-secret"
                      type={showSecrets.paypalSecret ? "text" : "password"}
                      value={settings.paypal.clientSecret}
                      onChange={(e) =>
                        updateSettings("paypal", "clientSecret", e.target.value)
                      }
                      placeholder="EXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX"
                      disabled={!settings.paypal.enabled}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecret("paypalSecret")}
                    >
                      {showSecrets.paypalSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="paypal-test"
                  checked={settings.paypal.testMode}
                  onCheckedChange={(checked) =>
                    updateSettings("paypal", "testMode", checked)
                  }
                  disabled={!settings.paypal.enabled}
                />
                <Label htmlFor="paypal-test">{t("Test Mode")}</Label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Razorpay</CardTitle>
                    <CardDescription>
                      {t(
                        "Accept payments in India with UPI, cards, and wallets"
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={settings.razorpay.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings("razorpay", "enabled", checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razorpay-key-id">{t("Key ID")}</Label>
                  <Input
                    id="razorpay-key-id"
                    value={settings.razorpay.keyId}
                    onChange={(e) =>
                      updateSettings("razorpay", "keyId", e.target.value)
                    }
                    placeholder="rzp_test_..."
                    disabled={!settings.razorpay.enabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razorpay-secret">{t("Key Secret")}</Label>
                  <div className="relative">
                    <Input
                      id="razorpay-secret"
                      type={showSecrets.razorpaySecret ? "text" : "password"}
                      value={settings.razorpay.keySecret}
                      onChange={(e) =>
                        updateSettings("razorpay", "keySecret", e.target.value)
                      }
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxx"
                      disabled={!settings.razorpay.enabled}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleSecret("razorpaySecret")}
                    >
                      {showSecrets.razorpaySecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="razorpay-test"
                  checked={settings.razorpay.testMode}
                  onCheckedChange={(checked) =>
                    updateSettings("razorpay", "testMode", checked)
                  }
                  disabled={!settings.razorpay.enabled}
                />
                <Label htmlFor="razorpay-test">{t("Test Mode")}</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t("General Payment Settings")}
              </CardTitle>
              <CardDescription>
                {t("Configure currency, fees, and processing options")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">{t("Default Currency")}</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) =>
                      updateSettings("general", "currency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">{t("Tax Rate (%)")}</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.1"
                    value={settings.general.taxRate}
                    onChange={(e) =>
                      updateSettings(
                        "general",
                        "taxRate",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="8.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processing-fee">
                    {t("Processing Fee (%)")}
                  </Label>
                  <Input
                    id="processing-fee"
                    type="number"
                    step="0.1"
                    value={settings.general.processingFee}
                    onChange={(e) =>
                      updateSettings(
                        "general",
                        "processingFee",
                        Number.parseFloat(e.target.value)
                      )
                    }
                    placeholder="2.9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-amount">{t("Minimum Amount")}</Label>
                  <Input
                    id="min-amount"
                    type="number"
                    value={settings.general.minimumAmount}
                    onChange={(e) =>
                      updateSettings(
                        "general",
                        "minimumAmount",
                        Number.parseInt(e.target.value)
                      )
                    }
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-amount">{t("Maximum Amount")}</Label>
                  <Input
                    id="max-amount"
                    type="number"
                    value={settings.general.maximumAmount}
                    onChange={(e) =>
                      updateSettings(
                        "general",
                        "maximumAmount",
                        Number.parseInt(e.target.value)
                      )
                    }
                    placeholder="10000"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-capture"
                  checked={settings.general.autoCapture}
                  onCheckedChange={(checked) =>
                    updateSettings("general", "autoCapture", checked)
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="auto-capture">
                    {t("Auto-capture payments")}
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("Automatically capture authorized payments")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t("Security Settings")}
              </CardTitle>
              <CardDescription>
                {t("Configure fraud detection and security measures")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {t(
                    "These security settings help protect against fraudulent transactions and ensure PCI compliance."
                  )}
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Fraud Detection")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Enable automatic fraud detection and prevention")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.fraudDetection}
                    onCheckedChange={(checked) =>
                      updateSettings("security", "fraudDetection", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Require CVV")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Require CVV verification for all card payments")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.requireCvv}
                    onCheckedChange={(checked) =>
                      updateSettings("security", "requireCvv", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Require Billing Address")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Require billing address for all payments")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.requireBillingAddress}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        "security",
                        "requireBillingAddress",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Allow Saved Cards")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Allow customers to save cards for future payments")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.allowSavedCards}
                    onCheckedChange={(checked) =>
                      updateSettings("security", "allowSavedCards", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("SSL Required")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Require SSL/TLS encryption for all payment pages")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.sslRequired}
                    onCheckedChange={(checked) =>
                      updateSettings("security", "sslRequired", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("Notification Settings")}
              </CardTitle>
              <CardDescription>
                {t("Configure email notifications for payment events")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Payment Success")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Send notifications when payments are successful")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentSuccess}
                    onCheckedChange={(checked) =>
                      updateSettings("notifications", "paymentSuccess", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Payment Failed")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Send notifications when payments fail")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentFailed}
                    onCheckedChange={(checked) =>
                      updateSettings("notifications", "paymentFailed", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Refund Processed")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Send notifications when refunds are processed")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.refundProcessed}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        "notifications",
                        "refundProcessed",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Chargeback Alert")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Send alerts for chargeback notifications")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.chargebackAlert}
                    onCheckedChange={(checked) =>
                      updateSettings(
                        "notifications",
                        "chargebackAlert",
                        checked
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="space-y-1">
                    <Label>{t("Email Receipts")}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("Send email receipts to customers")}
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailReceipts}
                    onCheckedChange={(checked) =>
                      updateSettings("notifications", "emailReceipts", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {t("Saving...")}
            </>
          ) : (
            t("Save Settings")
          )}
        </Button>
      </div>
    </div>
  );
}
