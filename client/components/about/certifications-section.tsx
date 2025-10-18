"use client";
import { useState, useEffect, useRef } from "react";
import {
  Award,
  ExternalLink,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import HeaderSection from "../HeaderSection";

interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  status: string;
  description: string;
  color: string;
}

interface Achievement {
  title: string;
  platform: string;
  description: string;
  icon: string;
}

const certifications: Certification[] = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2023",
    credentialId: "AWS-CSA-2023-001",
    status: "Active",
    description:
      "Demonstrates expertise in designing distributed systems on AWS platform.",
    color: "chart-1",
  },
  {
    title: "Google Cloud Professional Developer",
    issuer: "Google Cloud",
    date: "2022",
    credentialId: "GCP-PD-2022-045",
    status: "Active",
    description:
      "Validates skills in developing scalable applications on Google Cloud Platform.",
    color: "chart-2",
  },
  {
    title: "Meta Frontend Developer Certificate",
    issuer: "Meta (Facebook)",
    date: "2021",
    credentialId: "META-FE-2021-789",
    status: "Active",
    description:
      "Comprehensive program covering React, JavaScript, and modern frontend development.",
    color: "chart-3",
  },
];

const achievements: Achievement[] = [
  {
    title: "Top 1% Developer",
    platform: "Stack Overflow",
    description:
      "Recognized for contributions to the developer community with 50K+ reputation points.",
    icon: "trending",
  },
  {
    title: "Open Source Contributor",
    platform: "GitHub",
    description:
      "Active contributor to popular open-source projects with 100+ merged pull requests.",
    icon: "users",
  },
  {
    title: "Technical Writer",
    platform: "Dev.to",
    description:
      "Published 25+ technical articles with 100K+ total views and 5K+ followers.",
    icon: "book",
  },
];

function CertificationCard({
  cert,
  index,
  isVisible,
}: {
  cert: Certification;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className="relative h-full p-6 rounded-2xl bg-card border-2 border-border hover:border-transparent transition-all duration-500 overflow-hidden">
        {/* Animated Gradient Border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: `var(--${cert.color})`,
            filter: "blur(12px)",
          }}
          aria-hidden="true"
        />

        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
            aria-hidden="true"
          />
          <span className="text-xs font-bold text-green-600 dark:text-green-400">
            {cert.status}
          </span>
        </div>

        {/* Certificate Icon */}
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl shadow-lg mb-4 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500"
          style={{ background: `var(--${cert.color})` }}
          aria-hidden="true"
        >
          <Award className="w-6 h-6 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-foreground mb-2 leading-tight pr-16">
          {cert.title}
        </h3>

        {/* Issuer */}
        <p
          className="text-sm font-bold mb-4"
          style={{ color: `var(--${cert.color})` }}
        >
          {cert.issuer}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {cert.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">Issued:</span>
            <span className="text-muted-foreground">{cert.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-foreground">
              Credential ID:
            </span>
            <span className="text-muted-foreground font-mono">
              {cert.credentialId}
            </span>
          </div>
        </div>

        {/* Verify Link */}
        <button
          className="flex items-center gap-2 text-sm font-bold transition-all duration-300 group/link"
          style={{ color: `var(--${cert.color})` }}
        >
          <span>Verify Certificate</span>
          <ExternalLink className="w-4 h-4 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </button>

        {/* Bottom Accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: `var(--${cert.color})` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

function AchievementCard({
  achievement,
  index,
  isVisible,
}: {
  achievement: Achievement;
  index: number;
  isVisible: boolean;
}) {
  const getIcon = () => {
    switch (achievement.icon) {
      case "trending":
        return <TrendingUp className="w-6 h-6" />;
      case "users":
        return <Users className="w-6 h-6" />;
      case "book":
        return <BookOpen className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      style={{ transitionDelay: `${(index + 3) * 100}ms` }}
    >
      {/* Card Container */}
      <div className="relative h-full p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 text-center overflow-hidden">
        {/* Icon Container */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <div className="text-primary">{getIcon()}</div>

          {/* Icon Glow */}
          <div
            className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            aria-hidden="true"
          />
        </div>

        {/* Title */}
        <h4 className="text-xl font-black text-foreground mb-2">
          {achievement.title}
        </h4>

        {/* Platform */}
        <p className="text-sm font-bold text-primary mb-4">
          {achievement.platform}
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {achievement.description}
        </p>

        {/* Hover Effect Background */}
        <div
          className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function CertificationsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={sectionRef}>
      <HeaderSection
        icon={<Award className="animate-pulse" />}
        badgeTitle="Certifications"
        title="Certifications & Achievements"
        description="Continuous learning and professional development through industry-recognized certifications"
        hideCta={true}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Certifications Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <CertificationCard
                key={index}
                cert={cert}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                achievement={achievement}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
