"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Eye } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function AboutCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="cta" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-background to-amber-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-amber-600/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center space-y-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">
              Want to build something{" "}
              <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                amazing together?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Let's turn your ideas into exceptional digital experiences that make a real impact
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-purple-500/25 animate-bounce-subtle group px-8 py-6 text-lg"
            >
              <Eye className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              View My Work
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 hover:scale-105 px-8 py-6 text-lg group bg-transparent"
            >
              Contact Me
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
