import type { Metadata } from "next";
import ProjectList from "@/components/portfolio/ProjectList";

export const metadata: Metadata = {
  title: "Portfolio - DevPortfolio",
  description: "Explore my latest projects and development work",
};

export default function PortfolioPage() {
  return <ProjectList />;
}
