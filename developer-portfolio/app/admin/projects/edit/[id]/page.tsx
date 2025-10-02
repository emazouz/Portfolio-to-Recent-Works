import { ProjectForm } from "@/components/admin/projects/ProjectForm"

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">Update project information</p>
      </div>
      <ProjectForm projectId={params.id} />
    </div>
  )
}
