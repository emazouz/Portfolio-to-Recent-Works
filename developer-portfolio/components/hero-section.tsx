"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Download, Star } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const fullText = "Transform your ideas into pixel-perfect reality."

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 1000)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-purple-600/10 rounded-full animate-float animate-delay-200" />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/10 rounded-full animate-float animate-delay-400" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-scale-in">
            <Star className="h-4 w-4 fill-current animate-pulse-gentle" />
            Premium Developer Templates & Services
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 animate-fade-in-up">
            Crafting{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
              Premium
            </span>{" "}
            Digital Experiences
          </h1>

          <div className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto animate-fade-in-up animate-delay-200">
            <p className="mb-2">
              Professional developer specializing in modern web applications, premium templates, and scalable solutions.
            </p>
            <p className="min-h-[2rem]">
              {typedText}
              {showCursor && <span className="animate-pulse">|</span>}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animate-delay-300">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg animate-glow hover:animate-bounce-gentle transition-all duration-300"
            >
              <Link href="/templates" className="flex items-center gap-2">
                Browse Templates
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Get Started
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 animate-fade-in-up animate-delay-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-background animate-scale-in animate-delay-${i * 100}`}
                  />
                ))}
              </div>
              <span>500+ Happy Clients</span>
            </div>
            <div className="flex items-center gap-1 animate-fade-in-up animate-delay-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 fill-yellow-400 text-yellow-400 animate-scale-in animate-delay-${i * 50}`}
                />
              ))}
              <span className="ml-2">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
