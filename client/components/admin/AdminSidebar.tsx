"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  BookOpen,
  Users,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Star,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    nameKey: "admin.nav.dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Templates",
    nameKey: "admin.nav.templates",
    href: "/admin/templates",
    icon: FileText,
  },
  {
    name: "Projects",
    nameKey: "admin.nav.projects",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    name: "Blogs",
    nameKey: "admin.nav.blogs",
    href: "/admin/blogs",
    icon: BookOpen,
  },
  {
    name: "Users",
    nameKey: "admin.nav.users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Orders",
    nameKey: "admin.nav.orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Reviews",
    nameKey: "admin.nav.reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    name: "Settings",
    nameKey: "admin.nav.settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-card border-b px-4 py-3">
          <h1 className="text-lg font-semibold">
            {t("Admin Panel", "admin.title")}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-72 bg-card border-r">
              <div className="flex items-center justify-between p-4">
                <h1 className="text-lg font-semibold">
                  {t("Admin Panel", "admin.title")}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <Separator />
              <ScrollArea className="h-[calc(100vh-80px)]">
                <nav className="p-4 space-y-2">
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {t(item.name, item.nameKey)}
                      </Link>
                    );
                  })}
                </nav>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold">
              {t("Admin Panel", "admin.title")}
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {t(item.name, item.nameKey)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
