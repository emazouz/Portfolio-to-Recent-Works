import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

/**
 * TopNavBar Component
 * A slim navigation bar for displaying contact and social media links.
 * It uses custom theme variables (primary, secondary, foreground, etc.)
 * for a consistent look that supports light/dark mode.
 */
function TopNavBar() {
  // Define contact information data
  const contact = [
    // Uses the primary color for interactive elements (tel)
    { icon: Phone, text: "+212-9214-43301", href: "tel:+212621443301" },
    {
      icon: Mail,
      text: "contact@emazouz.com",
      href: "mailto:emazouz.dev@gmail.com",
    },
    // MapPin uses the default text style as it is not a clickable link
    { icon: MapPin, text: "Rabat-Morocco", href: null },
  ];

  // Define social media links data
  const socialMedia = [
    {
      icon: Facebook,
      href: "https://facebook.com/yourpage",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/emazouz.dev",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/en/emazouz",
      label: "LinkedIn",
    },
    { icon: Youtube, href: "https://youtub.com/emazouz", label: "Youtube" },
  ];

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
      <div className="relative container mx-auto h-full flex items-center justify-between px-4 text-sm">
        {/* Contact Information */}
        {/* Text color is set to the background's foreground color (text-secondary-foreground) */}
        <ul className="flex items-center gap-6 text-secondary-foreground">
          {contact.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              {/* If it has a link (Phone/Mail), use an <a> tag */}
              {c.href ? (
                <a
                  href={c.href}
                  // Text hover color changes to Primary for high contrast/focus
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <c.icon size={16} />
                  <span className="hidden md:inline font-medium">{c.text}</span>
                </a>
              ) : (
                // If no link (MapPin), render as plain text/icon
                <>
                  <c.icon size={16} />
                  <span className="hidden md:inline font-medium">{c.text}</span>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Social Media Links */}
        {/* Text color is set to Primary Foreground (usually white/dark text) 
            to contrast with the Primary (Purple) background shape. */}
        <div className="flex items-center gap-4 text-primary-foreground">
          {socialMedia.map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              // Hover color changes to Secondary (Yellow) for effect
              className="hover:text-secondary transition-colors"
            >
              <social.icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopNavBar;
