import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "Sign Up - Developer Portfolio",
  description: "Create an account to purchase premium templates and access exclusive content.",
}

export default function SignupPage() {
  return (
      <div className="min-h-screen bg-background">
        <main className="py-20">
          <SignupForm />
        </main>
      </div>
  )
}
