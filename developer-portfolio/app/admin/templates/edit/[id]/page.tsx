import { TemplateForm } from "@/components/admin/templates/TemplateForm"

interface EditTemplatePageProps {
  params: {
    id: string
  }
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
        <p className="text-muted-foreground">Update template information</p>
      </div>
      <TemplateForm templateId={params.id} />
    </div>
  )
}
