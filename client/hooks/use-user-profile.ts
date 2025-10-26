import { useState, useCallback, useEffect } from "react";
import { authStore } from "@/store/authStore";
import { UserProfile } from "@/types/profile.types";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const { getUser } = authStore();

  const fetchUser = useCallback(async () => {
    const result = await getUser();
    if (result.success && result.user) {
      const formattedUser = {
        ...result.user,
        birthDate: result.user.birthDate
          ? typeof result.user.birthDate === "string"
            ? result.user.birthDate.split("T")[0]
            : result.user.birthDate
          : undefined,
      };

      setProfile(formattedUser);
      if (formattedUser.avatar) {
        setAvatarPreview(formattedUser.avatar);
      }
    }
  }, [getUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { profile, setProfile, avatarPreview, setAvatarPreview, fetchUser };
};
