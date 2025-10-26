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
import { Eye, EyeOff, Github, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LoginInput, loginSchema } from "@/validators/auth.validate";
import z from "zod";
import { authStore } from "@/store/authStore";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { login } = authStore();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const isValid = validateForm();

      if (!isValid) {
        const firstError = Object.values(errors).find((error) => error !== "");
        return toast({
          title: "Validation failed",
          description: firstError || "Please check your input fields",
          variant: "error",
        });
      }
      // Attempt login
      const result = await login(formData);

      if (!result.success) {
        return toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
      }

      // Login successful
      toast({
        title: "Welcome back!",
        description: result.message,
        variant: "success",
      });
      // Clear form data after successful login

      router.push("/");
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });

      // Router will handle redirect based on user role in useEffect
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="container mx-auto px-4 max-w-md">
      {/* Card: Uses theme colors (Deep Black/Navy in dark mode) */}
      <Card className="shadow-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            {/* Themed Outline Buttons */}
            <Button
              variant="outline"
              // Social login button styles adjusted for the dark/gold/blue theme
              className="w-full bg-transparent hover:bg-muted/30 border-border text-foreground hover:border-primary transition-all duration-300"
              type="button"
            >
              <Github className="mr-2 h-4 w-4 text-primary" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent hover:bg-muted/30 border-border text-foreground hover:border-primary transition-all duration-300"
              type="button"
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
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {/* Visibility Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  // Icon color is muted, but hovers to primary (Blue)
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-primary hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {/* Custom Checkbox Styling using Theme Colors */}
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rememberMe: e.target.checked,
                    })
                  }
                  value={formData.rememberMe.toString()}
                  // Styling the checkbox: border-border, text-primary, focus:ring-primary
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                // Link color is primary (Blue)
                className="text-sm text-primary hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button: Primary Color */}
            <Button
              type="submit"
              // Uses primary theme color (Blue)
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              // Link color is primary (Blue)
              className="text-primary hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
