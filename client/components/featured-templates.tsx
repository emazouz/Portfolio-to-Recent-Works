"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Star } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description:
      "Complete admin dashboard for e-commerce platforms with analytics, inventory management, and order tracking.",
    price: "$49",
    rating: 4.9,
    downloads: 1200,
    tags: ["React", "Next.js", "Tailwind"],
    image: "/modern-ecommerce-dashboard.png",
    featured: true,
  },
  {
    id: 2,
    title: "SaaS Landing Page",
    description: "Modern landing page template perfect for SaaS products with pricing tables and feature sections.",
    price: "$29",
    rating: 4.8,
    downloads: 890,
    tags: ["React", "Framer Motion", "TypeScript"],
    image: "/saas-landing-page.png",
    featured: true,
  },
  {
    id: 3,
    title: "Portfolio Template",
    description: "Clean and minimal portfolio template for developers and designers to showcase their work.",
    price: "$19",
    rating: 4.7,
    downloads: 650,
    tags: ["Next.js", "Tailwind", "MDX"],
    image: "/minimal-portfolio-website.png",
    featured: false,
  },
]

export function FeaturedTemplates() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Templates</h2>
            <p className="text-xl text-muted-foreground">
              Premium, production-ready templates to accelerate your projects
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/templates">
              View All Templates
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={template.image || "/placeholder.svg"}
                  alt={template.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {template.featured && (
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">Featured</Badge>
                )}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium">
                  {template.price}
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      {template.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{template.description}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {template.downloads}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Buy Now</Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
