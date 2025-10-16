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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/search-modal";
import { authStore, UserType } from "@/store/authStore";
import {
  CustomDropdown,
  DropdownHeader,
  DropdownItem,
  DropdownSeparator,
} from "./ui/dropdown-menu";

type MoreNavItem = { name: string; href: string; authRequired?: boolean };

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Me", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blogs", href: "/blog" },
];

const moreNavigation: MoreNavItem[] = [
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const { getUser, logout } = authStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [user, setUser] = React.useState<UserType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const pathname = usePathname();

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
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-lg">
                  D
                </span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                DevPortfolio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
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
                {moreNavigation.map(
                  (item) =>
                    (!item.authRequired || isLoggedIn) && (
                      <DropdownItem key={item.name} asChild>
                        <Link href={item.href} className="w-full">
                          {item.name}
                        </Link>
                      </DropdownItem>
                    )
                )}
              </CustomDropdown>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-9 w-9 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </Button>

              <ThemeToggle />
              <LanguageToggle />

              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              ) : isLoggedIn && user ? (
                <CustomDropdown
                  trigger={
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-purple-200 dark:hover:ring-purple-800 transition-all"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                          {user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                  align="end"
                  className="w-64"
                >
                  <DropdownHeader>
                    <div className="flex items-center justify-start gap-2 p-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                          {user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                    <Link
                      href="/dashboard?tab=purchases"
                      className="cursor-pointer"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      My Purchases
                    </Link>
                  </DropdownItem>
                  <DropdownItem asChild>
                    <Link
                      href="/dashboard?tab=settings"
                      className="cursor-pointer"
                    >
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
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild size="sm">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-sm"
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
                onClick={() => setIsSearchOpen(true)}
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
                onClick={() => setIsOpen(!isOpen)}
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

                <div className="border-t pt-4 mt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                    More
                  </p>
                  {moreNavigation.map(
                    (item) =>
                      (!item.authRequired || isLoggedIn) && (
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
                      )
                  )}
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
                ) : isLoggedIn && user ? (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center space-x-3 px-3 pb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                          {user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
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
                        className="flex items-center space-x-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-2 px-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full"
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
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
