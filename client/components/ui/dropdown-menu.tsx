"use client";

import * as React from "react";
import { cn } from "@/lib/utils";


// Custom Dropdown Components (same as in Navigation)
interface CustomDropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  children,
  trigger,
  align = "end",
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <>
          {/* <div className="fixed inset-0 z-40 bg-red-500" /> */}
          <div
            className={cn(
              "absolute z-[10000] mt-5 min-w-[8rem] overflow-hidden rounded-lg border bg-popover/95 backdrop-blur-sm text-popover-foreground shadow-xl",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200",
              "ring-1 ring-black/5 dark:ring-white/10 border-border/50 dark:border-border/70",
              "p-1",
              alignmentClasses[align],
              className
            )}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive";
  asChild?: boolean;
   selected?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className,
  variant = "default",
  asChild = false,
  selected = false,
}) => {
  const baseClasses = cn(
    "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors duration-200",
    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
    variant === "destructive" && [
      "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive",
      "dark:hover:bg-destructive/20",
    ],
    "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
    variant === "destructive" && "[&_svg]:!text-destructive",
    className
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(
        baseClasses,
        (children as React.ReactElement).props.className
      ),
      onClick: (e: React.MouseEvent) => {
        onClick?.();
        (children as React.ReactElement).props.onClick?.(e);
      },
    });
  }

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};




export const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
);

export const DropdownHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      "px-2 py-2 text-sm font-medium text-foreground border-b mb-1",
      className
    )}
  >
    {children}
  </div>
);