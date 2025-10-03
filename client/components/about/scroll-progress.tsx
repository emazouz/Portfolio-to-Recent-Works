"use client"

import { useEffect, useState } from "react"
import { User, Code, Briefcase, Lightbulb, Target } from "lucide-react"

const sections = [
  { id: "hero", label: "About", icon: User },
  { id: "intro", label: "Intro", icon: User },
  { id: "skills", label: "Skills", icon: Code },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "fun-facts", label: "Facts", icon: Lightbulb },
  { id: "cta", label: "Contact", icon: Target },
]

export function ScrollProgress() {
  const [activeSection, setActiveSection] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)

      // Find active section
      const sectionElements = sections.map((section) => document.getElementById(section.id)).filter(Boolean)

      const currentSection = sectionElements.find((section) => {
        if (!section) return false
        const rect = section.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-48 bg-muted-foreground/20 rounded-full" />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-purple-600 to-amber-500 rounded-full transition-all duration-300 ease-out"
          style={{ height: `${(scrollProgress / 100) * 192}px` }}
        />

        <div className="relative space-y-8 py-4">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = activeSection === section.id

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group relative flex items-center transition-all duration-300 ${
                  isActive ? "scale-110" : "hover:scale-105"
                }`}
                title={section.label}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-amber-500 border-purple-600 shadow-lg shadow-purple-500/50"
                      : "bg-background border-muted-foreground/40 group-hover:border-purple-600 group-hover:bg-purple-50 dark:group-hover:bg-purple-950"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full animate-ping opacity-75" />
                  )}
                </div>

                <div
                  className={`absolute right-6 bg-background border rounded-lg px-3 py-2 shadow-lg transition-all duration-300 whitespace-nowrap ${
                    isActive || "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
