import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "Login - Developer Portfolio",
  description: "Sign in to your account to access premium templates and manage your purchases.",
}

export default function LoginPage() {
  return (
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <LoginForm />
        </main>
      </div>
  )
}
