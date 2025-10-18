"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  description: string;
  href?: string;
  gradient: string;
}

interface SocialLink {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  href: string;
  gradient: string;
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Contact form submitted:", formData);
    setIsLoading(false);
    setIsSuccess(true);

    // Reset form after success
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
  }, [formData]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12" id="cta">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" aria-hidden="true" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 font-bold text-sm">
              LET'S BUILD SOMETHING AMAZING
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Get in touch for projects, collaborations, or any questions. I typically respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700">
              <h3 className="text-2xl font-black text-white mb-4">Get In Touch</h3>
              <p className="text-slate-300 leading-relaxed">
                Whether you need a custom web application, want to discuss a project, or have questions about my services, I'm here to help. I work with businesses of all sizes to create exceptional digital experiences that drive real results.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_INFO.map((info, index) => (
                <ContactInfoCard key={index} info={info} />
              ))}
            </div>

            {/* Social Links */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5 text-indigo-400" />
                Connect With Me
              </h3>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-110`}
                    title={social.name}
                    aria-label={`Connect on ${social.name}`}
                  >
                    <social.icon className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* What to Expect */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700">
              <h3 className="text-lg font-black text-white mb-4">What to Expect</h3>
              <ul className="space-y-3" role="list">
                {WHAT_TO_EXPECT.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Urgent Inquiries */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl border border-green-700/50">
              <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                Need Urgent Help?
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                For time-sensitive projects or urgent questions, reach me directly via WhatsApp for immediate response.
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold"
                asChild
              >
                <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp Me Now
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="shadow-2xl border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Send a Message</CardTitle>
              <CardDescription className="text-slate-400">
                Fill out the form below and I'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">
                    Thank you for reaching out. I'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-300">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Project inquiry, collaboration, etc."
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-slate-300">Project Budget (Optional)</Label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select a range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-plus">$25,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30"
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

  return (
    <div className="group p-4 rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${info.gradient} flex-shrink-0 group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white mb-1">{info.title}</h3>
          {info.href ? (
            <a
              href={info.href}
              className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${info.gradient} hover:underline block mb-1 truncate`}
            >
              {info.value}
            </a>
          ) : (
            <p className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${info.gradient} mb-1`}>
              {info.value}
            </p>
          )}
          <p className="text-xs text-slate-400">{info.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;