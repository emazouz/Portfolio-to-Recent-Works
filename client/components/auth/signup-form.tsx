"use client";

import type React from "react";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Github, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { RegisterInput, validateForm } from "@/validators/auth.validate";
import { authStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import PasswordRequirements from "./password-requirements";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAgreed: false,
    subscribeNewsletter: false,
  });

  const router = useRouter();
  const { register } = authStore();
  /**
   * Check if field has error
   */
  const hasError = (field: string) => !!errors[field];

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const isValid = validateForm(formData);
      if (!isValid.success) {
        setErrors(isValid.errors);

        const firstError = Object.values(isValid.errors).find(
          (error) => error !== ""
        );
        toast({
          title: "Validation failed",
          description: firstError || "Please check your input fields",
          variant: "error",
        });
        return;
      }

      const result = await register(formData);

      if (!result.success) {
        return toast({
          title: "Registration failed",
          description: result.message || "Something went wrong",
          variant: "error",
        });
      }

      toast({
        title: "Success!",
        description: result.message || "Registration completed successfully",
        variant: "success",
      });

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || "An unexpected error occurred",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Handle checkbox change
   */
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword((prev) => !prev);
    } else {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-md md:max-w-2xl">
      {/* Card: Uses theme colors (Deep Black/Navy in dark mode) */}
      <Card className="shadow-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join thousands of developers using our premium templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Social Signup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Themed Outline Buttons */}
            <Button
              variant="outline"
              // Styles adjusted for the dark/gold/blue theme
              className="w-full bg-transparent hover:bg-muted/30 border-border text-foreground hover:border-primary transition-all duration-300"
              type="button"
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4 text-primary" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent hover:bg-muted/30 border-border text-foreground hover:border-primary transition-all duration-300"
              type="button"
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4 text-primary" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or create account with email
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                aria-invalid={hasError("name")}
                // Uses destructive color
                className={hasError("name") ? "border-destructive" : ""}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                aria-invalid={hasError("email")}
                // Uses destructive color
                className={hasError("email") ? "border-destructive" : ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    aria-describedby="password-requirements"
                    aria-invalid={hasError("password")}
                    // Uses destructive color
                    className={hasError("password") ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    // Icon color is muted, but hovers to primary (Blue)
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("password")}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    aria-invalid={hasError("confirmPassword")}
                    // Uses destructive color
                    className={
                      hasError("confirmPassword") ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    // Icon color is muted, but hovers to primary (Blue)
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary hover:bg-transparent"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    tabIndex={-1}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {/* Password Requirements - Only show when password field has focus or content */}
            {formData.password &&
              PasswordRequirements(String(formData.password))}
            {/* Terms and Newsletter */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="termsAgreed"
                  checked={formData.termsAgreed}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("termsAgreed", checked as boolean)
                  }
                  disabled={isLoading}
                  // Uses destructive color
                  className={
                    hasError("termsAgreed")
                      ? "border-destructive text-destructive-foreground"
                      : "text-primary focus:ring-primary" // Default primary color
                  }
                />
                <Label
                  htmlFor="termsAgreed"
                  className={
                    hasError("termsAgreed")
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    // Link color is primary (Blue)
                    className="text-primary hover:underline transition-colors"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    // Link color is primary (Blue)
                    className="text-primary hover:underline transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "subscribeNewsletter",
                      checked as boolean
                    )
                  }
                  disabled={isLoading}
                  className="text-primary focus:ring-primary" // Default primary color
                />
                <Label
                  htmlFor="subscribeNewsletter"
                  className="text-sm leading-none text-muted-foreground"
                >
                  Subscribe to newsletter for updates and exclusive offers
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              // Uses primary theme color (Blue)
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={isLoading || !formData.termsAgreed}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              // Link color is primary (Blue)
              className="text-primary hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
