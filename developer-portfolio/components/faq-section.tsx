"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
]

export function FAQSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about templates and services</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
