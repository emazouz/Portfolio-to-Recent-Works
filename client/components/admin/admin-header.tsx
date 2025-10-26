"use client";

import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, User, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "../shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import React from "react";
import Link from "next/link";
import { authStore, UserType } from "@/store/authStore";

import {
  CustomDropdown,
  DropdownHeader,
  DropdownItem,
  DropdownSeparator,
} from "../ui/dropdown-menu";
import { LanguageToggle } from "../shared/language-toggle";
import { SearchModal } from "../search-modal";

export function AdminHeader() {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(3); // Mock notification count
  const { getUser, logout } = authStore();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState<UserType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const result = await getUser();
        if (result.success) {
          setIsLoggedIn(true);
          setUser(result.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [getUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);
      // Optionally redirect to login page
      // window.location.href = '/auth/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 transition-all duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section - Search */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 w-9 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                title={t("Search", "admin.search")}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                  title={t("Notifications", "admin.notifications")}
                >
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </Badge>
                  )}
                  <span className="sr-only">
                    {notificationCount > 0
                      ? `${notificationCount} unread notifications`
                      : "No notifications"}
                  </span>
                </Button>
              </div>

              {/* User Menu */}
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : isLoggedIn && user ? (
                <CustomDropdown
                  align="end"
                  className="w-64"
                  trigger={
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-purple-200 dark:hover:ring-purple-800 transition-all"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name || "User"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xs">
                          {getUserInitials(user.name || "User")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                >
                  <DropdownHeader>
                    <div className="flex items-center justify-start gap-2 p-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name || "User"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                          {getUserInitials(user.name || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">
                          {user.name || "Unknown User"}
                        </p>
                        <p className="w-[180px] truncate text-xs text-muted-foreground">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </DropdownHeader>

                  <DropdownItem asChild>
                    <Link
                      href="/dashboard?tab=profile"
                      className="cursor-pointer w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("Profile", "admin.profile")}</span>
                    </Link>
                  </DropdownItem>

                  <DropdownItem asChild>
                    <Link
                      href="/dashboard?tab=settings"
                      className="cursor-pointer w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("Settings", "admin.settings")}</span>
                    </Link>
                  </DropdownItem>

                  <DropdownSeparator />

                  <DropdownItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("Log out", "admin.logout")}</span>
                  </DropdownItem>
                </CustomDropdown>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild size="sm">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
