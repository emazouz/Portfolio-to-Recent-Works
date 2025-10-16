import { ProjectDetails } from "@/components/admin/projects/ProjectDetails";
import { ParamsProps } from "@/types/ParamsType";

export default async function ViewProjectPage({ params }: ParamsProps) {
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

  return <ProjectDetails projectId={projectId} />;
}
