"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, ExternalLink } from "lucide-react"

const certifications = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-CSA-2023-001",
    status: "Active",
    description: "Demonstrates expertise in designing distributed systems on AWS platform.",
  },
  {
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "2022",
    credentialId: "GCP-PD-2022-045",
    status: "Active",
    description: "Validates skills in developing scalable applications on Google Cloud Platform.",
  },
  {
    title: "Meta Frontend Developer Certificate",
    issuer: "Meta (Facebook)",
    date: "2021",
    credentialId: "META-FE-2021-789",
    status: "Active",
    description: "Comprehensive program covering React, JavaScript, and modern frontend development.",
  },
]

const achievements = [
  {
    title: "Top 1% Developer",
    platform: "Stack Overflow",
    description: "Recognized for contributions to the developer community with 50K+ reputation points.",
  },
  {
    title: "Open Source Contributor",
    platform: "GitHub",
    description: "Active contributor to popular open-source projects with 100+ merged pull requests.",
  },
  {
    title: "Technical Writer",
    platform: "Dev.to",
    description: "Published 25+ technical articles with 100K+ total views and 5K+ followers.",
  },
]

export function CertificationsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications & Achievements</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Continuous learning and professional development through industry-recognized certifications
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              Professional Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{cert.title}</CardTitle>
                        <CardDescription className="font-medium text-purple-600 dark:text-purple-400">
                          {cert.issuer}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {cert.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Issued:</span> {cert.date}
                      </div>
                      <div>
                        <span className="font-medium">Credential ID:</span> {cert.credentialId}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-purple-600 hover:text-purple-700 cursor-pointer text-sm">
                      <ExternalLink className="h-4 w-4" />
                      Verify Certificate
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">Community & Recognition</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                      <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{achievement.title}</h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-3">
                      {achievement.platform}
                    </p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
