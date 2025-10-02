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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  Search,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Package,
} from "lucide-react";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown-menu";

// Mock data - replace with actual data fetching
const mockOrders = [
  {
    id: "ORD-001",
    userId: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    itemType: "Template",
    itemId: "TPL-001",
    itemName: "Modern Dashboard Template",
    amount: 49,
    currency: "USD",
    status: "paid",
    paymentMethod: "stripe",
    createdAt: "2024-01-15T10:30:00Z",
    paidAt: "2024-01-15T10:32:00Z",
  },
  {
    id: "ORD-002",
    userId: "2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    itemType: "Project",
    itemId: "PRJ-001",
    itemName: "E-commerce Website",
    amount: 199,
    currency: "USD",
    status: "pending",
    paymentMethod: "paypal",
    createdAt: "2024-01-14T15:45:00Z",
    paidAt: null,
  },
  {
    id: "ORD-003",
    userId: "3",
    userName: "Ahmed Hassan",
    userEmail: "ahmed@example.com",
    itemType: "Template",
    itemId: "TPL-002",
    itemName: "Landing Page Template",
    amount: 35,
    currency: "USD",
    status: "refunded",
    paymentMethod: "stripe",
    createdAt: "2024-01-12T09:15:00Z",
    paidAt: "2024-01-12T09:17:00Z",
  },
];

export function OrdersTable() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [itemTypeFilter, setItemTypeFilter] = useState("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesItemType =
      itemTypeFilter === "all" || order.itemType === itemTypeFilter;

    return matchesSearch && matchesStatus && matchesItemType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  const totalRevenue = mockOrders
    .filter((order) => order.status === "paid")
    .reduce((sum, order) => sum + order.amount, 0);

  const completedOrders = mockOrders.filter(
    (order) => order.status === "paid"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Orders", "admin.orders.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage orders and payments", "admin.orders.subtitle")}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Total Revenue", "admin.orders.totalRevenue")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenue, "USD")}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% {t("from last month", "admin.orders.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Total Orders", "admin.orders.totalOrders")}
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              +8% {t("from last month", "admin.orders.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Completed Orders", "admin.orders.completedOrders")}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              +15% {t("from last month", "admin.orders.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Unique Customers", "admin.orders.uniqueCustomers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockOrders.map((o) => o.userId)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              +5% {t("from last month", "admin.orders.fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("All Orders", "admin.orders.all")}</CardTitle>
          <CardDescription>
            {t(
              "View and manage all orders and payments",
              "admin.orders.description"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search orders...", "admin.orders.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Status", "admin.orders.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Status", "admin.orders.allStatus")}
                </SelectItem>
                <SelectItem value="paid">
                  {t("Paid", "admin.orders.paid")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("Pending", "admin.orders.pending")}
                </SelectItem>
                <SelectItem value="canceled">
                  {t("Canceled", "admin.orders.canceled")}
                </SelectItem>
                <SelectItem value="refunded">
                  {t("Refunded", "admin.orders.refunded")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t("Item Type", "admin.orders.itemType")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Types", "admin.orders.allTypes")}
                </SelectItem>
                <SelectItem value="Template">
                  {t("Template", "admin.orders.template")}
                </SelectItem>
                <SelectItem value="Project">
                  {t("Project", "admin.orders.project")}
                </SelectItem>
                <SelectItem value="Blog Premium">
                  {t("Blog Premium", "admin.orders.blogPremium")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {order.id}
                        </Badge>
                        {getStatusBadge(order.status)}
                      </div>
                      <h3 className="font-semibold text-base leading-tight line-clamp-2">
                        {order.itemName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Package className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {order.itemType}
                        </span>
                      </div>
                    </div>
                    <CustomDropdown
                      align="end"
                      trigger={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    >
                      <DropdownItem asChild>
                        <Link href={`/admin/orders/details/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("View Details", "admin.orders.viewDetails")}
                        </Link>
                      </DropdownItem>
                      <DropdownItem>
                        <Download className="mr-2 h-4 w-4" />
                        {t("Download Invoice", "admin.orders.downloadInvoice")}
                      </DropdownItem>
                      {order.status === "pending" && (
                        <DropdownItem className="text-green-600">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {t("Mark as Paid", "admin.orders.markAsPaid")}
                        </DropdownItem>
                      )}
                      {order.status === "paid" && (
                        <DropdownItem className="text-orange-600">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {t("Process Refund", "admin.orders.processRefund")}
                        </DropdownItem>
                      )}
                    </CustomDropdown>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={order.userName}
                          />
                          <AvatarFallback className="text-xs">
                            {order.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {order.userName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.userEmail}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">
                          {formatCurrency(order.amount, order.currency)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        <span className="capitalize">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      {order.paidAt && (
                        <span>Paid: {formatDate(order.paidAt)}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
