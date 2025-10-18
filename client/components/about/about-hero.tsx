
import meImage from "@/assets/images/me.jpg";
import { Button } from "@/components/ui/button";
import {
  Download,
  Mail,
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Briefcase,
  Youtube,
  Facebook,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// FIX: Update SOCIAL_LINKS to use theme-aware chart keys
const SOCIAL_LINKS = [
  {
    icon: Github,
    href: "#",
    label: "GitHub profile",
    gradientKey: "chart-9", // Grey/Slate
  },
  {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn profile",
    gradientKey: "chart-3", // Blue/Cyan
  },
  {
    icon: Twitter,
    href: "#",
    label: "Twitter profile",
    gradientKey: "chart-8", // Teal/Green
  },
  {
    icon: Youtube,
    href: "#",
    label: "Youtube profile",
    gradientKey: "chart-7", // Orange/Red
  },
  {
    icon: Facebook,
    href: "#",
    label: "Facebook profile",
    gradientKey: "chart-3", // Blue/Cyan
  },
];

export function AboutHero() {

  return (
    <section className="py-20">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Sidebar - Profile & Navigation */}
        <div className="lg:w-1/3 lg:sticky lg:top-24">
          <div className="space-y-8 rounded-2xl">
            {/* Profile Image (unchanged, as the image source is external) */}
            <div className="relative group">
              <div className="relative">
                <Image
                  src={meImage}
                  alt="Younes eMazouz"
                  width={200}
                  height={200}
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Profile Info */}
            <div>
              {/* FIX: Name uses foreground color */}
              <h1 className="text-3xl font-black text-foreground mb-2">
                Younes eMazouz
              </h1>
              {/* FIX: Role uses primary gradient clip and color */}
              <div className="flex items-center gap-2 text-lg text-primary font-bold mb-3">
                <Briefcase className="w-5 h-5 text-primary" />
                Full-Stack Developer
              </div>
              {/* FIX: Location uses muted-foreground */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                Available for remote work
              </div>
              {/* FIX: Description box uses muted background and border */}
              <p className="text-sm text-muted-foreground leading-relaxed p-4 rounded-xl bg-muted/50 border border-border">
                I build accessible, pixel-perfect digital experiences for the
                web.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    // FIX: Buttons use accent/border/muted theme colors
                    className={`p-3 rounded-xl bg-accent/30 border border-border hover:border-primary transition-all duration-300 hover:scale-110 group`}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* FIX: Icon uses foreground color and accent hover */}
                    <Icon className="h-5 w-5 text-foreground/80 group-hover:text-primary transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Content - About Text */}
        <div className="lg:w-2/3 space-y-8">
          {/* Content Paragraphs */}
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              I'm a developer passionate about crafting accessible,
              pixel-perfect user interfaces that blend thoughtful design with
              robust engineering. My favorite work lies at the intersection of
              design and development, creating experiences that not only look
              great but are meticulously built for performance and usability.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground">
              Currently, I'm a Senior Full-Stack Developer at{" "}
              {/* FIX: Highlight uses theme primary color */}
              <span className="text-primary font-bold">TechCorp</span>,
              specializing in accessibility. I contribute to the creation and
              maintenance of UI components that power TechCorp's frontend,
              ensuring our platform meets web accessibility standards and best
              practices to deliver an inclusive user experience.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground">
              In the past, I've had the opportunity to develop software across a
              variety of settings — from{" "}
              {/* FIX: Highlights use foreground color */}
              <span className="text-foreground font-semibold">
                advertising agencies
              </span>{" "}
              and{" "}
              <span className="text-foreground font-semibold">
                large corporations
              </span>{" "}
              to{" "}
              <span className="text-foreground font-semibold">start-ups</span>{" "}
              and{" "}
              <span className="text-foreground font-semibold">
                small digital product studios
              </span>
              . Additionally, I also released a{" "}
              <span className="text-foreground font-semibold">
                comprehensive video course
              </span>{" "}
              a few years ago, guiding learners through building a web app with
              the Spotify API.
            </p>

            <p className="text-lg leading-relaxed text-muted-foreground">
              In my spare time, I'm usually climbing, reading, hanging out with
              my wife and two cats, or running around Hyrule searching for{" "}
              <span className="text-foreground font-semibold">Korok seeds</span>
              .
            </p>
          </div>

          {/* Skills Highlight */}
          <div
            // FIX: Uses primary/border/card theme colors
            className="p-8 rounded-2xl bg-card border border-border/50 backdrop-blur-xl"
          >
            <h3 className="text-xl font-black text-foreground mb-4">
              Core Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js",
                "React",
                "TypeScript",
                "Node.js",
                "AWS",
                "Docker",
                "Accessibility",
                "UI/UX",
              ].map((skill) => (
                <span
                  key={skill}
                  // FIX: Badge uses muted/border/primary hover theme colors
                  className="px-4 py-2 bg-muted/70 border border-border text-muted-foreground text-sm font-semibold rounded-xl hover:border-primary hover:text-primary transition-all hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              // FIX: Primary button uses theme primary colors
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold group"
              asChild
            >
              <Link href="#">
                <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Download CV
              </Link>
            </Button>
            <Button
              variant="outline"
              // FIX: Outline button uses theme border/muted colors
              className="w-full border-border hover:bg-muted hover:border-primary text-foreground"
              asChild
            >
              <Link href="mailto:alex@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
