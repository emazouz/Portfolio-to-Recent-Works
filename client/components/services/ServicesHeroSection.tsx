import React from "react";
import {
  Award,
  Users,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  value: string;
  gradient: string;
}

const STATS: Stat[] = [
  {
    icon: Award,
    text: "Years Experience",
    value: "8+",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Users,
    text: "Projects Delivered",
    value: "100+",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Star,
    text: "Client Satisfaction",
    value: "98%",
    gradient: "from-yellow-500 to-amber-500",
  },
];

const KEY_FEATURES = [
  "Lightning-fast performance guaranteed",
  "Mobile-first responsive design",
  "SEO optimized from day one",
  "Enterprise-grade security",
];

export default function ServicesHeroSection() {
  return (
    <section
      className="relative overflow-hidden my-10 md:my-20"
      id="services"
    >
      <div className="relative max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl shadow-lg hover:shadow-indigo-500/20 transition-shadow duration-300">
            <Sparkles
              className="w-4 h-4 text-indigo-400 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 font-bold text-sm tracking-wide">
              PROFESSIONAL WEB DEVELOPMENT
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-300 inline-block animate-gradient">
              Services That Scale
            </span>
            <br />
            <span className="text-white">Your Business</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
            From concept to deployment - comprehensive solutions powered by{" "}
            <span className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors cursor-default">
              Next.js
            </span>
            ,{" "}
            <span className="text-purple-400 font-semibold hover:text-purple-300 transition-colors cursor-default">
              React
            </span>
            , and{" "}
            <span className="text-pink-400 font-semibold hover:text-pink-300 transition-colors cursor-default">
              TypeScript
            </span>
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {STATS.map((stat, idx) => (
              <StatCard key={idx} stat={stat} index={idx} />
            ))}
          </div>

          {/* Key Features List */}
          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl">
            {KEY_FEATURES.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-slate-300 group"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium group-hover:text-white transition-colors">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/40 flex items-center gap-2">
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-slate-800/80 border border-slate-700 text-white font-bold rounded-xl transition-all duration-300 hover:bg-slate-700/80 hover:border-slate-600 hover:scale-105">
              Free Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

interface StatCardProps {
  stat: Stat;
  index: number;
}

const StatCard = ({ stat, index }: StatCardProps) => {
  const Icon = stat.icon;

  return (
    <div
      className="group relative p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Gradient Overlay on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </div>

        {/* Content */}
        <div>
          <div
            className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1`}
          >
            {stat.value}
          </div>
          <div className="text-sm text-slate-400 font-semibold whitespace-nowrap">
            {stat.text}
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div
        className={`absolute inset-x-0 -bottom-px h-[2px] bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />
    </div>
  );
};

export { ServicesHeroSection };
