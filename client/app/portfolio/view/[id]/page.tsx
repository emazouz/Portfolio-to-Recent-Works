import ProjectDetails from "@/components/portfolio/ProjectDetails";
import { ParamsProps } from "@/types/ParamsType";

export const metadata = {
  title: "Login - Developer Portfolio",
  description:
    "Sign in to your account to access premium templates and manage your purchases.",
};
export default function ViewProjectPage({ params }: ParamsProps) {
  return <ProjectDetails id={params.id} />;
}
