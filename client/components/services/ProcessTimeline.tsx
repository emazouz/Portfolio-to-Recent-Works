import React, { useMemo } from "react";
import {
  Search,
  Palette,
  Code,
  TestTube,
  Rocket,
  Wrench,
  Clock,
} from "lucide-react";

interface TimelineStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  duration?: string;
  deliverables?: string[];
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    icon: Search,
    title: "Discovery & Strategy",
    description:
      "Deep dive into your business goals, target audience, and competitive landscape. We define success metrics and create a strategic roadmap.",
    duration: "3-5 days",
    deliverables: [
      "Requirements document",
      "Project timeline",
      "Technical specification",
    ],
  },
  {
    icon: Palette,
    title: "Design & Prototyping",
    description:
      "Transform ideas into beautiful, user-centered designs. Interactive prototypes let you experience the final product before a single line of code is written.",
    duration: "1-2 weeks",
    deliverables: [
      "Wireframes",
      "High-fidelity mockups",
      "Interactive prototype",
    ],
  },
  {
    icon: Code,
    title: "Development",
    description:
      "Building your solution with clean, maintainable code using modern technologies. Regular updates keep you informed every step of the way.",
    duration: "3-6 weeks",
    deliverables: ["Core functionality", "Admin dashboard", "API integration"],
  },
  {
    icon: TestTube,
    title: "Testing & QA",
    description:
      "Rigorous testing across devices, browsers, and scenarios. Performance optimization, security audits, and accessibility compliance ensure excellence.",
    duration: "1 week",
    deliverables: ["Test reports", "Bug fixes", "Performance optimization"],
  },
  {
    icon: Rocket,
    title: "Launch & Deployment",
    description:
      "Smooth deployment to production with zero downtime. DNS configuration, SSL certificates, and monitoring systems ensure a successful launch.",
    duration: "2-3 days",
    deliverables: [
      "Production deployment",
      "Monitoring setup",
      "Documentation",
    ],
  },
  {
    icon: Wrench,
    title: "Support & Optimization",
    description:
      "Continuous monitoring, updates, and optimization. Monthly performance reports and proactive maintenance keep your platform running flawlessly.",
    duration: "Ongoing",
    deliverables: [
      "Monthly reports",
      "Security updates",
      "Feature enhancements",
    ],
  },
];

export default function ProcessTimeline() {
  return (
    <section id="processTimeline">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl mb-6">
          <Clock className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-sm">
            PROVEN WORKFLOW
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          My Development Process
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          A streamlined 6-step workflow that delivers exceptional results on
          time, every time
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical gradient line - hidden on mobile */}
        <div className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 md:block rounded-full shadow-lg shadow-purple-500/30" />

        {/* Timeline Steps */}
        <div className="space-y-12">
          {TIMELINE_STEPS.map((step, index) => (
            <TimelineItem
              key={step.title}
              step={step}
              index={index}
              isLast={index === TIMELINE_STEPS.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Total Timeline Summary */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 text-center">
        <h3 className="text-2xl font-black text-white mb-2">
          Total Project Timeline
        </h3>
        <p className="text-slate-400 mb-4">
          From concept to launch in as little as
        </p>
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          6-10 Weeks
        </div>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  step: TimelineStep;
  index: number;
  isLast: boolean;
}

const TimelineItem = ({ step, index, isLast }: TimelineItemProps) => {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  const gradientColors = useMemo(() => {
    const gradients = [
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-blue-500 to-cyan-500",
      "from-yellow-500 to-amber-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-violet-500",
    ];
    return gradients[index % gradients.length];
  }, [index]);

  return (
    <div
      className={`relative flex items-center gap-8 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content Card */}
      <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
        <div className="group rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl p-6 shadow-xl hover:shadow-2xl hover:border-slate-600 transition-all duration-300 hover:scale-[1.02]">
          {/* Header with Icon */}
          <div
            className={`mb-4 flex items-center gap-3 ${
              isEven ? "md:justify-end" : "md:justify-start"
            }`}
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradientColors} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-black text-white">
                  {step.title}
                </h3>
              </div>
              {step.duration && (
                <p
                  className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${gradientColors}`}
                >
                  {step.duration}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-300 mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Deliverables */}
          {step.deliverables && step.deliverables.length > 0 && (
            <div className={`${isEven ? "md:text-right" : "md:text-left"}`}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Deliverables
              </h4>
              <div
                className={`flex flex-wrap gap-2 ${
                  isEven ? "md:justify-end" : "md:justify-start"
                }`}
              >
                {step.deliverables.map((deliverable) => (
                  <span
                    key={deliverable}
                    className="px-3 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold rounded-full hover:border-indigo-500/50 transition-all"
                  >
                    {deliverable}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Number Badge - Mobile Only */}
        <div className="md:hidden mt-4 flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center text-white font-black text-lg shadow-lg`}
          >
            {index + 1}
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
        </div>
      </div>

      {/* Center Dot with Step Number - Desktop Only */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 md:block z-10">
        <div
          className={`relative h-14 w-14 rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center text-white font-black text-xl shadow-xl border-4 border-slate-950 group-hover:scale-125 transition-transform duration-300`}
        >
          {index + 1}
        </div>
      </div>

      {/* Spacer for Alignment - Desktop Only */}
      <div className="hidden flex-1 md:block" />
    </div>
  );
};

export { ProcessTimeline };
