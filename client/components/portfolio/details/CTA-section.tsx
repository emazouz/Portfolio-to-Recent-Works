import { Button } from "@/components/ui/button";
import Link from "next/link";

function CTASection() {
  return (
    <section className="container">
      <div className="wrapper">
        {/* FIX: Use theme-aware primary/border styles */}
        <div className="text-center p-12 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-xl">
          <h2 className="text-3xl font-black text-foreground mb-4">
            Interested in Similar Work?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            I'd love to discuss how I can help bring your project ideas to life
            with the same attention to detail and quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href="/contact">Start a Project</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted text-foreground"
              asChild
            >
              <Link href="/portfolio">View More Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
