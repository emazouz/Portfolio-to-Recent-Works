"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Mail,
  User,
  CreditCard,
  Package,
  Calendar,
} from "lucide-react";

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  // Mock data - replace with actual data fetching
  const order = {
    id: orderId,
    userId: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    userAvatar: "/placeholder.svg?height=40&width=40",
    itemType: "Template",
    itemId: "TPL-001",
    itemName: "Modern Dashboard Template",
    itemDescription: "A comprehensive dashboard template with modern design",
    itemImage: "/placeholder.svg?height=200&width=300",
    amount: 49,
    currency: "USD",
    status: "paid",
    paymentMethod: "stripe",
    paymentId: "pi_1234567890",
    createdAt: "2024-01-15T10:30:00Z",
    paidAt: "2024-01-15T10:32:00Z",
    billingAddress: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default">{t("Paid", "admin.orders.paid")}</Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            {t("Pending", "admin.orders.pending")}
          </Badge>
        );
      case "canceled":
        return (
          <Badge variant="destructive">
            {t("Canceled", "admin.orders.canceled")}
          </Badge>
        );
      case "refunded":
        return (
          <Badge variant="outline">
            {t("Refunded", "admin.orders.refunded")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back to Orders", "admin.orders.backToOrders")}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Order", "admin.orders.order")} {order.id}
          </h1>
          <p className="text-muted-foreground">
            {t("Created on", "admin.orders.createdOn")}{" "}
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("Download Invoice", "admin.orders.downloadInvoice")}
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            {t("Send Email", "admin.orders.sendEmail")}
          </Button>
          {order.status === "pending" && (
            <Button size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("Mark as Paid", "admin.orders.markAsPaid")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("Order Summary", "admin.orders.orderSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <img
                  src={order.itemImage || "/placeholder.svg"}
                  alt={order.itemName}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold">{order.itemName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.itemDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{order.itemType}</Badge>
                    <span className="text-sm text-muted-foreground">
                      ID: {order.itemId}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatCurrency(order.amount, order.currency)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Total", "admin.orders.total")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                {t("Payment Information", "admin.orders.paymentInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    {t("Status", "admin.orders.status")}
                  </label>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("Payment Method", "admin.orders.paymentMethod")}
                  </label>
                  <div className="mt-1 capitalize">{order.paymentMethod}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("Payment ID", "admin.orders.paymentId")}
                  </label>
                  <div className="mt-1 font-mono text-sm">
                    {order.paymentId}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    {t("Amount", "admin.orders.amount")}
                  </label>
                  <div className="mt-1 font-semibold">
                    {formatCurrency(order.amount, order.currency)}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    {t("Order Date", "admin.orders.orderDate")}
                  </label>
                  <div className="mt-1">{formatDate(order.createdAt)}</div>
                </div>
                {order.paidAt && (
                  <div>
                    <label className="text-sm font-medium">
                      {t("Payment Date", "admin.orders.paymentDate")}
                    </label>
                    <div className="mt-1">{formatDate(order.paidAt)}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("Billing Address", "admin.orders.billingAddress")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{order.billingAddress.name}</div>
                <div>{order.billingAddress.email}</div>
                <div>{order.billingAddress.address}</div>
                <div>
                  {order.billingAddress.city}, {order.billingAddress.state}{" "}
                  {order.billingAddress.zipCode}
                </div>
                <div>{order.billingAddress.country}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("Customer", "admin.orders.customer")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={order.userAvatar || "/placeholder.svg"}
                    alt={order.userName}
                  />
                  <AvatarFallback>{order.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="font-medium">{order.userName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.userEmail}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Customer ID", "admin.orders.customerId")}:{" "}
                    {order.userId}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  {t(
                    "View Customer Profile",
                    "admin.orders.viewCustomerProfile"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  {t("View Order History", "admin.orders.viewOrderHistory")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("Order Timeline", "admin.orders.orderTimeline")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {t("Order Created", "admin.orders.orderCreated")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
                {order.paidAt && (
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {t("Payment Received", "admin.orders.paymentReceived")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(order.paidAt)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
