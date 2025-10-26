"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, ArrowLeft, Upload } from "lucide-react";

interface UserFormProps {
  userId?: string;
}

export function UserForm({ userId }: UserFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for editing - replace with actual data fetching
  const [formData, setFormData] = useState({
    name: userId ? "John Doe" : "",
    email: userId ? "john@example.com" : "",
    password: "",
    confirmPassword: "",
    role: userId ? "admin" : "user",
    status: userId ? "active" : "active",
    avatar: userId ? "/placeholder.svg?height=80&width=80" : "",
    bio: userId ? "Experienced developer and admin" : "",
    phone: userId ? "+1234567890" : "",
    location: userId ? "New York, USA" : "",
    isEmailVerified: userId ? true : false,
    canReceiveEmails: userId ? true : true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("[v0] User form submitted:", formData);
    setIsLoading(false);
    router.push("/admin/users");
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("Back", "common.back")}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("Basic Information", "admin.users.basicInfo")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "Enter the user's basic information",
                    "admin.users.basicInfoDesc"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t("Full Name", "admin.users.fullName")}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder={t(
                        "Enter full name",
                        "admin.users.enterFullName"
                      )}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {t("Email Address", "admin.users.emailAddress")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder={t(
                        "Enter email address",
                        "admin.users.enterEmail"
                      )}
                      required
                    />
                  </div>
                </div>

                {!userId && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        {t("Password", "admin.users.password")}
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        placeholder={t(
                          "Enter password",
                          "admin.users.enterPassword"
                        )}
                        required={!userId}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        {t("Confirm Password", "admin.users.confirmPassword")}
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        placeholder={t(
                          "Confirm password",
                          "admin.users.confirmPasswordPlaceholder"
                        )}
                        required={!userId}
                      />
                    </div>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t("Phone Number", "admin.users.phoneNumber")}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder={t(
                        "Enter phone number",
                        "admin.users.enterPhone"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      {t("Location", "admin.users.location")}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder={t(
                        "Enter location",
                        "admin.users.enterLocation"
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t("Bio", "admin.users.bio")}</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder={t("Enter user bio", "admin.users.enterBio")}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {t("Permissions & Settings", "admin.users.permissions")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "Configure user permissions and account settings",
                    "admin.users.permissionsDesc"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      {t("Role", "admin.users.role")}
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select role",
                            "admin.users.selectRole"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          {t("Admin", "admin.users.admin")}
                        </SelectItem>
                        <SelectItem value="editor">
                          {t("Editor", "admin.users.editor")}
                        </SelectItem>
                        <SelectItem value="user">
                          {t("User", "admin.users.user")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">
                      {t("Status", "admin.users.status")}
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "Select status",
                            "admin.users.selectStatus"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          {t("Active", "admin.users.active")}
                        </SelectItem>
                        <SelectItem value="banned">
                          {t("Banned", "admin.users.banned")}
                        </SelectItem>
                        <SelectItem value="pending">
                          {t("Pending", "admin.users.pending")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {t("Email Verified", "admin.users.emailVerified")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Whether the user's email is verified",
                          "admin.users.emailVerifiedDesc"
                        )}
                      </p>
                    </div>
                    <Switch
                      checked={formData.isEmailVerified}
                      onCheckedChange={(checked) =>
                        handleInputChange("isEmailVerified", checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>
                        {t(
                          "Email Notifications",
                          "admin.users.emailNotifications"
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t(
                          "Allow user to receive email notifications",
                          "admin.users.emailNotificationsDesc"
                        )}
                      </p>
                    </div>
                    <Switch
                      checked={formData.canReceiveEmails}
                      onCheckedChange={(checked) =>
                        handleInputChange("canReceiveEmails", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Picture */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("Profile Picture", "admin.users.profilePicture")}
                </CardTitle>
                <CardDescription>
                  {t(
                    "Upload user's profile picture",
                    "admin.users.profilePictureDesc"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={formData.avatar || "/placeholder.svg"}
                      alt={formData.name}
                    />
                    <AvatarFallback className="text-lg">
                      {formData.name ? formData.name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {t("Upload Image", "admin.users.uploadImage")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading
              ? t("Saving...", "common.saving")
              : userId
              ? t("Update User", "admin.users.updateUser")
              : t("Create User", "admin.users.createUser")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t("Cancel", "common.cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
