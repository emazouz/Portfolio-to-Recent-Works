import { TemplateDetails } from "@/components/admin/templates/TemplateDetails";

interface ViewTemplatePageProps {
  params: {
    id: string;
  };
}

export default function ViewTemplatePage({ params }: ViewTemplatePageProps) {
  return <TemplateDetails templateId={params.id} />;
}
