import Link from "next/link";
import { Mail, Award, Phone, Code2 } from "lucide-react";
import { APP_NAME } from "@/constants/index.constants";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted border-t border-border">
      <div className="wrapper">
        <div className="container py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {/* Company Info */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-black text-foreground">
                  {APP_NAME}
                </span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Professional web development services that transform your
                business vision into reality.
              </p>
              <div className="flex gap-3 justify-center sm:justify-start">
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/50 hover:bg-accent flex items-center justify-center text-accent-foreground/80 hover:text-accent-foreground transition-colors"
                  aria-label="Email us"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/50 hover:bg-accent flex items-center justify-center text-accent-foreground/80 hover:text-accent-foreground transition-colors"
                  aria-label="Call us"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
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
                {["About Us", "Portfolio", "Blog", "Contact", "Careers"].map(
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
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all sm:break-normal">
                    +212-9214-43301
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all sm:break-normal">
                    contact@emazouz.com
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span>Rabat, Morocco</span>
                </div>
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
