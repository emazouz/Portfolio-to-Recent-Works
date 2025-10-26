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
import { MIN_PASSWORD_LENGTH } from "@/constants/profile.constants";
import { PasswordState } from "@/types/profile.types";

interface SecurityTabProps {
  passwords: PasswordState;
  setPasswords: (passwords: PasswordState) => void;
  handlePasswordChange: () => void;
  isLoading: boolean;
}

export const SecurityTab = ({
  passwords,
  setPasswords,
  handlePasswordChange,
  isLoading,
}: SecurityTabProps) => (
  <Card className="tab">
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
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
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
                  setPasswords({ ...passwords, new: e.target.value })
                }
                placeholder="Enter new password"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least {MIN_PASSWORD_LENGTH} characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
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
);
