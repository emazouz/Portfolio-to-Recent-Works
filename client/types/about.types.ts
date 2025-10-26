import { LucideIcon } from "lucide-react";

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  status: string;
  description: string;
  color: string;
}

export interface Achievement {
  title: string;
  platform: string;
  description: string;
  icon: string;
}


export interface TimelineItem {
  icon: LucideIcon;
  title: string;
  year: string;
  description: string;
}

export interface ProjectFeature {
  label: string;
  value: string;
}

export interface SkillsCategory {
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
}
