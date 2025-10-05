"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Download } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { Template, templateStore } from "@/store/templateStore";
import { useEffect, useState } from "react";
interface RelatedTemplatesProps {
  templateId: number;
}

export function RelatedTemplates({ templateId }: RelatedTemplatesProps) {
  const { currentLanguage } = useTranslation();
  const { getSimilarTemplates } = templateStore();
  const [relatedTemplates, setRelatedTemplates] = useState<Template[] | []>([]);
  const getLocalizedContent = (item: any, field: string) => {
    const langSuffix = currentLanguage === "ar" ? "_ar" : "_en";
    return item[`${field}${langSuffix}`] || item[`${field}_en`] || item[field];
  };

  useEffect(() => {
    const fetchRelatedTemplates = async (id: number) => {
      const result = await getSimilarTemplates(id);
      if (result.success) {
        setRelatedTemplates(result.data);
      }
    };
    if (!templateId) return;
    fetchRelatedTemplates(templateId);
  }, [getSimilarTemplates]);

  if (relatedTemplates.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8">
        {currentLanguage === "ar" ? "قوالب ذات صلة" : "Related Templates"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTemplates.map((template) => (
          <Card
            key={template.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={template.imageUrl || "/placeholder.svg"}
                alt={getLocalizedContent(template, "title")}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                ${template.price}
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-lg line-clamp-1">
                {getLocalizedContent(template, "title")}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {getLocalizedContent(template, "description")}
              </CardDescription>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {template.downloads}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/templates/view/${template.id}`}>
                  {currentLanguage === "ar" ? "عرض القالب" : "View Template"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
