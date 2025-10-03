import { TemplateStore } from "@/components/template-store";

export const metadata = {
  title: "Premium Templates - Developer Portfolio",
  description:
    "Browse our collection of premium, production-ready templates for modern web applications.",
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <TemplateStore />
      </main>
    </div>
  );
}
