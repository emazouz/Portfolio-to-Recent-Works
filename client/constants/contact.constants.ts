import { ContactInfo, SocialLink } from "@/types/contact.types";
import { MessageType } from "@/validators/contact.validate";
import {
  Briefcase,
  Calendar,
  Code,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Users,
  Youtube,
  MessageCircleHeart,
  MapIcon,
  Clock,
  MapPin,
} from "lucide-react";

const size = "sm";
export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    iconSize: size,
    title: "Email",
    value: "emazouz.dev@gmail.com",
    description: "Quick response, detailed answers",
    href: "mailto:hello@devportfolio.com",
    color: "from-primary to-accent",
  },
  {
    icon: Phone,
    iconSize: size,
    title: "Phone",
    value: "+212 621-334-401",
    description: "Mon-Fri, 9am-6pm PST",
    href: "tel:+212621334401",
    color: "from-accent to-secondary",
  },
  {
    icon: MapPin,
    iconSize: size,
    title: "Location",
    value: "Rabat, Morocco",
    description: "Remote work worldwide",
    href: "tel:+15551234567",
    color: "from-primary to-sky-400",
  },
  {
    icon: Clock,
    iconSize: size,
    title: "Response Time",
    value: "< 24 hours",
    description: "Usually within 6 hours",
    href: "/contacts",
    color: "from-secondary to-amber-400",
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Github,
    iconSize: size,
    name: "GitHub",
    href: "https://github.com/yourusername",
    color: "hover:text-foreground hover:bg-accent/20",
  },
  {
    icon: Linkedin,
    iconSize: size,
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    color: "hover:text-primary hover:bg-primary/10",
  },
  {
    icon: MessageCircleHeart,
    iconSize: size,
    name: "WhatsApp",
    href: "https://wa.me/15551234567",
    color: "hover:text-emerald-500 hover:bg-emerald-500/10",
  },
  {
    icon: Facebook,
    iconSize: size,
    name: "Facebook",
    href: "https://wa.me/15551234567",
    color: "hover:text-emerald-500 hover:bg-emerald-500/10",
  },
  {
    icon: Instagram,
    iconSize: size,
    name: "Instagram",
    href: "https://wa.me/15551234567",
    color: "hover:text-emerald-500 hover:bg-emerald-500/10",
  },
  {
    icon: Youtube,
    iconSize: size,
    name: "Youtube",
    href: "https://wa.me/15551234567",
    color: "hover:text-emerald-500 hover:bg-emerald-500/10",
  },
];

// contact form /start

export const MESSAGE_TYPES = [
  {
    value: MessageType.GENERAL,
    label: "General Inquiry",
    icon: MessageCircleHeart,
    description: "General questions or information",
  },
  {
    value: MessageType.PROJECT,
    label: "Project Request",
    icon: Code,
    description: "Need help with a project",
  },
  {
    value: MessageType.JOB_OFFER,
    label: "Job Offer",
    icon: Briefcase,
    description: "Employment opportunities",
  },
  {
    value: MessageType.COLLABORATION,
    label: "Collaboration",
    icon: Users,
    description: "Partnership or collaboration",
  },
  {
    value: MessageType.CONSULTATION,
    label: "Consultation",
    icon: Calendar,
    description: "Book a consultation call",
  },
];

export const WHAT_TO_EXPECT = [
  "Free 30-minute consultation call",
  "Detailed proposal within 48 hours",
  "Transparent pricing, no hidden fees",
  "Regular progress updates",
];

// contact form /end
