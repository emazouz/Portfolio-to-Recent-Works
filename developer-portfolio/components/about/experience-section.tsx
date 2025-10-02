"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

const experiences = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    period: "2022 - Present",
    description:
      "Lead frontend development for a SaaS platform serving 100K+ users. Architected and implemented a component library that reduced development time by 40%. Mentored junior developers and established best practices for code quality.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    achievements: [
      "Improved application performance by 60%",
      "Led migration to TypeScript",
      "Built design system used across 5 products",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    period: "2020 - 2022",
    description:
      "Developed and maintained multiple client projects from concept to deployment. Built responsive web applications, RESTful APIs, and integrated third-party services. Collaborated directly with clients to understand requirements and deliver solutions.",
    technologies: ["Vue.js", "Node.js", "Express", "MongoDB", "AWS"],
    achievements: [
      "Delivered 15+ client projects on time",
      "Reduced server costs by 30% through optimization",
      "Implemented CI/CD pipelines",
    ],
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency Pro",
    location: "New York, NY",
    period: "2019 - 2020",
    description:
      "Created pixel-perfect, responsive websites for various clients including e-commerce platforms, corporate websites, and landing pages. Worked closely with designers to implement complex UI/UX designs.",
    technologies: ["HTML5", "CSS3", "JavaScript", "jQuery", "WordPress"],
    achievements: [
      "Built 25+ responsive websites",
      "Achieved 95+ PageSpeed scores",
      "Increased client conversion rates by 25%",
    ],
  },
]

export function ExperienceSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey of growth, learning, and delivering impactful solutions across various industries
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((experience, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{experience.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-purple-600 dark:text-purple-400">
                      {experience.company}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {experience.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {experience.location}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">{experience.description}</p>

                <div>
                  <h4 className="font-semibold mb-3">Key Achievements</h4>
                  <ul className="space-y-2">
                    {experience.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="flex items-start gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
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
