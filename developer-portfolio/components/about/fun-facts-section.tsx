"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Code, Globe, Heart, Zap, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const funFacts = [
  {
    icon: Coffee,
    title: "Coffee Lover",
    description: "500+ cups consumed while coding",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "20+ contributions to community projects",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Global Traveler",
    description: "Coded from 15+ countries",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Heart,
    title: "Mentor",
    description: "Helped 50+ developers start their journey",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Zap,
    title: "Fast Learner",
    description: "Mastered 3 new frameworks this year",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Team Player",
    description: "Led 10+ cross-functional teams",
    color: "from-purple-500 to-violet-500",
  },
]

export function FunFactsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="fun-facts" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fun Facts About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Beyond the code - what makes me tick as a developer and human
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {funFacts.map((fact, index) => {
            const Icon = fact.icon

            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-rotate-1 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="relative">
                    <div
                      className={`inline-flex p-4 rounded-full bg-gradient-to-r ${fact.color} group-hover:scale-110 transition-all duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white group-hover:animate-bounce" />
                    </div>
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${fact.color} rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                    />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {fact.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{fact.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
