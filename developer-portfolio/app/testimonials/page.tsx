import type { Metadata } from "next"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

export const metadata: Metadata = {
  title: "Testimonials - DevPortfolio",
  description: "What clients say about working with me",
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "TechStart Inc.",
    avatar: "/client-avatar-1.jpg",
    rating: 5,
    testimonial:
      "Working with this developer was an absolute pleasure. They delivered our e-commerce platform ahead of schedule and exceeded all our expectations. The attention to detail and code quality is outstanding.",
    project: "E-Commerce Platform",
    date: "December 2024",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateLab",
    avatar: "/client-avatar-2.jpg",
    rating: 5,
    testimonial:
      "The SaaS dashboard they built for us has significantly improved our team's productivity. The user interface is intuitive and the performance is exceptional. Highly recommended!",
    project: "SaaS Dashboard",
    date: "November 2024",
    featured: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthCorp",
    avatar: "/client-avatar-3.jpg",
    rating: 5,
    testimonial:
      "Our new landing page has increased conversions by 40%! The design is modern, responsive, and perfectly captures our brand identity. Excellent work from start to finish.",
    project: "Landing Page Redesign",
    date: "October 2024",
    featured: false,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Founder",
    company: "RestaurantPro",
    avatar: "/client-avatar-4.jpg",
    rating: 5,
    testimonial:
      "The restaurant website and reservation system they developed has streamlined our operations completely. Our customers love the new online ordering feature.",
    project: "Restaurant Website",
    date: "September 2024",
    featured: false,
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "CTO",
    company: "FinanceFlow",
    avatar: "/client-avatar-5.jpg",
    rating: 5,
    testimonial:
      "The crypto trading dashboard is exactly what we needed. Real-time data, beautiful charts, and rock-solid performance. They truly understand both design and functionality.",
    project: "Trading Dashboard",
    date: "August 2024",
    featured: true,
  },
  {
    id: 6,
    name: "James Miller",
    role: "Content Manager",
    company: "BlogCentral",
    avatar: "/client-avatar-6.png",
    rating: 5,
    testimonial:
      "Our new blog platform has made content management so much easier. The markdown editor and SEO features are fantastic. Great communication throughout the project.",
    project: "Blog Platform",
    date: "July 2024",
    featured: false,
  },
]

const stats = [
  { label: "Happy Clients", value: "50+" },
  { label: "Projects Completed", value: "75+" },
  { label: "Average Rating", value: "4.9/5" },
  { label: "Years Experience", value: "5+" },
]

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Client <span className="text-primary">Testimonials</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Don't just take my word for it. Here's what my clients have to say about working with me and the results
            we've achieved together.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {testimonials
              .filter((testimonial) => testimonial.featured)
              .map((testimonial) => (
                <Card key={testimonial.id} className="relative overflow-hidden">
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                        <p className="text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {testimonial.project}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-lg leading-relaxed mb-4">"{testimonial.testimonial}"</blockquote>
                    <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* All Testimonials */}
          <h2 className="text-3xl font-bold mb-8 text-center">All Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative">
                <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/20" />
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback className="text-sm">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <blockquote className="text-sm leading-relaxed mb-3 line-clamp-4">
                    "{testimonial.testimonial}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {testimonial.project}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join These Happy Clients?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your project and see how I can help you achieve your goals. I'm committed to delivering
            exceptional results for every client.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Start Your Project
            </a>
            <a
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              View My Work
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
