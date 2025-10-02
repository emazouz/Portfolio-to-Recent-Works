import React from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SettingsTabProps } from "@/types/BlogType";

export function SettingsTab({
  formData,
  publishDate,
  onInputChange,
  onPublishDateChange,
}: SettingsTabProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Publishing Settings", "admin.form.publishingSettings")}
        </CardTitle>
        <CardDescription>
          {t(
            "Configure when and how your blog post is published",
            "admin.form.publishingDescription"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("Publish Date", "admin.form.publishDate")}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !publishDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {publishDate
                  ? format(publishDate, "PPP")
                  : t("Pick a date", "admin.form.pickDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={publishDate}
                onSelect={onPublishDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Separator />

        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="published" className="text-sm font-medium">
              {t("Published", "admin.form.published")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t(
                "Make this blog post visible to readers",
                "admin.form.publishedDescription"
              )}
            </p>
          </div>
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => onInputChange("published", checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="featured" className="text-sm font-medium">
              {t("Featured Post", "admin.form.featuredPost")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {t(
                "Show this post in featured sections",
                "admin.form.featuredPostDescription"
              )}
            </p>
          </div>
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => onInputChange("featured", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
