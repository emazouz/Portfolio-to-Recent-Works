import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-4xl font-semibold text-destructive mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline">
            <Link href="/">Go home</Link>
          </Button>
          <Button>
            <Link href="/contact">Contact support</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
