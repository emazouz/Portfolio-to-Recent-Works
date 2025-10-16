import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata = {
  title: "Reset Password - Developer Portfolio",
  description: "Create a new password for your account.",
}

export default function ResetPasswordPage() {
  return (
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <ResetPasswordForm />
        </main>
      </div>
  )
}
