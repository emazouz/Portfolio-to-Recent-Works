"use client";

import { createEmailHandlers } from "@/handlers/profile.email.handlers";
import { createProfileHandlers } from "@/handlers/profile.handlers";
import { createSecurityHandlers } from "@/handlers/profile.security.handlers";
import { useMessages } from "@/hooks/use-messages";
import { useUserProfile } from "@/hooks/use-user-profile";
import { authStore } from "@/store/authStore";
import { useState } from "react";
import { AlertMessage } from "../alert-message";
import { SideNav } from "./side-nav";
import { MobileNav } from "./mobile-nav";
import { Tabs, TabsContent } from "../ui/tabs";
import { ProfileTab } from "./tabs/profile-tab";
import { SecurityTab } from "./tabs/security-tab";
import { EmailTab } from "./tabs/email-tab";
import { PreferencesTab } from "./tabs/preferences-tab";
import { ReviewsTab } from "./tabs/reviews-tab";
import { TabValue } from "@/types/profile.types";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [code, setCode] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showAccountVerification, setShowAccountVerification] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");

  const { messages, showSuccess, showError, clearMessages } = useMessages();
  const { profile, setProfile, avatarPreview, setAvatarPreview, fetchUser } =
    useUserProfile();
  const {
    changePassword,
    isLoading,
    verifyEmailChange,
    requestEmailChange,
    verifyEmailVerified,
    requestEmailVerified,
    updateProfile,
  } = authStore();

  // Create handlers
  const profileHandlers = createProfileHandlers({
    profile,
    setProfile,
    fetchUser,
    showSuccess,
    showError,
    clearMessages,
    updateProfile,
    setAvatarPreview,
  });

  const securityHandlers = createSecurityHandlers({
    passwords,
    setPasswords,
    changePassword,
    showSuccess,
    showError,
    clearMessages,
  });

  const emailHandlers = createEmailHandlers({
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
  });

  if (!profile) {
    return;
  }

  return (
    <div className="min-h-screen">
      <div className="wrapper">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-foreground">
            Account Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your account settings
          </p>
        </header>

        {messages.success && (
          <AlertMessage type="success" message={messages.success} />
        )}
        {messages.error && (
          <AlertMessage type="error" message={messages.error} />
        )}

        <Tabs
          value={activeTab}
          onValueChange={(v: string) => setActiveTab(v as TabValue)}
        >
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
            <div className="hidden md:block">
              <SideNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="block md:hidden">
              <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="space-y-6">
              <TabsContent value="profile">
                <ProfileTab
                  profile={profile}
                  setProfile={setProfile}
                  avatarPreview={avatarPreview}
                  handlePhotoUpload={profileHandlers.handlePhotoUpload}
                  handleProfileUpdate={profileHandlers.handleProfileUpdate}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab
                  passwords={passwords}
                  setPasswords={setPasswords}
                  handlePasswordChange={securityHandlers.handlePasswordChange}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="email">
                <EmailTab
                  profile={profile}
                  newEmail={newEmail}
                  setNewEmail={setNewEmail}
                  emailPassword={emailPassword}
                  setEmailPassword={setEmailPassword}
                  code={code}
                  setCode={setCode}
                  showEmailVerification={showEmailVerification}
                  handleEmailChange={emailHandlers.handleEmailChange}
                  handleVerifyEmailChange={
                    emailHandlers.handleVerifyEmailChange
                  }
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="preferences">
                <PreferencesTab
                  profile={profile}
                  setProfile={setProfile}
                  code={code}
                  setCode={setCode}
                  showAccountVerification={showAccountVerification}
                  handleProfileUpdate={profileHandlers.handleProfileUpdate}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsTab
                  profile={profile}
                  reviewFilter={reviewFilter}
                  setReviewFilter={setReviewFilter}
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
