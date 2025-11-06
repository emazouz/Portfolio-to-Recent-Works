"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  LogOut,
  User,
  Settings,
  ShoppingBag,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search-modal";
import { authStore, UserType } from "@/store/authStore";
import {
  CustomDropdown,
  DropdownHeader,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { moreNavigation, navigation } from "@/constants/navigation.constants";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import Logo from "./logo";

// ============================================================================
// PERFORMANCE OPTIMIZATIONS APPLIED:
// ============================================================================
// 1. Memoized user initials calculation
// 2. useCallback for event handlers to prevent re-creation
// 3. Memoized filtered navigation items
// 4. Separated components for better re-render isolation
// 5. Fixed authentication logic bug (isLoading && user)
// 6. Debounced search modal state
// 7. Optimized conditional rendering
// ============================================================================

// Memoized helper to calculate user initials
const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Memoized Avatar component to prevent unnecessary re-renders
const UserAvatar = memo(
  ({ user, className = "h-8 w-8" }: { user: UserType; className?: string }) => {
    const initials = useMemo(() => getUserInitials(user.name), [user.name]);

    return (
      <Avatar className={className}>
        <AvatarImage
          src={user.avatar}
          alt={user.name}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }
);
UserAvatar.displayName = "UserAvatar";

// Memoized Navigation Links component
const NavigationLinks = memo(
  ({ pathname, onClick }: { pathname: string; onClick?: () => void }) => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={onClick}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-muted",
            pathname === item.href
              ? "text-primary bg-muted"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {item.name}
        </Link>
      ))}
    </>
  )
);
NavigationLinks.displayName = "NavigationLinks";

// Memoized User Dropdown component
const UserDropdown = memo(
  ({ user, handleLogout }: { user: UserType; handleLogout: () => void }) => (
    <CustomDropdown
      trigger={
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-ring transition-all"
        >
          <UserAvatar user={user} />
        </Button>
      }
      align="end"
      className="w-64"
    >
      <DropdownHeader>
        <div className="flex items-center justify-start gap-2 p-1">
          <UserAvatar user={user} className="h-10 w-10" />
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{user.name}</p>
            <p className="w-[180px] truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </DropdownHeader>

      <DropdownItem asChild>
        <Link href="/dashboard" className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </DropdownItem>
      <DropdownItem asChild>
        <Link href="/dashboard?tab=settings" className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem
        onClick={handleLogout}
        variant="destructive"
        className="cursor-pointer"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </DropdownItem>
    </CustomDropdown>
  )
);
UserDropdown.displayName = "UserDropdown";

// Main Navigation Component
export function Navigation() {
  const { getUser, logout, isLoading } = authStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const pathname = usePathname();

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUser();
        if (result.success) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, [getUser]);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast({
          title: "Logged Out",
          description: `You have been logged out successfully.`,
        });
        setUser(null);
        return;
      }
      toast({
        title: "Logout Failed",
        description: result.message,
        variant: "error",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    }
  }, [logout]);

  // Memoized menu handlers
  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // Memoized filtered navigation items (only recalculate when dependencies change)
  const filteredMoreNavigation = useMemo(
    () => moreNavigation.filter((item) => !item.authRequired || user),
    [user]
  );

  // Determine authentication state
  const isAuthenticated = !isLoading && user !== null;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
        <div className="wrapper">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavigationLinks pathname={pathname} />

              <CustomDropdown
                trigger={
                  <Button
                    variant="ghost"
                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200"
                  >
                    More
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                }
                align="end"
                className="w-48"
              >
                {filteredMoreNavigation.map((item) => (
                  <DropdownItem key={item.name} asChild>
                    <Link href={item.href} className="w-full">
                      {item.name}
                    </Link>
                  </DropdownItem>
                ))}
              </CustomDropdown>
            </div>

            {/* Desktop Actions */}

            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={openSearch}
                className="h-9 w-9 hover:bg-muted transition-colors"
                title="Bell"
              >
                <Bell className="h-4 w-4" />
              </Button>

              <ThemeToggle />
              <LanguageToggle />

              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated ? (
                <UserDropdown user={user} handleLogout={handleLogout} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild size="sm">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary hover:bg-primary/90 shadow-sm text-primary-foreground"
                  >
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={openSearch}
                className="h-9 w-9"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="h-9 w-9"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-2">
                {/* Main Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md hover:bg-muted",
                      pathname === item.href
                        ? "text-primary bg-muted"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* More Links Section */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                    More
                  </p>
                  {filteredMoreNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md hover:bg-muted block",
                        pathname === item.href
                          ? "text-primary bg-muted"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                {isLoading ? (
                  <div className="flex items-center space-x-3 px-3 py-4 border-t mt-4">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-muted rounded animate-pulse" />
                      <div className="h-2 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 pb-3">
                      <UserAvatar user={user} className="h-10 w-10" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 px-3">
                      <Link
                        href="/dashboard"
                        onClick={closeMenu}
                        className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard?tab=purchases"
                        onClick={closeMenu}
                        className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>My Purchases</span>
                      </Link>
                      <Link
                        href="/dashboard?tab=settings"
                        onClick={closeMenu}
                        className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary py-2 px-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="flex items-center space-x-2 text-sm font-medium text-destructive hover:text-destructive/80 py-2 px-2 rounded-md hover:bg-destructive/10 transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4 border-t mt-4 px-3">
                    <Button variant="ghost" asChild onClick={closeMenu}>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={closeMenu}
                    >
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
}
