"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Lock,
  Calendar,
  Upload,
  Check,
  Bell,
  Shield,
  Star,
  MessageSquare,
  Plus,
  X,
  List,
  AlertTriangle,
} from "lucide-react";
import { authStore, UserType } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

// --- TYPE DEFINITIONS ---
type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";
type TabValue = "profile" | "security" | "email" | "preferences" | "reviews";
type ReviewFilter = "all" | "5" | "4" | "3" | "2" | "1";

interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  productName?: string;
}

interface PasswordState {
  current: string;
  new: string;
  confirm: string;
}

interface MessageState {
  success: string;
  error: string;
}

// --- CONSTANTS ---
const TABS = [
  { value: "profile" as const, label: "My Profile", icon: User },
  { value: "security" as const, label: "Security", icon: Lock },
  { value: "email" as const, label: "Email Settings", icon: Mail },
  { value: "preferences" as const, label: "Preferences", icon: Bell },
  { value: "reviews" as const, label: "My Reviews", icon: MessageSquare },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_PASSWORD_LENGTH = 8;
const MESSAGE_TIMEOUT = 3000;
const ERROR_TIMEOUT = 5000;

const INITIAL_PASSWORD_STATE: PasswordState = {
  current: "",
  new: "",
  confirm: "",
};

// --- UTILITY FUNCTIONS ---
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getInitials = (name: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
};

// --- CUSTOM HOOKS ---
const useMessages = () => {
  const [messages, setMessages] = useState<MessageState>({
    success: "",
    error: "",
  });

  const showSuccess = useCallback((message: string) => {
    setMessages((prev) => ({ ...prev, success: message, error: "" }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, success: "" }));
    }, MESSAGE_TIMEOUT);
  }, []);

  const showError = useCallback((message: string) => {
    setMessages((prev) => ({ ...prev, error: message, success: "" }));
    setTimeout(() => {
      setMessages((prev) => ({ ...prev, error: "" }));
    }, ERROR_TIMEOUT);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages({ success: "", error: "" });
  }, []);

  return { messages, showSuccess, showError, clearMessages };
};

// --- SUB-COMPONENTS ---
const StarRating = ({
  rating,
  interactive = false,
  onRatingChange,
}: {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}) => (
  <div className="flex gap-0.5 items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`${interactive ? "h-6 w-6 cursor-pointer" : "h-4 w-4"} ${
          star <= rating
            ? "fill-yellow-500 text-yellow-500"
            : interactive
            ? "text-muted-foreground/50 hover:text-yellow-300"
            : "text-muted-foreground/30"
        } ${interactive ? "transition-colors" : ""}`}
        onClick={interactive ? () => onRatingChange?.(star) : undefined}
      />
    ))}
  </div>
);

const AlertMessage = ({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) => (
  <Alert
    className={`mb-6 font-medium ${
      type === "success"
        ? "border-green-500 bg-green-50 text-green-700"
        : "border-red-500 bg-red-50 text-red-700"
    }`}
  >
    {type === "success" ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-600" />
    )}
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

// --- VERIFICATION CODE INPUT COMPONENT (Themed) ---
const VerificationCodeInput = ({
  code,
  onCodeChange,
  onVerify,
  isLoading,
  title,
}: {
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  isLoading: boolean;
  title: string;
}) => (
  // Applied themed colors: bg-muted/50, border-primary/50, text-primary
  <div className="p-4 bg-muted/50 border border-primary/50 rounded-lg space-y-3">
    <p className="text-sm font-medium text-primary">{title}</p>
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Enter 6-digit verification code"
        className="flex-1"
        maxLength={6}
        inputMode="numeric"
      />
      <Button
        onClick={onVerify}
        disabled={isLoading || code.length !== 6}
        size="sm"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function UserDashboard() {
  // State
  const [activeTab, setActiveTab] = useState<TabValue>("profile");
  const [profile, setProfile] = useState<
    (UserType & { avatarFile?: File }) | null
  >(null);
  const [passwords, setPasswords] = useState<PasswordState>(
    INITIAL_PASSWORD_STATE
  );
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [code, setCode] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showAccountVerification, setShowAccountVerification] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

  // Hooks
  const { messages, showSuccess, showError, clearMessages } = useMessages();
  const {
    getUser,
    changePassword,
    isLoading,
    verifyEmailChange,
    requestEmailChange,
    verifyEmailVerified,
    requestEmailVerified,
    updateProfile,
  } = authStore();

  // Fetch user data
  const fetchUser = useCallback(async () => {
    const result = await getUser();
    if (result.success && result.user) {
      // Format birthDate if it exists
      const formattedUser = {
        ...result.user,
        birthDate: result.user.birthDate
          ? typeof result.user.birthDate === "string"
            ? result.user.birthDate.split("T")[0] // Handle ISO string
            : result.user.birthDate
          : undefined,
      };

      setProfile(formattedUser);
      if (formattedUser.avatar) {
        setAvatarPreview(formattedUser.avatar);
      }

      console.log("Loaded user profile:", formattedUser);
    }
  }, [getUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // --- EVENT HANDLERS ---
  const handleProfileUpdate = async () => {
    clearMessages();

    if (!profile?.name?.trim()) {
      showError("Name is required!");
      return;
    }

    try {
      // Use the stored File object directly
      const avatarFile = profile.avatarFile;

      const result = await updateProfile({
        name: profile.name,
        gender: profile.gender,
        birthDate: profile.birthDate,
        avatar: avatarFile,
        subscribeNewsletter: profile.subscribeNewsletter,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Profile updated successfully!",
        });
        showSuccess("Profile updated successfully!");

        // Update profile with returned data if available
        // if (result.data) {
        //   setProfile({ ...result.data, avatarFile: undefined });
        //   if (result.data.avatar) {
        //     setAvatarPreview(result.data.avatar);
        //   }
        // } else {
        // }
        fetchUser();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update profile",
          variant: "error",
        });
        showError(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "error",
      });
      showError("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    clearMessages();

    if (passwords.new !== passwords.confirm) {
      showError("New passwords do not match!");
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match!",
        variant: "error",
      });
      return;
    }

    if (passwords.new.length < MIN_PASSWORD_LENGTH) {
      showError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters!`);
      return;
    }

    const result = await changePassword(passwords.current, passwords.new);
    if (result.success) {
      toast({
        title: "Success",
        description: result.message || "Password changed successfully!",
      });
      showSuccess("Password changed successfully!");
      setPasswords(INITIAL_PASSWORD_STATE);
      return;
    }

    toast({
      title: "Change Failed",
      description: result.message || "Password change failed",
      variant: "error",
    });
    showError(result.message || "Password change failed");
  };

  const handleEmailChange = async () => {
    clearMessages();

    if (!validateEmail(newEmail)) {
      showError("Please enter a valid email address!");
      return;
    }

    if (!emailPassword) {
      showError("Password is required to change email!");
      return;
    }

    const result = await requestEmailChange(newEmail, emailPassword);
    if (result.success) {
      toast({
        title: "Email Change Request Sent",
        description: result.message || "Check your inbox to verify new email.",
      });
      showSuccess("Check your inbox to verify new email.");
      setShowEmailVerification(true);
      return;
    }

    toast({
      title: "Email Change Failed",
      description: result.message || "Failed to request email change.",
      variant: "error",
    });
    showError(result.message || "Failed to request email change.");
  };

  const handleVerifyEmailChange = async () => {
    if (!code) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code.",
        variant: "error",
      });
      return;
    }

    try {
      const result = await verifyEmailChange(code);
      if (result.success) {
        toast({
          title: "Email Changed Successfully",
          description: result.message || "Your email has been updated.",
        });
        showSuccess("Your email has been updated.");
        setCode("");
        setNewEmail("");
        setShowEmailVerification(false);
        fetchUser();
        return;
      }
      toast({
        title: "Verification Failed",
        description: result.message || "Invalid or expired code.",
        variant: "error",
      });
      showError(result.message || "Invalid or expired code.");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification.",
        variant: "error",
      });
      showError("An error occurred during verification.");
    }
  };

  const handleRequestAccountVerification = async () => {
    const result = await requestEmailVerified();
    if (result.success) {
      toast({
        title: "Verification Email Sent",
        description: result.message || "Check your inbox for the code.",
      });
      showSuccess("Check your inbox for the code.");
      setShowAccountVerification(true);
      return;
    }

    toast({
      title: "Request Failed",
      description: result.message || "Failed to send verification email.",
      variant: "error",
    });
    showError(result.message || "Failed to send verification email.");
  };

  const handleVerifyAccount = async () => {
    if (!code) {
      toast({
        title: "Code Required",
        description: "Please enter the verification code.",
        variant: "error",
      });
      return;
    }

    try {
      const result = await verifyEmailVerified(code);
      if (result.success) {
        toast({
          title: "Account Verified",
          description: result.message || "Your account is now verified.",
        });
        showSuccess("Your account is now verified.");
        setCode("");
        setShowAccountVerification(false);
        fetchUser();
        return;
      }
      toast({
        title: "Verification Failed",
        description: result.message || "Invalid or expired code.",
        variant: "error",
      });
      showError(result.message || "Invalid or expired code.");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during verification.",
        variant: "error",
      });
      showError("An error occurred during verification.");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showError("File size must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    // Store the actual file for upload
    setProfile({ ...profile!, avatarFile: file });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      showSuccess("Photo selected! Click 'Save Profile Changes' to update.");
    };
    reader.onerror = () => {
      showError("Failed to read photo. Please try again.");
    };
    reader.readAsDataURL(file);
  };





  // --- COMPUTED VALUES ---
  const filteredReviews =
    reviewFilter === "all"
      ? profile?.reviews || []
      : (profile?.reviews || []).filter(
          (r) => r.rating === parseInt(reviewFilter)
        );

  const calculateAverageRating = (): string => {
    if (!profile?.reviews || profile.reviews.length === 0) return "N/A";
    const sum = profile.reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / profile.reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (profile?.reviews || []).forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  // --- RENDER HELPERS ---
  const renderSideNav = () => (
    <nav className="p-4 space-y-2 bg-card rounded-xl shadow-lg md:shadow-none">
      <h3 className="text-lg font-semibold text-foreground hidden md:block border-b border-border pb-2 mb-3">
        Settings
      </h3>
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-sm font-medium ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );

  // Loading state
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen">
      <div className="wrapper">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Account Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your personal profile, security, and preferences
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
          onValueChange={(value: string) => setActiveTab(value as TabValue)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
            <div className="hidden md:block">{renderSideNav()}</div>

            {/* Mobile Navigation */}
            <div className="block md:hidden mb-4">
              <Select
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as TabValue)}
              >
                <SelectTrigger className="w-full bg-card shadow-sm">
                  <List className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select a setting tab" />
                </SelectTrigger>
                <SelectContent>
                  {TABS.map((tab) => (
                    <SelectItem key={tab.value} value={tab.value}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
              {/* PROFILE TAB */}
              <TabsContent value="profile">
                <Card className="shadow-xl border-t-4 border-primary">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and profile photo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6 p-4 border-b border-border pb-6">
                        <Avatar className="h-28 w-28 border-4 border-card ring-4 ring-border shadow-md">
                          <AvatarImage
                            src={avatarPreview || profile.avatar}
                            alt={profile.name}
                          />
                          <AvatarFallback className="text-3xl font-bold bg-muted text-foreground">
                            {getInitials(profile.name || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <Label htmlFor="photo" className="cursor-pointer">
                            <Button asChild>
                              <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Change Photo
                              </div>
                            </Button>
                            <Input
                              id="photo"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                            />
                          </Label>
                          <p className="text-xs text-muted-foreground mt-2">
                            JPG, PNG or GIF. Max 2MB.
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profile.name || ""}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="birthDate"
                            className="flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Date of Birth
                          </Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={profile.birthDate || ""}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                birthDate: e.target.value,
                              })
                            }
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={profile.gender || "PREFER_NOT_TO_SAY"}
                            onValueChange={(value) =>
                              setProfile({
                                ...profile,
                                gender: value as Gender,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                              <SelectItem value="PREFER_NOT_TO_SAY">
                                Prefer not to say
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Account Role</Label>
                          <Input
                            id="role"
                            value={profile.role || "USER"}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Role cannot be changed here.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Button
                          onClick={handleProfileUpdate}
                          className="w-full md:w-auto"
                          disabled={isLoading}
                        >
                          {isLoading ? "Saving..." : "Save Profile Changes"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SECURITY TAB */}
              <TabsContent value="security">
                <Card className="shadow-xl border-t-4 border-primary">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwords.current}
                            onChange={(e) =>
                              setPasswords({
                                ...passwords,
                                current: e.target.value,
                              })
                            }
                            placeholder="Enter current password"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwords.new}
                              onChange={(e) =>
                                setPasswords({
                                  ...passwords,
                                  new: e.target.value,
                                })
                              }
                              placeholder="Enter new password"
                            />
                            <p className="text-xs text-muted-foreground">
                              Must be at least {MIN_PASSWORD_LENGTH} characters
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwords.confirm}
                              onChange={(e) =>
                                setPasswords({
                                  ...passwords,
                                  confirm: e.target.value,
                                })
                              }
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <Button
                          onClick={handlePasswordChange}
                          className="w-full md:w-auto"
                          disabled={isLoading}
                        >
                          {isLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* EMAIL TAB */}
              <TabsContent value="email">
                <Card className="shadow-xl border-t-4 border-primary">
                  <CardHeader>
                    <CardTitle>Change Email Address</CardTitle>
                    <CardDescription>
                      Update your email address for account notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-muted rounded-lg shadow-inner flex items-center justify-between border border-border">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Current Email
                          </p>
                          <p className="font-semibold text-foreground">
                            {profile.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {profile.emailVerified ? (
                            <span className="flex items-center gap-1 text-xs bg-green-200 text-green-800 px-2.5 py-1 rounded-full font-medium">
                              <Check className="h-3 w-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs bg-amber-200 text-amber-800 px-2.5 py-1 rounded-full font-medium">
                              <AlertTriangle className="h-3 w-3" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newEmail">New Email Address</Label>
                          <Input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email address"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="emailPassword">
                            Confirm Password
                          </Label>
                          <Input
                            id="emailPassword"
                            type="password"
                            value={emailPassword}
                            onChange={(e) => setEmailPassword(e.target.value)}
                            placeholder="Enter your current password"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border space-y-4">
                        <Button
                          onClick={handleEmailChange}
                          className="w-full md:w-auto"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Request Email Change"}
                        </Button>

                        {showEmailVerification && (
                          <VerificationCodeInput
                            code={code}
                            onCodeChange={setCode}
                            onVerify={handleVerifyEmailChange}
                            isLoading={isLoading}
                            title="Enter the verification code sent to your new email:"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PREFERENCES TAB */}
              <TabsContent value="preferences">
                <Card className="shadow-xl border-t-4 border-primary">
                  <CardHeader>
                    <CardTitle>Account Preferences</CardTitle>
                    <CardDescription>
                      Manage your notification and privacy settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="space-y-0.5">
                        <Label
                          htmlFor="newsletter"
                          className="text-base font-semibold"
                        >
                          Newsletter Subscription
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and content.
                        </p>
                      </div>
                      <Switch
                        id="newsletter"
                        checked={profile.subscribeNewsletter || false}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            subscribeNewsletter: checked,
                          })
                        }
                      />
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        Account Status
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between p-2 bg-card rounded-md border border-border">
                          <span className="text-muted-foreground">
                            Email Verified:
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                profile.emailVerified
                                  ? "text-green-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {profile.emailVerified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                            {!profile.emailVerified && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleRequestAccountVerification}
                                disabled={isLoading}
                                className="h-7 text-xs"
                              >
                                Verify Now
                              </Button>
                            )}
                          </div>
                        </div>

                        {showAccountVerification && !profile.emailVerified && (
                          <VerificationCodeInput
                            code={code}
                            onCodeChange={setCode}
                            onVerify={handleVerifyAccount}
                            isLoading={isLoading}
                            title="Enter the verification code sent to your email:"
                          />
                        )}

                        <div className="flex items-center justify-between p-2 bg-card rounded-md border border-border">
                          <span className="text-muted-foreground">
                            Terms Agreed:
                          </span>
                          <span
                            className={`font-medium ${
                              profile.termsAgreed
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {profile.termsAgreed ? "Agreed" : "Pending"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-card rounded-md border border-border">
                          <span className="text-muted-foreground">
                            Last Login:
                          </span>
                          <span className="font-medium text-foreground">
                            {profile.lastLoginAt
                              ? new Date(profile.lastLoginAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleProfileUpdate}
                      className="w-full md:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* REVIEWS TAB */}
              <TabsContent value="reviews">
                <Card className="shadow-xl border-t-4 border-primary">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>My Reviews</CardTitle>
                      <CardDescription>
                        View, add, and manage your product reviews.
                      </CardDescription>
                    </div>

                  </CardHeader>
                  <CardContent>
                    {!profile.reviews || profile.reviews.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-border mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          You haven't written any reviews yet.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Review Summary Block */}
                        <div className="p-4 bg-muted/50 rounded-lg border border-border shadow-inner">
                          <h3 className="font-bold text-lg mb-3">
                            Rating Summary
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-2xl font-bold text-foreground">
                                {calculateAverageRating()} / 5
                              </p>
                              <div className="flex items-center gap-1">
                                <StarRating
                                  rating={
                                    parseFloat(calculateAverageRating()) || 0
                                  }
                                />
                                <span className="text-sm text-muted-foreground">
                                  ({profile.reviews.length} total reviews)
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {[5, 4, 3, 2, 1].map((star) => (
                                <div
                                  key={star}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <span className="w-4 font-medium text-foreground">
                                    {star}
                                  </span>
                                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary transition-all"
                                      style={{
                                        width: `${
                                          Array(profile.reviews).length > 0
                                            ? (ratingDistribution[
                                                star as keyof typeof ratingDistribution
                                              ] /
                                                Array(profile.reviews).length) *
                                              100
                                            : 0
                                        }%`,
                                      }}
                                    />
                                  </div>
                                  <span className="w-8 text-right text-muted-foreground">
                                    {
                                      ratingDistribution[
                                        star as keyof typeof ratingDistribution
                                      ]
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Filter and List */}
                        <div className="flex items-center gap-2 mb-4">
                          <Label htmlFor="filter" className="text-sm">
                            Filter:
                          </Label>
                          <Select
                            value={reviewFilter}
                            onValueChange={(value: any) =>
                              setReviewFilter(value)
                            }
                          >
                            <SelectTrigger className="w-40 bg-card">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All ({profile.reviews.length})
                              </SelectItem>
                              <SelectItem value="5">
                                5 Stars ({ratingDistribution[5]})
                              </SelectItem>
                              <SelectItem value="4">
                                4 Stars ({ratingDistribution[4]})
                              </SelectItem>
                              <SelectItem value="3">
                                3 Stars ({ratingDistribution[3]})
                              </SelectItem>
                              <SelectItem value="2">
                                2 Stars ({ratingDistribution[2]})
                              </SelectItem>
                              <SelectItem value="1">
                                1 Star ({ratingDistribution[1]})
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-4">
                          {filteredReviews.map((review) => (
                            <div
                              key={review.id}
                              className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-foreground mb-1">
                                    {review?.project?.title_en ||
                                      "Unknown Product"}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <StarRating rating={review.rating} />
                                    <span className="text-xs text-muted-foreground">
                                      •{" "}
                                      {formatReviewDate(
                                        String(review.createdAt)
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-foreground mt-2 border-t border-border pt-2">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>

                        {filteredReviews.length === 0 &&
                          reviewFilter !== "all" && (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">
                                No reviews found with {reviewFilter} stars.
                              </p>
                            </div>
                          )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
