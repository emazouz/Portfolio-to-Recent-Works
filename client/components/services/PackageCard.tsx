import { PACKAGES } from "@/constants/services";
import { Award, Check, X } from "lucide-react";
import { useMemo } from "react";

interface AddOn {
  service: string;
  price: string;
}

const ADD_ONS: AddOn[] = [
  { service: "Additional pages", price: "150 DH/page" },
  { service: "Custom plugin development", price: "From 500 DH" },
  { service: "Monthly maintenance", price: "500-1500 DH" },
  { service: "Content creation", price: "From 300 DH" },
  { service: "Logo design", price: "800 DH" },
  { service: "Social media integration", price: "400 DH" },
];

export const PackageCard = () => {
  return (
    <section className="wrapper space-y-12" id="package">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl mb-8">
          <Award className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-sm">
            FLEXIBLE PRICING
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Choose Your Package
        </h2>
        <p className="text-xl text-slate-400">
          Transparent pricing for every business size
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
        {PACKAGES.map((pkg, index) => (
          <PackageItem key={index} pkg={pkg} />
        ))}
      </div>

      {/* Add-ons Section */}
      <AddOnsSection addOns={ADD_ONS} />
    </section>
  );
};

// Separate component for each package item
interface PackageItemProps {
  pkg: {
    name: string;
    tagline: string;
    price: string;
    color: string;
    popular?: boolean;
    features: Array<{ text: string; included: boolean }>;
  };
}

const PackageItem = ({ pkg }: PackageItemProps) => {
  const cardClasses = useMemo(
    () =>
      `relative rounded-2xl backdrop-blur-xl border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        pkg.popular
          ? "border-red-500/50 shadow-2xl shadow-red-500/20 lg:scale-105"
          : "border-slate-700 hover:border-slate-600"
      }`,
    [pkg.popular]
  );

  const buttonClasses = useMemo(
    () =>
      `w-full py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
        pkg.popular
          ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
          : `bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white`
      }`,
    [pkg.popular, pkg.color]
  );

  return (
    <article className={cardClasses}>
      {/* Popular Badge Top Border */}
      {pkg.popular && (
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500"
          aria-hidden="true"
        />
      )}

      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-black rounded-full shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Package Name */}
        <h3
          className={`text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r ${pkg.color}`}
        >
          {pkg.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
          {pkg.tagline}
        </p>

        {/* Price */}
        <div className="mb-6" aria-label={`Price: ${pkg.price} DH`}>
          <span
            className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${pkg.color}`}
          >
            {pkg.price}
          </span>
          <span className="text-slate-400 text-lg ml-2">DH</span>
        </div>

        {/* Features List */}
        <ul className="space-y-3 mb-6" role="list">
          {pkg.features.map((feature, idx) => (
            <li
              key={`${pkg.name}-feature-${idx}`}
              className="flex items-start gap-2 text-sm"
            >
              {feature.included ? (
                <Check
                  className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                  aria-label="Included"
                />
              ) : (
                <X
                  className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0"
                  aria-label="Not included"
                />
              )}
              <span
                className={
                  feature.included ? "text-slate-300" : "text-slate-600"
                }
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className={buttonClasses}
          aria-label={`Get started with ${pkg.name} package`}
        >
          Get Started
        </button>
      </div>
    </article>
  );
};

// Separate component for add-ons section
interface AddOnsSectionProps {
  addOns: AddOn[];
}

const AddOnsSection = ({ addOns }: AddOnsSectionProps) => {
  return (
    <section className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700">
      <h3 className="text-2xl font-black text-white mb-6 text-center">
        Need Something Extra?
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addOns.map((addon, idx) => (
          <AddOnCard key={`addon-${idx}`} addon={addon} />
        ))}
      </div>
    </section>
  );
};

// Separate component for add-on cards
interface AddOnCardProps {
  addon: AddOn;
}

const AddOnCard = ({ addon }: AddOnCardProps) => {
  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105">
      <div className="font-semibold text-white mb-1">{addon.service}</div>
      <div className="text-indigo-400 text-sm font-bold">{addon.price}</div>
    </div>
  );
};

export default PackageCard;
