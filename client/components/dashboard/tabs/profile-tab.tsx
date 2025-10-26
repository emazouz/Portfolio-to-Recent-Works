import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Gender, UserProfile } from "@/types/profile.types";
import { getInitials } from "@/validators/index.validate";
import { Calendar, Upload } from "lucide-react";

interface ProfileTabProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  avatarPreview: string;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileUpdate: () => void;
  isLoading: boolean;
}

export const ProfileTab = ({
  profile,
  setProfile,
  avatarPreview,
  handlePhotoUpload,
  handleProfileUpdate,
  isLoading,
}: ProfileTabProps) => (
  <Card className="tab">
    <CardHeader>
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>
        Update your personal details and profile photo.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 p-4 border-b border-border pb-6">
          <Avatar className="h-28 w-28 border-4 border-card ring-4 ring-border shadow-md">
            <AvatarImage
              src={avatarPreview || profile?.avatar}
              alt={profile?.name}
            />
            <AvatarFallback className="text-3xl font-bold bg-muted text-foreground">
              {getInitials(profile?.name || "User")}
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

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile?.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Date of Birth
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={profile?.birthDate || ""}
              onChange={(e) =>
                setProfile({ ...profile, birthDate: e.target.value })
              }
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={profile?.gender || "PREFER_NOT_TO_SAY"}
              onValueChange={(value) =>
                setProfile({ ...profile, gender: value as Gender })
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
              value={profile?.role || "USER"}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Role cannot be changed here.
            </p>
          </div>
        </div>

        {/* Submit Button */}
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
);
