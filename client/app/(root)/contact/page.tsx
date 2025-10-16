import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact - Developer Portfolio",
  description:
    "Get in touch for custom development projects, template customization, or general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <ContactForm />
      </main>
    </div>
  );
}
