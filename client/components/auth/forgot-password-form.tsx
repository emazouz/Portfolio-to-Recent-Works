"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Mail, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { authStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

export function ForgotPasswordForm() {
  // Access authentication state and actions from the global store (authStore)
  const { forgotPassword, isLoading } = authStore(); // Local state management

  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);  // --- Countdown Timer Logic ---
  /**
   * Effect hook to manage the resend countdown timer.
   * Runs whenever isEmailSent or countdown state changes.
   */

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isEmailSent && countdown > 0) {
      // Start timer to decrement countdown every second
      timer = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (isEmailSent && countdown === 0) {
      // Countdown finished, allow resending the email
      setCanResend(true);
      if (timer) clearTimeout(timer); // Explicitly clear timer
    } // Cleanup function to clear the timer when the component unmounts or dependencies change

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEmailSent, countdown]);
  /**
   * Memoized value for the countdown timer display format.
   */

  const timeDisplay = useMemo(() => {
    const seconds = countdown % 60;
    return `${seconds}s`;
  }, [countdown]);  // --- Handle Initial Submission ---
  /**
   * Handles the submission of the email for password reset.
   */

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isLoading) return;

      try {
        // API call to send reset email (function logic is preserved)
        const ok = await forgotPassword(email);

        if (ok) {
          // Success: Transition to the email sent state and reset the timer
          setIsEmailSent(true);
          setCountdown(60);
          setCanResend(false);
        } else {
          // Handle API failure (e.g., email not found, server error)
          toast({
            title: "Request Failed",
            description:
              "Could not send the reset email. Please check your email or try again later.", // Uses the theme's destructive color variant for error messages
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error sending reset email:", error); // Show generic error toast for network/unexpected errors
        toast({
          title: "An unexpected error occurred",
          description: "Please check your network connection and try again.",
          variant: "error",
        });
      }
    },
    [email, forgotPassword, isLoading]
  );  // Dependencies for useCallback // --- Handle Resend Click ---
  /**
   * Handles the action of resending the password reset email.
   */

  const handleResend = useCallback(async () => {
    // Disable resend button immediately to prevent multiple clicks
    setCanResend(false);

    if (isLoading) return;

    try {
      // API call to resend email (function logic is preserved)
      const ok = await forgotPassword(email);

      if (ok) {
        // Success: Reset countdown, show success toast
        setCountdown(60);
        toast({
          title: "Email Resent",
          description: "A new password reset link has been sent to your email.", // Uses the theme's default success toast
        });
      } else {
        // Failure: Show error toast and re-enable resend button
        setCanResend(true);
        toast({
          title: "Email Resent Failed",
          description: "Could not resend the email. Please try again later.",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error resending email:", error); // Failure: Show error and re-enable resend button
      setCanResend(true);
      toast({
        title: "An unexpected error occurred",
        description: "Please try again or contact support.",
        variant: "error",
      });
    }
  }, [email, forgotPassword, isLoading]);  // Dependencies for useCallback // --- Render Logic ---
  /**
   * Renders the confirmation screen after the reset email has been sent.
   */

  if (isEmailSent) {
    return (
      <div className="container mx-auto px-4 max-w-md">
                {/* Card uses theme card color and border */}       {" "}
        <Card className="shadow-lg bg-[var(--color-card)] border-[var(--color-border)]">
                   {" "}
          <CardHeader className="text-center">
                       {" "}
            {/* Success Icon styling: Background uses primary/secondary mix, icon uses foreground color */}
                       {" "}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                           {" "}
              <Mail className="h-6 w-6 text-[var(--color-primary)]" />         
               {" "}
            </div>
                        {/* Title uses foreground color */}           {" "}
            <CardTitle className="text-2xl text-[var(--color-foreground)]">
                            Check Your Email 📧            {" "}
            </CardTitle>
                        {/* Description uses muted foreground color */}         
             {" "}
            <CardDescription className="text-[var(--color-muted-foreground)]">
                            If your email address **{email}** is registered, a
              password reset               link has been sent to your inbox.    
                     {" "}
            </CardDescription>
                     {" "}
          </CardHeader>
                   {" "}
          <CardContent className="space-y-6">
                       {" "}
            {/* Alert component styling: Uses background/border for visibility */}
                       {" "}
            <Alert className="bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-foreground)]">
                           {" "}
              <AlertDescription>
                                Check your **Spam or Junk folder** if you don't
                find the                 message.              {" "}
              </AlertDescription>
                         {" "}
            </Alert>
                       {" "}
            <div className="space-y-4">
                            {/* Resend Button */}             {" "}
              <Button
                onClick={handleResend}
                disabled={!canResend || isLoading}
                variant="outline" // Button uses primary/card colors
                className="w-full bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-border)] hover:bg-[var(--color-accent)]/20 hover:text-[var(--color-foreground)]"
              >
                               {" "}
                {isLoading ? (
                  "Sending..."
                ) : canResend ? (
                  "Resend Link"
                ) : (
                  // Countdown display
                  <div className="flex items-center justify-center gap-2">
                                        <Clock className="h-4 w-4" />           
                            Resend in {timeDisplay}                 {" "}
                  </div>
                )}
                             {" "}
              </Button>
                            {/* Back to Login Link */}             {" "}
              <Link href="/auth/login">
                               {" "}
                <Button
                  variant="ghost"
                  className="w-full text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10"
                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />     
                              Back to Login                {" "}
                </Button>
                             {" "}
              </Link>
                         {" "}
            </div>
                     {" "}
          </CardContent>
                 {" "}
        </Card>
             {" "}
      </div>
    );
  }
  /**
   * Renders the initial form for entering the email address.
   */

  return (
    <div className="container mx-auto px-4 max-w-md">
            {/* Card uses theme card color and border */}     {" "}
      <Card className="shadow-lg bg-[var(--color-card)] border-[var(--color-border)]">
               {" "}
        <CardHeader className="text-center">
                    {/* Title uses foreground color */}         {" "}
          <CardTitle className="text-2xl text-[var(--color-foreground)]">
                        Forgot Password          {" "}
          </CardTitle>
                    {/* Description uses muted foreground color */}         {" "}
          <CardDescription className="text-[var(--color-muted-foreground)]">
                        Enter your email address and we'll send you a link to
            reset your             password.          {" "}
          </CardDescription>
                 {" "}
        </CardHeader>
               {" "}
        <CardContent className="space-y-6">
                   {" "}
          <form onSubmit={handleSubmit} className="space-y-4">
                       {" "}
            <div className="space-y-2">
                            {/* Label uses foreground color */}             {" "}
              <Label htmlFor="email" className="text-[var(--color-foreground)]">
                                Email Address              {" "}
              </Label>
                           {" "}
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Input styling uses input/foreground colors
                className="bg-[var(--color-input)] text-[var(--color-foreground)] border-[var(--color-border)] ring-offset-[var(--color-background)] focus-visible:ring-[var(--color-ring)]"
              />
                         {" "}
            </div>
                        {/* Submit Button */}           {" "}
            <Button
              type="submit" // Button uses primary color
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-[var(--color-primary-foreground)]"
              disabled={isLoading || email.length < 5}
            >
                           {" "}
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}         
               {" "}
            </Button>
                     {" "}
          </form>
                   {" "}
          <div className="text-center">
                       {" "}
            <Link
              href="/auth/login" // Link uses primary color
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
                            <ArrowLeft className="mr-1 inline h-4 w-4" />       
                    Back to Login            {" "}
            </Link>
                     {" "}
          </div>
                 {" "}
        </CardContent>
             {" "}
      </Card>
         {" "}
    </div>
  );
}
