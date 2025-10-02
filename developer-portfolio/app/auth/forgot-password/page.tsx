import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password - Developer Portfolio",
  description: "Reset your password to regain access to your account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-20">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
