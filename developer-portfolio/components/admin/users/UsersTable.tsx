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
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  UserX,
  UserCheck,
  Download,
  Upload,
  Calendar,
  ShoppingCart,
  Star,
} from "lucide-react";
import { CustomDropdown, DropdownItem } from "@/components/ui/dropdown-menu";

// Mock data - replace with actual data fetching
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2023-06-15T08:00:00Z",
    ordersCount: 12,
    reviewsCount: 8,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    status: "active",
    lastLogin: "2024-01-14T15:45:00Z",
    createdAt: "2023-08-20T12:30:00Z",
    ordersCount: 5,
    reviewsCount: 3,
  },
  {
    id: "3",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "editor",
    status: "banned",
    lastLogin: "2024-01-10T09:15:00Z",
    createdAt: "2023-09-10T14:20:00Z",
    ordersCount: 0,
    reviewsCount: 0,
  },
];

export function UsersTable() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default">{t("Active", "admin.users.active")}</Badge>
        );
      case "banned":
        return (
          <Badge variant="destructive">
            {t("Banned", "admin.users.banned")}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary">
            {t("Pending", "admin.users.pending")}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default">{t("Admin", "admin.users.admin")}</Badge>
        );
      case "editor":
        return (
          <Badge variant="secondary">{t("Editor", "admin.users.editor")}</Badge>
        );
      case "user":
        return <Badge variant="outline">{t("User", "admin.users.user")}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("Users", "admin.users.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("Manage user accounts and permissions", "admin.users.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            {t("Import", "admin.users.import")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("Export", "admin.users.export")}
          </Button>
          <Button asChild>
            <Link href="/admin/users/add">
              <Plus className="mr-2 h-4 w-4" />
              {t("Add User", "admin.users.add")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Total Users", "admin.users.totalUsers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Active Users", "admin.users.activeUsers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter((u) => u.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("New This Month", "admin.users.newThisMonth")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("Banned Users", "admin.users.bannedUsers")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockUsers.filter((u) => u.status === "banned").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("All Users", "admin.users.all")}</CardTitle>
          <CardDescription>
            {t("View and manage all user accounts", "admin.users.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("Search users...", "admin.users.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Role", "admin.users.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Roles", "admin.users.allRoles")}
                </SelectItem>
                <SelectItem value="admin">
                  {t("Admin", "admin.users.admin")}
                </SelectItem>
                <SelectItem value="editor">
                  {t("Editor", "admin.users.editor")}
                </SelectItem>
                <SelectItem value="user">
                  {t("User", "admin.users.user")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Status", "admin.users.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("All Status", "admin.users.allStatus")}
                </SelectItem>
                <SelectItem value="active">
                  {t("Active", "admin.users.active")}
                </SelectItem>
                <SelectItem value="banned">
                  {t("Banned", "admin.users.banned")}
                </SelectItem>
                <SelectItem value="pending">
                  {t("Pending", "admin.users.pending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12 ring-2 ring-background shadow-sm">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="text-lg font-semibold">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-base leading-tight">
                          {user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
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
                      <DropdownItem>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("View Profile", "admin.users.viewProfile")}
                      </DropdownItem>
                      <DropdownItem asChild>
                        <Link href={`/admin/users/edit/${user.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("Edit", "admin.users.edit")}
                        </Link>
                      </DropdownItem>
                      {user.status === "active" ? (
                        <DropdownItem className="text-orange-600">
                          <UserX className="mr-2 h-4 w-4" />
                          {t("Ban User", "admin.users.banUser")}
                        </DropdownItem>
                      ) : (
                        <DropdownItem className="text-green-600">
                          <UserCheck className="mr-2 h-4 w-4" />
                          {t("Activate User", "admin.users.activateUser")}
                        </DropdownItem>
                      )}
                      <DropdownItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("Delete", "admin.users.delete")}
                      </DropdownItem>
                    </CustomDropdown>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <ShoppingCart className="h-3 w-3" />
                          <span>{user.ordersCount} orders</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Star className="h-3 w-3" />
                          <span>{user.reviewsCount} reviews</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                      <span>Last login {formatDate(user.lastLogin)}</span>
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
