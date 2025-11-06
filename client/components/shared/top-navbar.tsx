import { ICON_SIZES } from "@/constants/index.constants";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants/contact.constants";
import Link from "next/link";

function TopNavBar() {
  return (
    <div className="relative h-10 w-full overflow-hidden lg:px-4">
      {/* The background is created using two absolute elements.
        1. Yellow/Secondary Background: Uses the 'bg-secondary' variable.
      */}
      <div className="absolute inset-0 bg-secondary shadow-2xl" />

      {/* 2. Purple/Primary Diagonal Shape: Uses the 'bg-primary' variable.
        This creates the striking diagonal effect and ensures the shape 
        changes color in dark mode.
      */}
      <div className="absolute top-0 right-0 h-full w-2/3 md:w-2/5 bg-primary origin-top-right -skew-x-12 transform translate-x-20" />

      {/* Content Container: Relative to place content above the shapes */}
      <div className="h-full relative wrapper flex items-center justify-between text-sm">
        {/* Contact Information */}
        {/* Text color is set to the background's foreground color (text-secondary-foreground) */}
        <ul className="flex items-center gap-6 text-secondary-foreground">
          {CONTACT_INFO.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              {/* If it has a link (Phone/Mail), use an <a> tag */}
              <Link
                href={c.href}
                // Text hover color changes to Primary for high contrast/focus
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <c.icon className={ICON_SIZES[c.iconSize]} />
                <span className="hidden md:inline font-medium">{c.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Social Media Links */}
        {/* Text color is set to Primary Foreground (usually white/dark text) 
            to contrast with the Primary (Purple) background shape. */}
        <div className="flex items-center gap-4 text-primary-foreground">
          {SOCIAL_LINKS.map((social, i) => (
            <Link
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              // Hover color changes to Secondary (Yellow) for effect
              className="hover:text-secondary transition-colors"
            >
              <social.icon className={ICON_SIZES[social.iconSize]} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopNavBar;
