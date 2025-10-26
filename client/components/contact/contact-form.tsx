"use client";

import { useState, useCallback } from "react";
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
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Headphones,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateContactInput, MessageType } from "@/validators/contact.validate";
import { contactStore } from "@/store/contactStore";
import { toast } from "@/hooks/use-toast";
import { ContactInfoCardProps } from "@/types/contact.types";
import {
  CONTACT_INFO,
  MESSAGE_TYPES,
  SOCIAL_LINKS,
  WHAT_TO_EXPECT,
} from "@/constants/contact.constants";
import Link from "next/link";

export function ContactForm() {
  const { createContact, isLoading, error } = contactStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateContactInput>({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: MessageType.GENERAL,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSuccess(false);
      try {
        const result = await createContact(formData);

        if (!result.success) {
          setIsSuccess(false);
          return toast({
            title: "Sending Failed!",
            description: result.message,
            variant: "error",
          });
        }

        toast({
          title: "Sending Successfully!",
          description: result.message,
        });
        setIsSuccess(true);

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          type: MessageType.GENERAL,
        });
      } catch (err) {
        console.error(
          err instanceof Error
            ? err.message
            : "Failed to send message. Please try again."
        );
      }
    },
    [formData]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleTypeChange = useCallback((value: MessageType) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  }, []);

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-background via-primary/5 to-accent/5"
      id="contact"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20 backdrop-blur-xl mb-6 glow-sky">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent font-bold text-sm">
              LET'S BUILD SOMETHING AMAZING
            </span>
          </div>
          <h2 className="h1-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch for projects, collaborations, or any questions. I
            typically respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            {/* Introduction Card */}
            <Card className="border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 glow-sky">
              <CardContent className="p-8">
                <h3 className="text-2xl font-black text-foreground mb-4">
                  Get In Touch
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you need a custom web application, want to discuss a
                  project, or have questions about my services, I'm here to
                  help. I work with businesses of all sizes to create
                  exceptional digital experiences that drive real results.
                </p>
              </CardContent>
            </Card>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_INFO.map((info, index) => (
                <ContactInfoCard key={index} info={info} />
              ))}
            </div>

            {/* Social Links */}
            <Card className="border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  Connect With Me
                </h3>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.name}
                      className={`group p-4 rounded-xl bg-muted/50 border-2 border-border ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    >
                      <social.icon className="h-6 w-6 text-muted-foreground group-hover:scale-110 transition-transform" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="border-2 border-secondary/30 shadow-xl bg-card/80 backdrop-blur-sm hover:border-secondary/50 transition-all duration-300 glow-gold">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-foreground mb-4">
                  What to Expect
                </h3>
                <ul className="space-y-3">
                  {WHAT_TO_EXPECT.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Urgent Inquiries */}
            <Card className="border-2 border-emerald-500/30 shadow-xl bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:border-emerald-500/50 transition-all duration-300">
              <CardContent className="p-6">
                <h3 className="text-lg font-black text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-500" />
                  Need Urgent Help?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  For time-sensitive projects or urgent questions, reach me
                  directly via WhatsApp for immediate response.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:scale-105 transition-all"
                  asChild
                >
                  <Link
                    href="https://wa.me/15551234567"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp Me Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="border-2 border-accent/30 shadow-2xl bg-card/80 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 glow-purple">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl text-foreground">
                Send a Message
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill out the form below and I'll get back to you within 24
                hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6 border-2 border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {isSuccess ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-xl animate-pulse">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Thank you for reaching out. I'll respond within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 border-primary/50 hover:bg-primary/10 hover:border-primary"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Message Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold">
                      Message Type *
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {MESSAGE_TYPES.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleTypeChange(type.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                            formData.type === type.value
                              ? "border-primary bg-primary/10 shadow-lg glow-sky"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg transition-colors ${
                                formData.type === type.value
                                  ? "bg-primary"
                                  : "bg-muted"
                              }`}
                            >
                              <type.icon
                                className={`h-4 w-4 ${
                                  formData.type === type.value
                                    ? "text-primary-foreground"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`font-bold text-sm mb-1 ${
                                  formData.type === type.value
                                    ? "text-foreground"
                                    : "text-foreground"
                                }`}
                              >
                                {type.label}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-foreground font-semibold"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="h-12 border-2 border-border focus:border-primary bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-foreground font-semibold"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 border-2 border-border focus:border-primary bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-foreground font-semibold"
                    >
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="h-12 border-2 border-border focus:border-primary bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-foreground font-semibold"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="border-2 border-border focus:border-primary resize-none bg-background"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.message.length} / 2000 characters
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="btn-gradient w-full h-14 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Sending...
                      </>
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

const ContactInfoCard = ({ info }: ContactInfoCardProps) => {
  const Icon = info.icon;

  return (
    <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-lg bg-gradient-to-br ${info.color} flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground mb-1">
              {info.title}
            </h3>
            {info.href ? (
              <Link
                href={info.href}
                className={`text-sm font-semibold bg-gradient-to-r ${info.color} bg-clip-text text-transparent hover:underline block mb-1 truncate`}
              >
                {info.value}
              </Link>
            ) : (
              <p
                className={`text-sm font-semibold bg-gradient-to-r ${info.color} bg-clip-text text-transparent mb-1`}
              >
                {info.value}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{info.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
