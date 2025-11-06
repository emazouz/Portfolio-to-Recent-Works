import Link from "next/link";
import { Mail, Award, Phone } from "lucide-react";
import { APP_NAME, ICON_SIZES } from "@/constants/index.constants";
import Logo from "./shared/logo";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants/contact.constants";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted border-t border-border">
      <div className="wrapper">
        <div className="container py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {/* Company Info */}
            <div className="space-y-4 text-center sm:text-left">
              <Logo />
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Professional web development services that transform your
                business vision into reality.
              </p>
              <div className="flex gap-3 justify-center sm:justify-start">
                {SOCIAL_LINKS.map((c, i) => (
                  <li
                    key={i}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/50 hover:bg-accent flex items-center justify-center text-accent-foreground/80 hover:text-accent-foreground transition-colors"
                  >
                    {/* If it has a link (Phone/Mail), use an <a> tag */}

                    <Link
                      href={c.href}
                      // Text hover color changes to Primary for high contrast/focus
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <c.icon />
                    </Link>
                  </li>
                ))}
              </div>
            </div>

            {/* Services Links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">
                Services
              </h4>
              <ul className="space-y-2 text-sm sm:text-base">
                {[
                  "Full-Stack Development",
                  "UI/UX Design",
                  "Cloud Solutions",
                  "E-Commerce",
                  "SEO Services",
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">
                Company
              </h4>
              <ul className="space-y-2 text-sm sm:text-base">
                {["About Us", "Portfolio", "Blog", "Contact", "FAQ"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors inline-block"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">
                Get in Touch
              </h4>
              <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
                {CONTACT_INFO.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 justify-center sm:justify-start"
                  >
                    {/* If it has a link (Phone/Mail), use an <a> tag */}

                    <c.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="break-all sm:break-normal">{c.value}</span>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="border-t border-border pt-6 sm:pt-8 pb-8 sm:pb-10 lg:pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              &copy; {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <Link
                href="#"
                className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link
                href="#"
                className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Link
                href="#"
                className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
