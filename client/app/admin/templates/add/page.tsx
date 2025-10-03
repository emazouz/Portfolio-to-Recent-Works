import { TemplateForm } from "@/components/admin/templates/TemplateForm"

export default function AddTemplatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Template</h1>
        <p className="text-muted-foreground">Create a new template for your store</p>
      </div>
      <TemplateForm />
    </div>
  )
}
