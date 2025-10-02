"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Palette, Smartphone, Zap, Globe, Shield } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Custom Web Development",
    description: "Full-stack web applications built with modern technologies like Next.js, React, and Node.js.",
    features: ["Responsive Design", "SEO Optimized", "Performance Focused"],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, user-centered designs that convert visitors into customers.",
    features: ["User Research", "Wireframing", "Prototyping"],
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    features: ["React Native", "Flutter", "Progressive Web Apps"],
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Speed up your existing applications and improve user experience.",
    features: ["Core Web Vitals", "Bundle Optimization", "Caching Strategies"],
  },
  {
    icon: Globe,
    title: "E-commerce Solutions",
    description: "Complete online stores with payment integration and inventory management.",
    features: ["Stripe Integration", "Inventory Management", "Analytics"],
  },
  {
    icon: Shield,
    title: "Security & Maintenance",
    description: "Keep your applications secure and up-to-date with ongoing support.",
    features: ["Security Audits", "Regular Updates", "24/7 Monitoring"],
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Services & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive development services to bring your digital vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <service.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
