"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Startup Founder",
    company: "TechStart Inc.",
    content:
      "The e-commerce template saved us months of development time. The code quality is exceptional and the design is exactly what we needed for our MVP.",
    rating: 5,
    avatar: "/professional-woman-avatar.png",
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    company: "Digital Agency",
    content:
      "Outstanding work! The templates are well-documented, responsive, and easy to customize. Our clients love the final results.",
    rating: 5,
    avatar: "/professional-man-avatar.png",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "SaaS Company",
    content:
      "Professional service from start to finish. The custom development exceeded our expectations and was delivered on time.",
    rating: 5,
    avatar: "/professional-woman-avatar-2.png",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Clients Say</h2>
          <p className="text-xl text-muted-foreground">Don't just take our word for it - hear from satisfied clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-muted-foreground mb-6 italic">"{testimonial.content}"</blockquote>

                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
