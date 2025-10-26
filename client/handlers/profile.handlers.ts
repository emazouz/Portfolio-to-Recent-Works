import { toast } from "@/hooks/use-toast";
import {
  imageUploadSchema,
  profileUpdateSchema,
} from "@/validators/profile.validate";
import z from "zod";

export const createProfileHandlers = (context: any) => {
  const {
    profile,
    setProfile,
    fetchUser,
    showSuccess,
    showError,
    clearMessages,
    updateProfile,
    setAvatarPreview,
  } = context;

  const handleProfileUpdate = async () => {
    clearMessages();
    try {
      const validatedData = profileUpdateSchema.parse({
        name: profile?.name,
        birthDate: profile?.birthDate,
        gender: profile?.gender,
        subscribeNewsletter: profile?.subscribeNewsletter,
      });

      if (profile?.avatarFile) {
        imageUploadSchema.parse({ file: profile.avatarFile });
      }

      const result = await updateProfile({
        ...validatedData,
        avatar: profile?.avatarFile,
      });

      if (result.success) {
        toast({ title: "Success", description: result.message });
        showSuccess("Profile updated!");
        fetchUser();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "error",
        });
        showError(result.message || "Update failed");
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
      } else {
        showError("Update failed. Please try again.");
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      imageUploadSchema.parse({ file });
      setProfile({ ...profile!, avatarFile: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        showSuccess("Photo selected! Save to update.");
      };
      reader.onerror = () => showError("Failed to read photo");
      reader.readAsDataURL(file);
    } catch (error) {
      if (error instanceof z.ZodError) {
        showError(error.errors[0]?.message || "Invalid image");
      }
    }
  };

  return { handleProfileUpdate, handlePhotoUpload };
};
