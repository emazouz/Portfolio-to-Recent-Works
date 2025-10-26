"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { authStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";
import {
  FormData,
  TokenValidationState,
  ValidationError,
} from "@/types/auth.types";
import {} from "@/constants/auth.constants";
import { validatePasswordForm } from "@/validators/auth.validate";
import PasswordRequirements from "./password-requirements";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // State
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [tokenState, setTokenState] = useState<TokenValidationState>(
    TokenValidationState.LOADING
  );

  // Store
  const {
    resetPassword,
    validatedToken: validateTokenAPI,
    error: authError,
  } = authStore();

  /**
   * Validate token with backend
   */
  const validateResetToken = useCallback(async () => {
    if (!token || !email) {
      setTokenState(TokenValidationState.INVALID);
      return;
    }

    try {
      const result = await validateTokenAPI(token, email);
      setTokenState(
        result.success
          ? TokenValidationState.VALID
          : TokenValidationState.INVALID
      );
    } catch (error) {
      console.error("Token validation failed:", error);
      setTokenState(TokenValidationState.INVALID);
    }
  }, [token, email, validateTokenAPI]);

  /**
   * Validate token on mount
   */
  useEffect(() => {
    validateResetToken();
  }, [validateResetToken]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    // Validate password and confirmation
    const validationErrors = validatePasswordForm(
      formData.password,
      formData.confirmPassword
    );

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    if (!token || !email) {
      setErrors([{ message: "Missing required token or email" }]);
      setIsLoading(false);
      return;
    }

    try {
      const success = await resetPassword(token, email, formData.password);

      if (success) {
        toast({
          title: "Password Reset Successfully",
          description: `Your password has been reset successfully.`,
          variant: "success",
        });
        setIsSuccess(true);
      } else {
        toast({
          title: "Reset Failed",
          description:
            authError || "Failed to reset password. Please try again.",
          variant: "error",
        });
        setErrors([
          {
            message: authError || "Failed to reset password. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Password reset error:", error);

      const errorMessage =
        authError ||
        "Failed to reset password. Please try again or request a new reset link.";

      setErrors([{ message: errorMessage }]);

      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input change with validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors for the field being edited
    setErrors((prev) => prev.filter((error) => error.field !== name));
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

  /**
   * Check if password has errors
   */
  const hasPasswordError = errors.some((error) => error.field === "password");
  const hasConfirmPasswordError = errors.some(
    (error) => error.field === "confirmPassword"
  );
  /**
   * Render loading state
   */
  if (tokenState === TokenValidationState.LOADING) {
    return (
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-lg border border-border">
          <CardContent className="py-8">
            <div className="text-center">
              {/* Themed loading spinner: uses ring-primary (Blue/Navy) */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Render invalid token state
   */
  if (tokenState === TokenValidationState.INVALID) {
    return (
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-lg border border-border">
          <CardHeader className="text-center">
            {/* Themed error icon background */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              This reset link has expired or is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Password reset links expire after 1 hour. Please request a new
                reset link.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Link href="/auth/forgot-password">
                {/* Button uses primary theme color (Blue/Navy) */}
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Request New Reset Link
                </Button>
              </Link>

              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Render success state
   */
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-lg border border-border">
          <CardHeader className="text-center">
            {/* Themed success icon background */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-2xl text-foreground">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your password has been successfully reset. You can now log in with
              your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login">
              {/* Button uses primary theme color (Blue/Navy) */}
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Render reset password form
   */
  return (
    <div className="container mx-auto px-4 max-w-md md:max-w-2xl">
      <Card className="shadow-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  aria-describedby="password-requirements"
                  aria-invalid={hasPasswordError}
                  // Uses destructive color
                  className={hasPasswordError ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  // Icon color is muted, but hovers to primary (Blue)
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-primary hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("password")}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  aria-invalid={hasConfirmPasswordError}
                  // Uses destructive color
                  className={
                    hasConfirmPasswordError ? "border-destructive" : ""
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

            {/* Password Requirements */}
            {formData.password &&
              PasswordRequirements(String(formData.password))}
            {/* Submit Button */}
            <Button
              type="submit"
              // Uses primary theme color (Blue/Navy)
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/auth/login"
              // Link color is primary (Blue/Navy)
              className="text-sm text-primary hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
