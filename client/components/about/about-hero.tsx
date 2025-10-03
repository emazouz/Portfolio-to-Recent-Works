"use client";

import { Button } from "@/components/ui/button";
import { Download, Mail, Github, Linkedin, Twitter } from "lucide-react";

export function AboutHero() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left side - Navigation */}
            <div className="lg:w-1/3">
              <nav className="space-y-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Alex Johnson</h1>
                  <p className="text-lg text-muted-foreground">
                    Full-Stack Developer
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    I build accessible, pixel-perfect digital experiences for
                    the web.
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href="#about"
                    className="block text-sm font-medium hover:text-accent transition-colors"
                  >
                    ABOUT
                  </a>
                  <a
                    href="#experience"
                    className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                  >
                    EXPERIENCE
                  </a>
                  <a
                    href="#projects"
                    className="block text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
                  >
                    PROJECTS
                  </a>
                </div>

                <div className="flex gap-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </nav>
            </div>

            {/* Right side - Main content */}
            <div className="lg:w-2/3 space-y-8">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  I'm a developer passionate about crafting accessible,
                  pixel-perfect user interfaces that blend thoughtful design
                  with robust engineering. My favorite work lies at the
                  intersection of design and development, creating experiences
                  that not only look great but are meticulously built for
                  performance and usability.
                </p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  Currently, I'm a Senior Full-Stack Developer at{" "}
                  <span className="text-accent font-medium">TechCorp</span>,
                  specializing in accessibility. I contribute to the creation
                  and maintenance of UI components that power TechCorp's
                  frontend, ensuring our platform meets web accessibility
                  standards and best practices to deliver an inclusive user
                  experience.
                </p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  In the past, I've had the opportunity to develop software
                  across a variety of settings — from{" "}
                  <span className="text-foreground font-medium">
                    advertising agencies
                  </span>{" "}
                  and{" "}
                  <span className="text-foreground font-medium">
                    large corporations
                  </span>{" "}
                  to{" "}
                  <span className="text-foreground font-medium">start-ups</span>{" "}
                  and
                  <span className="text-foreground font-medium">
                    {" "}
                    small digital product studios
                  </span>
                  . Additionally, I also released a{" "}
                  <span className="text-foreground font-medium">
                    comprehensive video course
                  </span>{" "}
                  a few years ago, guiding learners through building a web app
                  with the Spotify API.
                </p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  In my spare time, I'm usually climbing, reading, hanging out
                  with my wife and two cats, or running around Hyrule searching
                  for{" "}
                  <span className="text-foreground font-medium">
                    Korok seeds
                  </span>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Me
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
