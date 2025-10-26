interface MetricsType {
  label: string;
  value: string;
}

export interface Service {
  id: string;
  icon: any;
  label: string;
  // CHANGED: This now holds a 'chart-n' key, not a Tailwind class string.
  gradient: string;
  // CHANGED: This is now a generic theme class, not a hardcoded color.
  subtitle: string;
  description: string;
  technologies: string[];
  benefits: string[];
  metrics: MetricsType[];
}

export interface PackageType {
  name: string;
  tagline: string;
  price: string;
  color: string;
  popular?: boolean;
  features: Array<{ text: string; included: boolean }>;
}

export interface AddOn {
  service: string;
  price: string;
}

export interface PackageItemProps {
  pkg: PackageType;
}

export interface AddOnCardProps {
  addon: AddOn;
}

export interface TimelineStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  duration?: string;
  deliverables?: string[];
}

export interface TimelineItemProps {
  step: TimelineStep;
  index: number;
  isLast: boolean;
}

export interface ServiceItemProps {
  service: Service;
  index: number;
}

export interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  value: string;
  gradient: string; // Now holds a chart key like 'chart-1'
}

export interface StatCardProps {
  stat: Stat;
  index: number;
}
