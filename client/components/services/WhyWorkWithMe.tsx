import React from "react";
import {
  Zap,
  Shield,
  Target,
  MessageSquare,
  HeadphonesIcon,
  Rocket,
  Award,
  CheckCircle2,
} from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  benefits: string[];
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Full-Stack Expertise",
    description:
      "One developer, complete ownership. No coordination overhead between frontend and backend teams—just seamless, unified development.",
    gradient: "from-yellow-500 to-amber-500",
    benefits: [
      "50% faster delivery",
      "Zero integration issues",
      "Single point of accountability",
    ],
  },
  {
    icon: Rocket,
    title: "Modern Technology Stack",
    description:
      "Built with the latest, production-tested frameworks that major companies trust. Your project stays relevant for years, not months.",
    gradient: "from-indigo-500 to-purple-500",
    benefits: [
      "Future-proof architecture",
      "Better performance",
      "Easier maintenance",
    ],
  },
  {
    icon: Target,
    title: "Business-Focused Results",
    description:
      "Code is a means to an end. I focus on metrics that matter: conversions, revenue, and user satisfaction—not just lines of code.",
    gradient: "from-pink-500 to-rose-500",
    benefits: [
      "ROI-driven decisions",
      "Measurable outcomes",
      "Growth-oriented features",
    ],
  },
  {
    icon: MessageSquare,
    title: "Crystal Clear Communication",
    description:
      "No technical jargon, no ghosting. Weekly updates, transparent timelines, and honest feedback throughout the entire project.",
    gradient: "from-blue-500 to-cyan-500",
    benefits: ["Weekly progress reports", "Always responsive", "No surprises"],
  },
  {
    icon: Shield,
    title: "Security & Compliance First",
    description:
      "Enterprise-grade security built in from day one. GDPR-compliant, encrypted data, and protected against common vulnerabilities.",
    gradient: "from-purple-500 to-violet-500",
    benefits: ["Data encryption", "GDPR compliant", "Regular security audits"],
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Partnership",
    description:
      "I don't disappear after launch. Ongoing support, optimization, and feature development keep your platform competitive.",
    gradient: "from-green-500 to-emerald-500",
    benefits: [
      "Monthly maintenance",
      "Priority support",
      "Continuous optimization",
    ],
  },
];

export default function WhyWorkWithMe() {
  return (
    <section id="whyWork">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl mb-6 shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300">
            <Award
              className="w-4 h-4 text-indigo-400 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-sm tracking-wide">
              YOUR SUCCESS PARTNER
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Why Work With Me
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Technical excellence meets exceptional client experience. Here's
            what sets me apart.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 text-center hover:border-slate-600 transition-all duration-300">
          <h3 className="text-3xl font-black text-white mb-4">
            Ready to Build Something Amazing?
          </h3>
          <p className="text-lg text-slate-400 mb-6 max-w-2xl mx-auto">
            Let's discuss your project and create a solution that exceeds
            expectations. No pressure, just honest conversation about what's
            possible.
          </p>
          <button
            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 inline-flex items-center gap-2"
            aria-label="Schedule a free consultation"
          >
            Schedule a Free Consultation
            <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <article
      className="group relative rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-600"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon with Gradient Background */}
      <div
        className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br ${feature.gradient}`}
      >
        <Icon className="h-7 w-7 text-white" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3
        className="mb-3 text-xl font-black text-white transition-all duration-300 group-hover:text-transparent bg-clip-text group-hover:bg-gradient-to-r"
        style={{
          backgroundImage: feature.gradient.includes("yellow")
            ? "linear-gradient(135deg, rgb(234 179 8), rgb(245 158 11))"
            : feature.gradient.includes("indigo")
            ? "linear-gradient(135deg, rgb(99 102 241), rgb(168 85 247))"
            : feature.gradient.includes("pink")
            ? "linear-gradient(135deg, rgb(236 72 153), rgb(244 63 94))"
            : feature.gradient.includes("blue")
            ? "linear-gradient(135deg, rgb(59 130 246), rgb(6 182 212))"
            : feature.gradient.includes("purple")
            ? "linear-gradient(135deg, rgb(168 85 247), rgb(139 92 246))"
            : "linear-gradient(135deg, rgb(34 197 94), rgb(16 185 129))",
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        {feature.description}
      </p>

      {/* Benefits List */}
      <ul className="space-y-2" role="list">
        {feature.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-xs">
            <CheckCircle2
              className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400"
              aria-hidden="true"
            />
            <span className="text-slate-400">{benefit}</span>
          </li>
        ))}
      </ul>

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10`}
        aria-hidden="true"
      />
    </article>
  );
};

export { WhyWorkWithMe };
