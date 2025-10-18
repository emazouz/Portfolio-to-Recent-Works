import { Briefcase, Code, Home, Lightbulb, Mail, User } from "lucide-react";

export const  ABOUT_SECTIONS = [
  {
    id: "hero",
    label: "Home",
    icon: Home,
    gradient: "from-blue-500 to-cyan-500",
    subtitle: "text-cyan-400",
  },
  {
    id: "intro",
    label: "Introduction",
    icon: User,
    gradient: "from-indigo-500 to-purple-500",
    subtitle: "text-indigo-400",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Code,
    gradient: "from-green-500 to-emerald-500",
    subtitle: "text-green-400",
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    gradient: "from-yellow-500 to-amber-500",
    subtitle: "text-yellow-400",
  },
  {
    id: "fun-facts",
    label: "Fun Facts",
    icon: Lightbulb,
    gradient: "from-pink-500 to-rose-500",
    subtitle: "text-pink-400",
  },
  {
    id: "cta",
    label: "Contacts",
    icon: Mail, // Assuming you meant Mail or MessageCircle for 'ContactIcon'
    gradient: "from-red-500 to-orange-500",
    subtitle: "text-orange-400",
  },
];