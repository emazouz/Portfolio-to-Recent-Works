"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import Image from "next/image"

const articles = [
  {
    id: 1,
    title: "Building Modern Web Applications with Next.js 14",
    description:
      "Learn how to leverage the latest features in Next.js 14 to build fast, scalable web applications with improved performance and developer experience.",
    image: "/blog-nextjs-14.jpg",
    date: "2024-01-15",
    author: "Ahmed Hassan",
    category: "Tutorial",
    tags: ["Next.js", "React", "Web Development"],
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "The Complete Guide to TypeScript in 2024",
    description:
      "Master TypeScript with this comprehensive guide covering advanced types, best practices, and real-world examples for modern development.",
    image: "/blog-typescript-guide.jpg",
    date: "2024-01-10",
    author: "Ahmed Hassan",
    category: "Guide",
    tags: ["TypeScript", "JavaScript", "Programming"],
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "Optimizing React Performance: Tips and Tricks",
    description:
      "Discover proven techniques to optimize your React applications for better performance, including memoization, lazy loading, and bundle optimization.",
    image: "/blog-react-performance.jpg",
    date: "2024-01-05",
    author: "Ahmed Hassan",
    category: "Performance",
    tags: ["React", "Performance", "Optimization"],
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox: When to Use Which",
    description:
      "A detailed comparison of CSS Grid and Flexbox, with practical examples and guidelines on when to use each layout method.",
    image: "/blog-css-grid-flexbox.jpg",
    date: "2023-12-28",
    author: "Ahmed Hassan",
    category: "CSS",
    tags: ["CSS", "Layout", "Design"],
    readTime: "6 min read",
  },
  {
    id: 5,
    title: "Building Responsive Designs with Tailwind CSS",
    description:
      "Learn how to create beautiful, responsive designs using Tailwind CSS utility classes and responsive design principles.",
    image: "/blog-tailwind-responsive.jpg",
    date: "2023-12-20",
    author: "Ahmed Hassan",
    category: "Design",
    tags: ["Tailwind CSS", "Responsive", "UI/UX"],
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "API Design Best Practices for Modern Applications",
    description:
      "Essential guidelines for designing robust, scalable APIs that provide excellent developer experience and maintainability.",
    image: "/blog-api-design.jpg",
    date: "2023-12-15",
    author: "Ahmed Hassan",
    category: "Backend",
    tags: ["API", "Backend", "Architecture"],
    readTime: "9 min read",
  },
]

export function LatestArticlesSection() {
  const [hoveredArticle, setHoveredArticle] = useState<number | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Latest Articles</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with my latest thoughts, tutorials, and tips on web development and design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card
              key={article.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                hoveredArticle === article.id ? "shadow-2xl -translate-y-2" : ""
              }`}
              onMouseEnter={() => setHoveredArticle(article.id)}
              onMouseLeave={() => setHoveredArticle(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    {article.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-background/90 text-foreground">
                    {article.readTime}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{article.description}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  )
}
