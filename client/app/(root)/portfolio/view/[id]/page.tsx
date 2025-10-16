import ProjectDetails from "@/components/portfolio/ProjectDetails";
import { ParamsProps } from "@/types/ParamsType";

export const metadata = {
  title: "Login - Developer Portfolio",
  description:
    "Sign in to your account to access premium templates and manage your purchases.",
};
export default async function ViewProjectPage({ params }: ParamsProps) {
  const resolvePrams = await params;
  const projectId = parseInt(resolvePrams.id);
  return <ProjectDetails id={projectId} />;
}


/*

Manage online stores efficiently with real-time analytics and inventory control.

*/