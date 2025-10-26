import ProjectDetails from "@/components/portfolio/details/project-details";
import { ParamsProps } from "@/types/params.types";

export const metadata = {
  title: "Login - Developer Portfolio",
  description:
    "Sign in to your account to access premium templates and manage your purchases.",
};
export default async function ViewProjectPage({ params }: ParamsProps) {
  const resolvePrams = await params;
  const projectId = parseInt(resolvePrams.id);
  return (
    <main className="min-h-screen wrapper bg-background py-10">
      <ProjectDetails id={projectId} />
    </main>
  );
}
