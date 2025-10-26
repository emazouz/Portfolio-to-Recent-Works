"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SearchModalProps, SearchResult } from "@/types/index.types";
import { mockSearchResults } from "@/constants/index.constants";

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults(mockSearchResults.slice(0, 6)); // Show popular results
    }
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + results.length) % results.length
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        // Redirect on Enter key press
        window.location.href = results[selectedIndex].href;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  /**
   * Generates theme-aware Tailwind classes for result type badges.
   * Uses primary, secondary, and accent colors for distinction.
   */
  const getTypeColor = (type: string) => {
    switch (type) {
      case "template":
        // Uses Primary for template focus
        return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground";
      case "project":
        // Uses Secondary for project distinction
        return "bg-secondary/10 text-secondary-foreground dark:bg-secondary/20 dark:text-secondary";
      case "blog":
        // Uses Accent for articles/blogs
        return "bg-accent text-accent-foreground dark:bg-accent/80 dark:text-accent-foreground";
      case "page":
        // Uses Muted for general pages
        return "bg-muted text-muted-foreground dark:bg-muted/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        {/* Modal Container */}
        <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl animate-in fade-in-0 slide-in-from-top-4 duration-300">
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search templates, projects, articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              // Removes default ring and border, relies on modal border
              className="border-0 focus-visible:ring-0 text-lg bg-transparent shadow-none"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2">
                {!query && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Popular
                  </div>
                )}
                {results.map((result, index) => {
                  const Icon = result.icon;
                  return (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        // Selected item styling uses the primary color background
                        index === selectedIndex
                          ? "bg-primary/10 text-primary-foreground dark:bg-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {result.title}
                          </p>
                          {/* Uses the dynamic getTypeColor function */}
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                              result.type
                            )}`}
                          >
                            {result.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {result.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">
                  Try searching for templates, projects, or articles
                </p>
              </div>
            )}
          </div>

          {/* Search Footer (Keybinds) */}
          <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground bg-muted/30 rounded-b-lg">
            <div className="flex items-center gap-4">
              {/* Using <kbd> for better accessibility and style */}
              <div className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center h-5 w-5 rounded-sm border bg-card text-xs">
                  ↑
                </kbd>
                <kbd className="inline-flex items-center justify-center h-5 w-5 rounded-sm border bg-card text-xs">
                  ↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center h-5 w-5 rounded-sm border bg-card text-xs">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex items-center justify-center h-5 w-auto px-1 rounded-sm border bg-card text-xs">
                  ESC
                </kbd>
                <span>Close</span>
              </div>
            </div>
            <span>{results.length} results</span>
          </div>
        </div>
      </div>
    </div>
  );
}
