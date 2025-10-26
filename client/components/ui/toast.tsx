"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { Bug, ThumbsUp, X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== TYPES ====================
type ToastVariant = "success" | "error" | "warning" | "info";

interface AlertConfigItem {
  Icon: React.ComponentType<{ className?: string }>;
  iconContainerClassName: string;
  barClassName: string;
}

type AlertConfig = Record<ToastVariant, AlertConfigItem>;

// ==================== CONFIGURATION ====================
// Note: Alert colors (success, error, etc.) are kept standard (Green, Red, Amber, Blue)
// for immediate recognition, using fixed Tailwind classes as they are not part of the primary theme palette.
const alertConfig: AlertConfig = {
  success: {
    Icon: ThumbsUp,
    iconContainerClassName: "text-emerald-500 bg-emerald-500/10",
    barClassName: "bg-emerald-500",
  },
  error: {
    Icon: Bug,
    iconContainerClassName: "text-red-500 bg-red-500/10",
    barClassName: "bg-red-500",
  },
  warning: {
    Icon: AlertCircle,
    iconContainerClassName: "text-amber-500 bg-amber-500/10",
    barClassName: "bg-amber-500",
  },
  info: {
    Icon: Info,
    iconContainerClassName: "text-sky-500 bg-sky-500/10",
    barClassName: "bg-sky-500",
  },
} as const;

// ==================== STYLES ====================
const toastVariants = cva(
  cn(
    "group pointer-events-auto relative flex w-full items-center justify-between",
    "overflow-hidden rounded-lg py-3 shadow-lg backdrop-blur-sm",
    "transition-all duration-300 ease-in-out",
    "data-[swipe=cancel]:translate-x-0",
    "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
    "data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full data-[state=open]:fade-in-0",
    "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=closed]:fade-out-80",
    // Themed Background and Border: Uses bg-card/95, which is almost black in dark mode
    "bg-card/95 border border-border",
    "cursor-default select-none"
  ),
  {
    variants: {
      variant: {
        success: "border-l-4 border-l-emerald-500",
        error: "border-l-4 border-l-red-500",
        warning: "border-l-4 border-l-amber-500",
        info: "border-l-4 border-l-sky-500",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
);

// ==================== COMPONENTS ====================

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse",
      "p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col",
      "md:max-w-[420px]",
      "gap-2",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant = "success", children, ...props }, ref) => {
  // Type-safe variant handling
  const safeVariant: ToastVariant =
    variant && variant in alertConfig ? (variant as ToastVariant) : "success";

  const config = alertConfig[safeVariant];
  const { Icon, iconContainerClassName, barClassName } = config;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant: safeVariant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3 w-full px-4">
        {/* Icon Container */}
        <div
          className={cn(
            "flex-shrink-0 rounded-lg p-2 backdrop-blur-xl",
            "transition-colors duration-200",
            iconContainerClassName
          )}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">{children}</div>
      </div>

      {/* Progress Bar */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-1 w-full origin-left",
          "animate-countdown",
          barClassName
        )}
        aria-hidden="true"
      />
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md",
      // Themed Styles
      "border border-border bg-transparent px-3",
      "text-sm font-medium text-foreground",
      "transition-colors duration-200",
      "hover:bg-muted/50 hover:text-primary-foreground/90",
      // Focus Styles
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1",
      // Themed Styles
      "text-muted-foreground opacity-0 transition-all duration-200",
      "hover:text-foreground hover:bg-muted",
      // Focus Styles
      "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
      "group-hover:opacity-100",
      className
    )}
    toast-close=""
    aria-label="Close"
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "text-sm font-semibold text-foreground leading-tight", // Themed Text
      "pr-6", // Space for close button
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground leading-relaxed", // Themed Text
      "pr-6", // Space for close button
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// ==================== TYPES EXPORT ====================
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  type ToastVariant,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
