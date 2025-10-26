"use client";

import {
  Download,
  Mail,
  MapPin,
  Briefcase,
  Code2,
  Database,
  Layers,
  Sparkles,
  Heart,
  Lightbulb,
  Rocket,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/constants/contact.constants";
import Link from "next/link";
import { getChartGradientVar } from "@/handlers/index.handlers";
import {
  ECOMMERCE_FEATURES,
  JOURNEY_TIMELINE,
  PROFILE_INFO,
  SKILLS,
  SKILLS_BADGE,
} from "@/constants/about.constants";
import { Card } from "../ui/card";

const SkillBadge = ({
  skill,
  themeClasses,
}: {
  skill: string;
  themeClasses: string;
}) => {
  return (
    <span
      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-transform hover:scale-105 border border-secondary`}
      style={{ backgroundImage: themeClasses }}
    >
      {skill}
    </span>
  );
};

const SectionHeader = ({
  icon: Icon,
  title,
  iconBgGradient,
}: {
  icon: LucideIcon;
  title: string;
  iconBgGradient: string;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div
      className={`p-3 rounded-xl shadow-lg`}
      style={{ backgroundImage: iconBgGradient }}
    >
      <Icon className="w-6 h-6" />
    </div>
    <h2 className="text-2xl font-black text-foreground">{title}</h2>
  </div>
);


export default function AboutHero() {
  return (
    <section aria-label="About Me">
      <div className="wrapper">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar - Profile & Navigation */}
          <aside className="lg:w-1/3 w-full lg:sticky lg:top-24">
            <Card className="p-6 space-y-6">
              {/* Profile Image */}
              <div className="relative group">
                <div
                  className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/80 to-secondary rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"
                  aria-hidden="true"
                ></div>
                <div className="relative h-[400px]">
                  <div
                    className="w-full aspect-square overflow-hidden shadow-xl"
                    role="img"
                    aria-label={`${PROFILE_INFO.name} profile picture`}
                  >
                    <Image
                      src={PROFILE_INFO.img}
                      alt={PROFILE_INFO.name}
                      className="rounded-2xl"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-[var(--color-secondary)] p-3 rounded-xl shadow-lg border-4 border-[var(--color-card)]">
                    <Sparkles
                      className="w-5 h-5 text-[var(--color-secondary-foreground)]"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
              {/* Profile Info */}
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent mb-2">
                  {PROFILE_INFO.name}
                </h1>
                <div className="flex items-center gap-2 text-lg font-bold mb-3 text-[var(--color-foreground)]">
                  <Briefcase
                    className="w-5 h-5 text-[var(--color-primary)]"
                    aria-hidden="true"
                  />
                  <span>{PROFILE_INFO.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-4">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>{PROFILE_INFO.location}</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                  <p className="text-sm text-[var(--color-foreground)] leading-relaxed font-medium">
                    {PROFILE_INFO.tagline}
                  </p>
                </div>
              </div>
              {/* Journey Timeline */}
              <nav aria-label="My Journey Timeline">
                <h3 className="text-sm font-black text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
                  My Journey
                </h3>
                <ul className="space-y-3">
                  {JOURNEY_TIMELINE.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-3 group cursor-pointer hover:translate-x-1 transition-transform"
                      >
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 text-[var(--color-primary-foreground)] shadow-md group-hover:shadow-lg transition-shadow">
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-[var(--color-primary)]">
                            {item.year}
                          </div>
                          <div className="text-sm font-semibold text-[var(--color-foreground)]">
                            {item.title}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              {/* Social Links */}
              <div
                className="flex gap-3"
                role="group"
                aria-label="Social media links"
              >
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300 hover:scale-110 group"
                      aria-label={social.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-5 w-5 text-[var(--color-muted-foreground)] group-hover:text-[var(--color-primary)] transition-colors" />
                    </Link>
                  );
                })}
              </div>
              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                <Link
                  href="/cv.pdf"
                  download
                  className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 hover:from-[var(--color-primary)]/90 hover:to-[var(--color-primary)]/70 text-[var(--color-primary-foreground)] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                  <Download
                    className="mr-2 h-4 w-4 group-hover:animate-bounce"
                    aria-hidden="true"
                  />
                  Download CV
                </Link>
                <Link
                  href={`mailto:${PROFILE_INFO.email}`}
                  className="flex items-center justify-center w-full px-6 py-3 border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] font-bold rounded-xl transition-all"
                >
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  Contact Me
                </Link>
              </div>
            </Card>
          </aside>
          {/* Right Content - Story */}
          <main className="pt-6 space-y-8">
            {/* Introduction */}
            <Card className="p-6">
              <SectionHeader
                icon={Heart}
                title="The Spark"
                iconBgGradient={getChartGradientVar(SKILLS_BADGE.HEART)}
              />
              <div className="space-y-4 text-[var(--color-muted-foreground)] leading-relaxed">
                <p className="text-lg">
                  My journey into web development began with something pure and
                  powerful:{" "}
                  <span className="font-bold text-[var(--color-primary)]">
                    love
                  </span>
                  . Not the love that fades when things get difficult, but the
                  kind that burns brighter with every challenge. I genuinely,
                  deeply loved programming from the moment I wrote my first line
                  of code.
                </p>
                <p>
                  But love alone doesn't guarantee success. My early days were
                  marked by confusion and false starts. I jumped straight into
                  HTML, CSS, JavaScript, and GitHub—thinking that learning
                  syntax would make me a developer. I was wrong. Despite
                  memorizing tags and functions, I found myself paralyzed when
                  faced with real problems.
                </p>
              </div>
            </Card>
            {/* The Pivot */}
            <Card className="p-6 ">
              <SectionHeader
                icon={Lightbulb}
                title="The Pivot: Embracing True Foundations"
                iconBgGradient={getChartGradientVar(SKILLS_BADGE.OTHER)}
              />
              <div className="space-y-4 text-[var(--color-muted-foreground)] leading-relaxed">
                <p>
                  The moment I admitted I was lost was the moment everything
                  changed. I made what would become the single best decision of
                  my career:{" "}
                  <span className="font-bold text-[var(--color-secondary)]">
                    I started over
                  </span>
                  . Completely. From absolute zero.
                </p>
                <p>
                  I stepped away from the glamorous world of frameworks and dove
                  into{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    C++
                  </span>
                  . Through it, I discovered the profound beauty of
                  Object-Oriented Programming, algorithms, data structures, and
                  systematic problem-solving. This wasn't just learning—it was
                  transformation.
                </p>
              </div>
            </Card>
            {/* Frontend Evolution */}
            <Card className="p-6 ">
              <SectionHeader
                icon={Code2}
                title="Frontend Evolution"
                iconBgGradient={getChartGradientVar(SKILLS_BADGE.FRONTEND)}
              />
              <div className="space-y-4 text-[var(--color-muted-foreground)] leading-relaxed">
                <p>
                  When I returned to React.js armed with programming
                  fundamentals, everything clicked. My learning velocity
                  exploded. I built my first project—the universal rite of
                  passage: the{" "}
                  <span className="font-semibold italic text-[var(--color-foreground)]">
                    Todo List
                  </span>{" "}
                  😄
                </p>
                <p>
                  I created frontend applications that solved real problems,
                  embraced{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    Tailwind CSS
                  </span>
                  , and mastered{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    TypeScript
                  </span>
                  . Yet as my frontend skills grew, so did my curiosity:{" "}
                  <span className="font-bold text-[var(--color-primary)]">
                    What happens behind the curtain?
                  </span>
                </p>
              </div>
              {/* Frontend Skills */}
              <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                <h3 className="text-sm font-black text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
                  Frontend Arsenal
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.frontend.map((skill) => (
                    <SkillBadge
                      key={skill}
                      skill={skill}
                      themeClasses={getChartGradientVar(SKILLS_BADGE.FRONTEND)}
                    />
                  ))}
                </div>
              </div>
            </Card>
            {/* Backend Journey */}
            <Card className="p-6">
              <SectionHeader
                icon={Database}
                title="Backend Journey: Falling in Love Again"
                iconBgGradient={getChartGradientVar(SKILLS_BADGE.DATABASE)}
              />
              <div className="space-y-4 text-[var(--color-muted-foreground)] leading-relaxed">
                <p>
                  I dove into{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    .NET with C#
                  </span>
                  —and here's where my OOP foundation paid massive dividends. I
                  learned how servers orchestrate requests, how databases store
                  and retrieve data with SQL Server, how APIs become the nervous
                  system of applications.
                </p>
                <p>
                  But I didn't stop with one ecosystem. I explored{" "}
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    Node.js
                  </span>{" "}
                  and the MERN stack.{" "}
                  <span className="font-bold text-[var(--color-foreground)]">
                    Today, Node.js is my primary backend environment
                  </span>
                  —its asynchronous nature and vast ecosystem make it my go-to
                  for building scalable applications.
                </p>
              </div>
              {/* Backend & Database Skills */}
              <div className="mt-6 pt-6 border-t border-[var(--color-border)] space-y-4">
                <div>
                  <h3 className="text-sm font-black text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
                    Backend Mastery
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.backend.map((skill) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        themeClasses={getChartGradientVar(SKILLS_BADGE.BACKEND)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--color-muted-foreground)] uppercase tracking-wider mb-3">
                    Database Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.database.map((skill) => (
                      <SkillBadge
                        key={skill}
                        skill={skill}
                        themeClasses={getChartGradientVar(
                          SKILLS_BADGE.DATABASE
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            {/* E-Commerce Project */}
            <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 rounded-3xl shadow-2xl p-8 text-[var(--color-primary-foreground)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-lg shadow-lg">
                  <Layers className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-black">
                  Signature Project: E-Commerce Platform
                </h2>
              </div>
              <div className="space-y-4 leading-relaxed">
                <p className="text-[var(--color-primary-foreground)]/80">
                  My most comprehensive project—a full-featured online shopping
                  experience built from scratch with Next.js, Node.js,
                  PostgreSQL, and Docker.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {ECOMMERCE_FEATURES.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
                    >
                      <div className="text-xs font-bold text-[var(--color-primary-foreground)]/60 uppercase tracking-wider mb-1">
                        {item.label}
                      </div>
                      <div className="font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* DevOps */}
            <Card className="p-6">
              <SectionHeader
                icon={Terminal}
                title="DevOps & Modern Workflow"
                iconBgGradient={getChartGradientVar(SKILLS_BADGE.DEVOPS)}
              />
              <div className="flex flex-wrap gap-2">
                {SKILLS.devops.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    themeClasses={getChartGradientVar(SKILLS_BADGE.DEVOPS)}
                  />
                ))}
              </div>
            </Card>
            {/* Passion & Future */}
            <Card className="p-6">
              <SectionHeader
                icon={Rocket}
                title="The Passion: Continuous Learning"
                iconBgGradient={getChartGradientVar(SKILLS_BADGE.CODE)}
              />
              <div className="space-y-4 text-[var(--color-muted-foreground)] leading-relaxed">
                <p>
                  My love for programming hasn't diminished—it's matured. The
                  initial spark has become a sustained fire.{" "}
                  <span className="font-bold text-[var(--color-secondary)]">
                    Backend development holds a special place in my heart
                  </span>
                  —there's something profound about architecting systems that
                  scale beautifully.
                </p>
                <p className="font-semibold text-[var(--color-foreground)]">
                  Today, I work primarily with Node.js, TypeScript, Next.js,
                  PostgreSQL, and Docker—a modern, powerful stack that lets me
                  build anything from MVPs to enterprise applications.
                </p>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </section>
  );
}
