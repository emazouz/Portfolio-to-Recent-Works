"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Github,
  Linkedin,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  HeadphonesIcon,
} from "lucide-react";

// --- Theme Mapping Helpers ---

// Map of original hardcoded gradient classes to theme chart keys
const GRADIENT_MAP_KEYS: Record<string, string> = {
  // Contact Info Gradients
  "from-indigo-500 to-purple-500": "chart-1", // Primary / Mail
  "from-pink-500 to-rose-500": "chart-2", // Phone
  "from-blue-500 to-cyan-500": "chart-3", // Location
  "from-green-500 to-emerald-500": "chart-5", // Response Time / Success/WhatsApp Button

  // Social Gradients
  "from-gray-600 to-gray-800": "chart-9", // Github
  "from-blue-500 to-blue-700": "chart-3", // Linkedin
  "from-green-500 to-green-700": "chart-5", // WhatsApp

  // Custom Accent Boxes
  "from-green-900/20 to-emerald-900/20": "chart-5/20", // Urgent Inquiries Box BG
  "from-indigo-500/10 via-purple-500/10 to-pink-500/10": "primary/10", // Header Badge BG
  "from-indigo-300 to-purple-300": "primary", // Header Badge Text (using primary color)
  "from-indigo-600 to-purple-600": "chart-1", // Form Submit Button
};

/**
 * Returns the CSS variable string for a given gradient key (or uses primary/secondary for simplification).
 */
const getThemeGradient = (gradientKey: string): string => {
  const chartKey = GRADIENT_MAP_KEYS[gradientKey] || "chart-1";
  // If it's a transparency key (like 'primary/10'), just return the class
  if (chartKey.includes("/")) return chartKey;

  return `var(--${chartKey})`;
};

// --- Interfaces and Data (UNCHANGED LOGIC) ---

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  href?: string;
  gradient: string; // Now holds original hardcoded string, used as key for mapping
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  href: string;
  gradient: string; // Now holds original hardcoded string, used as key for mapping
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
}

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@devportfolio.com",
    description: "Quick response, detailed answers",
    href: "mailto:hello@devportfolio.com",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am-6pm PST",
    href: "tel:+15551234567",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "San Francisco, CA",
    description: "Remote work worldwide",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Response Time",
    value: "< 24 hours",
    description: "Usually within 6 hours",
    gradient: "from-green-500 to-emerald-500",
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/yourusername",
    gradient: "from-gray-600 to-gray-800",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: MessageSquare,
    name: "WhatsApp",
    href: "https://wa.me/15551234567",
    gradient: "from-green-500 to-green-700",
  },
];

const WHAT_TO_EXPECT = [
  "Free 30-minute consultation call",
  "Detailed proposal within 48 hours",
  "Transparent pricing, no hidden fees",
  "Regular progress updates",
];

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    budget: "",
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setIsSuccess(false);

      // Simulate API call (UNCHANGED)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Contact form submitted:", formData);
      setIsLoading(false);
      setIsSuccess(true);

      // Reset form after success (UNCHANGED)
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          budget: "",
        });
        setIsSuccess(false);
      }, 3000);
    },
    [formData]
  );

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12" id="cta">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Badge Accent */}
          <div
            // Theme: Uses primary/10 background, primary/30 border
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-xl mb-6"
          >
            {/* Theme: Icon uses primary color */}
            <Sparkles
              className="w-4 h-4 text-primary animate-pulse"
              aria-hidden="true"
            />
            <span
              // Theme: Text uses primary color
              className="text-primary font-bold text-sm"
            >
              LET'S BUILD SOMETHING AMAZING
            </span>
          </div>
          <h2
            // Theme: Title uses foreground color
            className="text-4xl md:text-5xl font-black text-foreground mb-4"
          >
            Ready to Start Your Project?
          </h2>
          <p
            // Theme: Description uses muted-foreground
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Get in touch for projects, collaborations, or any questions. I
            typically respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            {/* Introduction Card */}
            <div
              // Theme: Uses card background and border
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-2xl font-black text-foreground mb-4">
                Get In Touch
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you need a custom web application, want to discuss a
                project, or have questions about my services, I'm here to help.
                I work with businesses of all sizes to create exceptional
                digital experiences that drive real results.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_INFO.map((info, index) => (
                <ContactInfoCard key={index} info={info} />
              ))}
            </div>

            {/* Social Links */}
            <div
              // Theme: Uses card background and border
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                {/* Theme: Icon uses primary color */}
                <HeadphonesIcon className="w-5 h-5 text-primary" />
                Connect With Me
              </h3>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    aria-label={`Connect on ${social.name}`}
                    // Theme: Uses muted/border/foreground colors
                    className={`group p-4 rounded-xl bg-muted/50 border border-border hover:border-primary transition-all duration-300 hover:scale-110`}
                  >
                    {/* Theme: Icon uses muted-foreground and primary hover */}
                    <social.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div
              // Theme: Uses card background and border
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-lg font-black text-foreground mb-4">
                What to Expect
              </h3>
              <ul className="space-y-3" role="list">
                {WHAT_TO_EXPECT.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {/* Theme: Check icon uses secondary color */}
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Urgent Inquiries */}
            <div
              // Theme: Uses primary/10 background, secondary/50 border for urgency highlight
              className="p-6 rounded-2xl bg-primary/10 backdrop-blur-xl border border-secondary/50"
            >
              <h3 className="text-lg font-black text-foreground mb-2 flex items-center gap-2">
                {/* Theme: Icon uses secondary color */}
                <MessageSquare className="h-5 w-5 text-secondary" />
                Need Urgent Help?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                For time-sensitive projects or urgent questions, reach me
                directly via WhatsApp for immediate response.
              </p>
              <Button
                // Theme: Button uses secondary color
                className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground font-bold"
                asChild
              >
                <a
                  href="https://wa.me/15551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp Me Now
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <Card
            // Theme: Uses card background and border
            className="shadow-2xl border-border bg-card"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Send a Message
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill out the form below and I'll get back to you within 24
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="py-12 text-center">
                  {/* Success Icon */}
                  <div
                    // Theme: Success background uses secondary color
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. I'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      // Theme: Input uses muted background, border, and foreground text
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      // Theme: Input uses muted background, border, and foreground text
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Project inquiry, collaboration, etc."
                      value={formData.subject}
                      onChange={handleInputChange}
                      // Theme: Input uses muted background, border, and foreground text
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-foreground">
                      Project Budget (Optional)
                    </Label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      // Theme: Select uses muted background, border, and primary ring
                      className="w-full px-3 py-2 bg-muted/50 border border-border text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-plus">$25,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      // Theme: Textarea uses muted background, border, and foreground text
                      className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    // Theme: Submit button uses primary gradient/color
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-primary/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

interface ContactInfoCardProps {
  info: ContactInfo;
}

const ContactInfoCard = ({ info }: ContactInfoCardProps) => {
  const Icon = info.icon;
  // Get the chart gradient variable string
  const gradientVar = getThemeGradient(info.gradient);

  return (
    <div
      // Theme: Uses muted background, border, and primary hover
      className="group p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-start gap-3">
        <div
          // Theme: Icon container uses gradient background
          className={`p-2.5 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
          style={{ backgroundImage: gradientVar }}
        >
          <Icon
            className="h-5 w-5 text-primary-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground mb-1">
            {info.title}
          </h3>
          {info.href ? (
            <a
              href={info.href}
              // Theme: Value text uses gradient clip
              className={`text-sm font-semibold text-transparent bg-clip-text hover:underline block mb-1 truncate`}
              style={{ backgroundImage: gradientVar }}
            >
              {info.value}
            </a>
          ) : (
            <p
              // Theme: Value text uses gradient clip
              className={`text-sm font-semibold text-transparent bg-clip-text mb-1`}
              style={{ backgroundImage: gradientVar }}
            >
              {info.value}
            </p>
          )}
          <p className="text-xs text-muted-foreground">{info.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
