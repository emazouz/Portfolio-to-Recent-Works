"use client";

import { Languages, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import {
  CustomDropdown,
  DropdownHeader,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const { currentLanguage, supportedLanguages, setLanguage, isTranslating } =
    useTranslation();

  const currentLang = supportedLanguages.find(
    (lang) => lang.code === currentLanguage
  );

  return (
    <CustomDropdown
      align="end"
      className="w-48"
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
          disabled={isTranslating}
          title={`Current language: ${currentLang?.name || "Unknown"}`}
        >
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          ) : (
            <Languages className="h-4 w-4" />
          )}

          {isTranslating && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-3 w-3 p-0 flex items-center justify-center text-xs bg-blue-100 dark:bg-blue-900/30"
            >
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
            </Badge>
          )}

          <span className="sr-only">
            {isTranslating ? "Translating content" : "Toggle language"}
          </span>
        </Button>
      }
    >
      <DropdownHeader>Select Language</DropdownHeader>

      {supportedLanguages.map((language) => (
        <DropdownItem
          key={language.code}
          onClick={() => !isTranslating && setLanguage(language.code)}
          className={cn(
            "flex items-center justify-between",
            currentLanguage === language.code &&
              "bg-accent/50 text-accent-foreground font-medium",
            isTranslating && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center space-x-2">
            <span
              className="text-lg leading-none"
              role="img"
              aria-label={`${language.name} flag`}
            >
              {language.flag}
            </span>
            <span className="text-sm">{language.name}</span>
          </div>
          {currentLanguage === language.code && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
        </DropdownItem>
      ))}

      {isTranslating && (
        <>
          <DropdownSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
              <span>Translating content...</span>
            </div>
          </div>
        </>
      )}
    </CustomDropdown>
  );
}
