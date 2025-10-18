"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageCircle,
  HelpCircle,
  Sparkles,
  MessageCircleQuestion,
} from "lucide-react";
import HeaderSection from "./HeaderSection";

const faqs = [
  {
    question: "What's included with each template?",
    answer:
      "Each template includes the complete source code, documentation, design files (Figma), and lifetime updates. You also get email support for any questions.",
  },
  {
    question: "Can I customize the templates?",
    answer:
      "All templates are built with clean, well-documented code that's easy to customize. You can modify colors, layouts, components, and add your own features.",
  },
  {
    question: "Do you offer custom development services?",
    answer:
      "Yes, I offer custom web development services for clients who need something unique. This includes full-stack applications, API development, and UI/UX design.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "I primarily work with React, Next.js, TypeScript, Tailwind CSS, Node.js, and various databases. I stay up-to-date with the latest web technologies and best practices.",
  },
  {
    question: "How long does custom development take?",
    answer:
      "Project timelines vary based on complexity. Simple websites take 1-2 weeks, while complex applications can take 2-3 months. I provide detailed timelines during the consultation.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes, I offer maintenance packages for ongoing support, updates, and feature additions. Template purchases include 6 months of email support.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="wrapper">
        {/* Assuming HeaderSection correctly uses theme colors */}
        <HeaderSection
          icon={<MessageCircleQuestion className="animate-pulse" />}
          badgeTitle="FAQ"
          title="Frequently Asked Questions"
          description="Everything you need to know about templates and services"
          ctaText="View All FAQs"
          ctaHref="/faq"
        />
        <div className="flex  gap-8 lg:gap-12 flex-col lg:flex-row items-start">
          <div className="flex-1 space-y-6">
            {/* 1. Decorative Contact Card */}
            <div
              className="relative p-4 rounded-2xl text-primary-foreground overflow-hidden"
              // FIX: Use inline style with theme gradient (chart-1)
              style={{ backgroundImage: "var(--chart-1)" }}
            >
              {/* Decorative Blur Element */}
              <div
                // FIX: Use primary-foreground for the blur shape
                className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"
              />
              <div className="relative z-10">
                {/* Icon: FIX - Use secondary color for strong contrast over primary gradient */}
                <HelpCircle size={48} className="mb-4 text-secondary" />

                <h3 className="text-2xl font-bold mb-3">
                  Still Have Questions?
                </h3>
                {/* Description Text: Use primary-foreground/80 */}
                <p className="text-primary-foreground/80 mb-6">
                  Can't find the answer you're looking for? Feel free to reach
                  out to our support team.
                </p>
                <button
                  // FIX: Button styling uses primary-foreground and secondary for hover
                  className="px-6 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center gap-2"
                >
                  <MessageCircle size={20} />
                  Contact Support
                </button>
              </div>
            </div>

            {/* 2. Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quick Response Card */}
              <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div
                  // FIX: Use primary color for icon container background and icon color
                  className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                >
                  <Sparkles className="text-primary" size={24} />
                </div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Quick Response
                </h4>
                <p className="text-sm text-muted-foreground">
                  Get answers within 24 hours on business days
                </p>
              </div>

              {/* Friendly Support Card */}
              <div className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div
                  // FIX: Use secondary color for icon container background and icon color
                  className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4"
                >
                  <MessageCircle className="text-secondary" size={24} />
                </div>
                <h4 className="font-semibold mb-2 text-foreground">
                  Friendly Support
                </h4>
                <p className="text-sm text-muted-foreground">
                  Professional help from experienced developers
                </p>
              </div>
            </div>

            {/* Additional Help Text */}
            <div className="p-6 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">💡 Pro Tip:</strong> Check
                out our documentation and video tutorials for detailed guides on
                customizing your templates.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="flex-1 w-full">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-6 bg-card hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5 font-semibold text-foreground hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
