"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, ShoppingCart, ExternalLink, Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const projects = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description:
      "Modern admin dashboard for e-commerce platforms with analytics and inventory management.",
    image: "/modern-ecommerce-dashboard.png",
    category: "Web App",
    tags: ["React", "TypeScript", "Tailwind"],
    isPurchased: false,
    price: 49,
  },
  {
    id: 2,
    title: "SaaS Landing Page",
    description:
      "Professional landing page template for SaaS products with conversion optimization.",
    image: "/saas-landing-page.png",
    category: "Template",
    tags: ["Next.js", "Framer Motion", "Tailwind"],
    isPurchased: true,
    price: 29,
  },
  {
    id: 3,
    title: "Blog Platform",
    description:
      "Full-featured blog platform with CMS capabilities and SEO optimization.",
    image: "/modern-ecommerce-dashboard.png",
    category: "Web App",
    tags: ["Next.js", "MDX", "Prisma"],
    isPurchased: false,
    price: 79,
  },
  {
    id: 4,
    title: "Restaurant Website",
    description:
      "Beautiful restaurant website with online ordering and reservation system.",
    image: "/restaurant-website-template.png",
    category: "Template",
    tags: ["React", "Stripe", "Tailwind"],
    isPurchased: false,
    price: 39,
  },
  {
    id: 5,
    title: "Crypto Dashboard",
    description:
      "Real-time cryptocurrency trading dashboard with portfolio tracking.",
    image: "/crypto-trading-dashboard.png",
    category: "Web App",
    tags: ["React", "Chart.js", "WebSocket"],
    isPurchased: false,
    price: 89,
  },
  {
    id: 6,
    title: "Portfolio Template",
    description:
      "Clean and modern portfolio template for developers and designers.",
    image: "/developer-portfolio-template.jpg",
    category: "Template",
    tags: ["Next.js", "Tailwind", "Framer"],
    isPurchased: true,
    price: 25,
  },
];

export function FeaturedProjectsSection() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const route = useRouter();
  const goToAllProjects = () => {
    route.push("/projects");
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground">
              Premium, production-ready projects to accelerate your projects
            </p>
          </div>

          <Button variant="outline" onClick={goToAllProjects}>
            <span>View All Projects</span>
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className={`group bg-muted/30 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                hoveredProject === project.id ? "shadow-2xl -translate-y-2" : ""
              }`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-primary/90 text-primary-foreground"
                  >
                    {project.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    {project.isPurchased ? (
                      <Button
                        size="sm"
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90"
                      >
                        <ShoppingCart className="w-4 h-4" />${project.price}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 bg-transparent"
            onClick={goToAllProjects}
          >
            View All Projects
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
