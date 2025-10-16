import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import { ParamsProps } from "@/types/ParamsType";

export default async function EditProjectPage({ params }: ParamsProps) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);

  if (isNaN(projectId)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">
            Invalid Project ID
          </h2>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
        <p className="text-muted-foreground">Update project information</p>
      </div>
      <ProjectForm projectId={projectId} />
    </div>
  );
}
