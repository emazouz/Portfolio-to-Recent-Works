import { ProjectDetails } from "@/components/admin/projects/ProjectDetails"
import { ParamsProps } from "@/types/ParamsType"

export default function ViewProjectPage({ params }: ParamsProps) {
  return <ProjectDetails projectId={params.id} />
}
