import { toast } from "@/hooks/use-toast";
import {
  emailChangeSchema,
  verificationCodeSchema,
} from "@/validators/profile.validate";
import z from "zod";

export const createEmailHandlers = (context: any) => {
  const {
    newEmail,
    emailPassword,
    code,
    setCode,
    setNewEmail,
    setShowEmailVerification,
    requestEmailChange,
    verifyEmailChange,
    fetchUser,
    showSuccess,
    showError,
    clearMessages,
  } = context;

  const handleEmailChange = async () => {
    clearMessages();
    try {
      const validatedData = emailChangeSchema.parse({
        newEmail,
        password: emailPassword,
      });

      const result = await requestEmailChange(
        validatedData.newEmail,
        validatedData.password
      );

      if (result.success) {
        toast({ title: "Request Sent", description: "Check your inbox" });
        showSuccess("Check inbox for verification");
        setShowEmailVerification(true);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        showError(result.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showError(error.errors[0]?.message || "Invalid input");
      }
    }
  };

  const handleVerifyEmailChange = async () => {
    try {
      verificationCodeSchema.parse({ code });
      const result = await verifyEmailChange(code);

      if (result.success) {
        toast({ title: "Success", description: "Email updated!" });
        showSuccess("Email updated!");
        setCode("");
        setNewEmail("");
        setShowEmailVerification(false);
        fetchUser();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        showError(result.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showError(error.errors[0]?.message);
      }
    }
  };

  return { handleEmailChange, handleVerifyEmailChange };
};
