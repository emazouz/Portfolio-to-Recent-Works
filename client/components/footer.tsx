import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Award,
  Phone,
  Code2,
} from "lucide-react";
import { APP_NAME } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    // FIX: Footer background uses muted/border colors
    <footer className="bg-muted border-t border-border" id="footer">
      <div className="max-w-7xl mx-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {/* FIX: Logo container uses primary theme background */}
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  {/* FIX: Icon text uses primary-foreground */}
                  <Code2 className="w-6 h-6 text-primary-foreground" />
                </div>
                {/* FIX: App Name uses foreground color */}
                <span className="text-xl font-black text-foreground">
                  {APP_NAME}
                </span>
              </div>
              {/* FIX: Description uses muted-foreground */}
              <p className="text-muted-foreground text-sm">
                Professional web development services that transform your
                business vision into reality.
              </p>
              <div className="flex gap-3">
                {/* FIX: Social/Contact buttons use accent/muted/foreground colors */}
                <button className="w-10 h-10 rounded-lg bg-accent/50 hover:bg-accent flex items-center justify-center text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-accent/50 hover:bg-accent flex items-center justify-center text-accent-foreground/80 hover:text-accent-foreground transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Services Links */}
            <div>
              {/* FIX: Heading uses foreground color */}
              <h4 className="font-bold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                {[
                  "Full-Stack Development",
                  "UI/UX Design",
                  "Cloud Solutions",
                  "E-Commerce",
                  "SEO Services",
                ].map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      // FIX: Links use muted-foreground and foreground hover
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              {/* FIX: Heading uses foreground color */}
              <h4 className="font-bold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {["About Us", "Portfolio", "Blog", "Contact", "Careers"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        // FIX: Links use muted-foreground and foreground hover
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              {/* FIX: Heading uses foreground color */}
              <h4 className="font-bold text-foreground mb-4">Get in Touch</h4>
              {/* FIX: Contact text uses muted-foreground */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+212-9214-43301</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@emazouz.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Rabat, Morocco</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="border-t border-border pt-8 pb-12 text-center">
          <p className="text-muted-foreground">
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            {/* FIX: Policy links use muted-foreground and primary hover */}
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
