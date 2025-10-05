import { TemplateDetails } from "@/components/admin/templates/TemplateDetails";
import { ParamsProps } from "@/types/ParamsType";

export default async function ViewTemplatePage({ params }: ParamsProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const templateId = parseInt(resolvedParams.id, 10);

  // Handle invalid ID
  if (isNaN(templateId)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">
            Invalid Template ID
          </h2>
          <p className="text-muted-foreground">
            The Template ID provided is not valid.
          </p>
        </div>
      </div>
    );
  }

  return <TemplateDetails templateId={templateId} />;
}
