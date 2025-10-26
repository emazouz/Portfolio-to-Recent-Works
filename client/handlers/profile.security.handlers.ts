import { toast } from "@/hooks/use-toast";
import { passwordChangeSchema } from "@/validators/profile.validate";
import { z } from "zod";
export const createSecurityHandlers = (context: any) => {
  const {
    passwords,
    setPasswords,
    changePassword,
    showSuccess,
    showError,
    clearMessages,
  } = context;

  const handlePasswordChange = async () => {
    clearMessages();
    try {
      const validatedData = passwordChangeSchema.parse(passwords);
      const result = await changePassword(
        validatedData.current,
        validatedData.new
      );

      if (result.success) {
        toast({ title: "Success", description: "Password changed!" });
        showSuccess("Password changed!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        showError(result.message || "Change failed");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const msg = error.errors[0]?.message || "Validation failed";
        showError(msg);
        toast({
          title: "Validation Error",
          description: msg,
          variant: "error",
        });
      }
    }
  };

  return { handlePasswordChange };
};
