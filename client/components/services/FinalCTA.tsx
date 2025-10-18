import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      className="wrapper mt-16 text-center p-10 md:p-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 backdrop-blur-xl"
      id="cta"
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Ready to Start Your Project?
        </h2>
        <p className="mt-6 text-lg leading-8 text-blue-100">
          Let's discuss how I can help bring your vision to life. Schedule a
          free consultation to explore your requirements and get a customized
          solution proposal.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
          >
            <Link href="/contact">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white/10"
          >
            <Link href="mailto:your@email.com">
              <Mail className="mr-2 h-5 w-5" />
              Send Email
            </Link>
          </Button>
        </div>

        <p className="mt-8 text-sm text-blue-200">
          Typical response time: Within 24 hours
        </p>
      </div>
    </section>
  );
}
