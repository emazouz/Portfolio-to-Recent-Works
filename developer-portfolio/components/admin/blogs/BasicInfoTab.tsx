import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BLOG_CATEGORIES } from "@/constants/BlogConstants";
import { useTranslation } from "@/hooks/use-translation";
import { Blog } from "@/store/blogStore";
import { BasicInfoTabProps } from "@/types/BlogType";


export function BasicInfoTab({
  formData,
  validationErrors,
  onInputChange,
  clearFieldError,
}: BasicInfoTabProps) {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof Blog, value: string) => {
    onInputChange(field, value);
    if (validationErrors[field]) {
      clearFieldError(field);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Basic Information", "admin.form.basicInfo")}</CardTitle>
        <CardDescription>
          {t(
            "Enter the basic details for your blog post",
            "admin.form.blogBasicDescription"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title_en" className="text-sm font-medium">
              {t("Title (English)", "admin.form.titleEn")} *
            </Label>
            <Input
              id="title_en"
              value={formData.title_en}
              onChange={(e) => handleInputChange("title_en", e.target.value)}
              placeholder={t(
                "Enter English title",
                "admin.form.titleEnPlaceholder"
              )}
              className={validationErrors.title_en ? "border-red-500" : ""}
              aria-invalid={!!validationErrors.title_en}
            />
            {validationErrors.title_en && (
              <p className="text-sm text-red-500">
                {validationErrors.title_en}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_ar" className="text-sm font-medium">
              {t("Title (Arabic)", "admin.form.titleAr")} *
            </Label>
            <Input
              id="title_ar"
              value={formData.title_ar}
              onChange={(e) => handleInputChange("title_ar", e.target.value)}
              placeholder={t(
                "Enter Arabic title",
                "admin.form.titleArPlaceholder"
              )}
              className={validationErrors.title_ar ? "border-red-500" : ""}
              dir="rtl"
              aria-invalid={!!validationErrors.title_ar}
            />
            {validationErrors.title_ar && (
              <p className="text-sm text-red-500">
                {validationErrors.title_ar}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              {t("Category", "admin.form.category")} *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                className={validationErrors.category ? "border-red-500" : ""}
              >
                <SelectValue
                  placeholder={t(
                    "Select category",
                    "admin.form.selectCategory"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.category && (
              <p className="text-sm text-red-500">
                {validationErrors.category}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              {t("URL Slug", "admin.form.slug")} *
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              placeholder="react-best-practices-2024"
              className={validationErrors.slug ? "border-red-500" : ""}
            />
            {validationErrors.slug && (
              <p className="text-sm text-red-500">{validationErrors.slug}</p>
            )}
            <p className="text-xs text-gray-500">
              {t(
                "URL-friendly version of the title",
                "admin.form.slugDescription"
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
