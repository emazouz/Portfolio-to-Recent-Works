import { SERVICES, Service } from "@/constants/services";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

export const ServiceCard = () => {
  return (
    <div className="space-y-16">
      {SERVICES.map((service) => (
        <ServiceItem key={service.id} service={service} />
      ))}
    </div>
  );
};

interface ServiceItemProps {
  service: Service;
}

const ServiceItem = ({ service }: ServiceItemProps) => {
  const Icon = service.icon;

  return (
    <section id={service.id}>
      {/* Header */}
      <div className="inline-flex items-center gap-3 mb-6">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            {service.label}
          </h2>
          <p className={`font-semibold ${service.subtitle}`}>
            Professional Solutions
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-xl hover:shadow-2xl">
        {/* Description */}
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
          {service.description}
        </p>

        {/* Metrics Section (if available) */}
        {service.metrics && service.metrics.length > 0 && (
          <div className="mb-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white">
                Key Performance Metrics
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {service.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="text-center p-4 rounded-lg bg-slate-900/50 border border-slate-700/30 hover:border-indigo-500/30 transition-all"
                >
                  <div
                    className={`text-2xl md:text-3xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r ${service.gradient}`}
                  >
                    {metric.value}
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-medium">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section (if available) */}
        {service.benefits && service.benefits.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
              Key Benefits
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {service.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-green-500/30 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies Section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
            Technologies & Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {service.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-slate-800/80 border border-slate-700 text-slate-300 text-sm font-semibold rounded-lg hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 hover:scale-105"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          className={`mt-4 px-6 py-3 bg-gradient-to-r ${service.gradient} text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 group`}
          aria-label={`Learn more about ${service.label}`}
        >
          Learn More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </section>
  );
};

export default ServiceCard;
