import { ViewTemplate } from "@/components/ViewTemplateProps";
import { ParamsProps } from "@/types/ParamsType";

export default async function ViewTemplatePage({ params }: ParamsProps) {
  const resolvedParams = await params;
  const templateId = parseInt(resolvedParams.id);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <ViewTemplate templateId={templateId} />
      </main>
    </div>
  );
}
