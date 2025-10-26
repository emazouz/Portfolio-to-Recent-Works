export interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  iconSize: "xs" | "sm" | "md" | "lg";
  title: string;
  value: string;
  description: string;
  href?: string;
  color: string;
}

export interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  iconSize: "xs" | "sm" | "md" | "lg";
  name: string;
  href: string;
  color: string;
}

export interface ContactInfoCardProps {
  info: ContactInfo;
}

export interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  href?: string;
  color: string;
}
