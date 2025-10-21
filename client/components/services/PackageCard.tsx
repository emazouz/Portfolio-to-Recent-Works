"use client";

import { Award, Check, X } from "lucide-react";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PACKAGES } from "@/constants/services";
import HeaderSection from "../HeaderSection";

interface Package {
  name: string;
  tagline: string;
  price: string;
  color: string;
  popular?: boolean;
  features: Array<{ text: string; included: boolean }>;
}

interface AddOn {
  service: string;
  price: string;
}

const ADD_ONS: AddOn[] = [
  { service: "Additional pages", price: "$15/page" },
  { service: "Custom plugin development", price: "From $50" },
  { service: "Monthly maintenance", price: "$50-$150" },
  { service: "Content creation", price: "From $30" },
  { service: "Logo design", price: "$80" },
  { service: "Social media integration", price: "$40" },
];

interface PackageItemProps {
  pkg: Package;
}

function PackageItem({ pkg }: PackageItemProps) {
  const cardClasses = useMemo(
    () =>
      `relative transition-all duration-300 hover:scale-105 overflow-hidden ${
        pkg.popular
          ? "border-destructive/50 shadow-2xl shadow-destructive/20 lg:scale-105"
          : "hover:border-primary/50"
      }`,
    [pkg.popular]
  );

  return (
    <Card className={cardClasses}>
      {/* Popular Badge Top Border */}
      {pkg.popular && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `var(--${pkg.color})` }}
          aria-hidden="true"
        />
      )}

      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge
            className="text-white font-black shadow-lg"
            style={{ background: `var(--${pkg.color})` }}
          >
            MOST POPULAR
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle
          className="text-2xl font-black text-transparent bg-clip-text"
          style={{ backgroundImage: `var(--${pkg.color})` }}
        >
          {pkg.name}
        </CardTitle>
        <CardDescription className="min-h-[40px]">
          {pkg.tagline}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div aria-label={`Price: $${pkg.price}`}>
          <span
            className="text-5xl font-black text-transparent bg-clip-text"
            style={{ backgroundImage: `var(--${pkg.color})` }}
          >
            ${pkg.price}
          </span>
          <span className="text-muted-foreground text-lg ml-2">/month</span>
        </div>

        {/* Features List */}
        <ul className="space-y-3" role="list">
          {pkg.features.map((feature, idx) => (
            <li
              key={`${pkg.name}-feature-${idx}`}
              className="flex items-start gap-2 text-sm"
            >
              {feature.included ? (
                <Check
                  className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0"
                  aria-label="Included"
                />
              ) : (
                <X
                  className="w-4 h-4 text-muted-foreground/50 mt-0.5 flex-shrink-0"
                  aria-label="Not included"
                />
              )}
              <span
                className={
                  feature.included ? "text-foreground" : "text-muted-foreground"
                }
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          size="lg"
          className={`w-full font-bold transition-all duration-300 hover:scale-105 shadow-lg ${
            pkg.popular
              ? "bg-destructive hover:bg-destructive/90 text-white"
              : "text-white"
          }`}
          style={!pkg.popular ? { background: `var(--${pkg.color})` } : {}}
          aria-label={`Get started with ${pkg.name} package`}
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  );
}

interface AddOnCardProps {
  addon: AddOn;
}

function AddOnCard({ addon }: AddOnCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-all duration-300 hover:scale-105">
      <CardContent className="p-4">
        <div className="font-semibold text-foreground mb-1">
          {addon.service}
        </div>
        <div className="text-primary text-sm font-bold">{addon.price}</div>
      </CardContent>
    </Card>
  );
}

function AddOnsSection({ addOns }: { addOns: AddOn[] }) {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Need Something Extra?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addOns.map((addon, idx) => (
            <AddOnCard key={`addon-${idx}`} addon={addon} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PackageCard() {
  return (
    <section id="package">
      <div className="wrapper space-y-12">
        <HeaderSection
          icon={<Award className="animate-pulse" />}
          badgeTitle="FLEXIBLE PRICING"
          title="Choose Your Package"
          description=" Transparent pricing for every business size"
          hideCta={true}
        />

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          {PACKAGES.map((pkg, index) => (
            <PackageItem key={index} pkg={pkg} />
          ))}
        </div>

        {/* Add-ons Section */}
        <AddOnsSection addOns={ADD_ONS} />
      </div>
    </section>
  );
}
