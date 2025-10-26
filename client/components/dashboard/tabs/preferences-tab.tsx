import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { VerificationCodeInput } from "@/components/verification-code-input";
import { Shield } from "lucide-react";

export const PreferencesTab = ({
  profile,
  setProfile,
  code,
  setCode,
  showAccountVerification,
  handleRequestAccountVerification,
  handleVerifyAccount,
  handleProfileUpdate,
  isLoading,
}: any) => (
  <Card className="tab">
    <CardHeader>
      <CardTitle>Account Preferences</CardTitle>
      <CardDescription>Manage notifications and privacy</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div>
          <Label htmlFor="newsletter" className="text-base font-semibold">
            Newsletter Subscription
          </Label>
          <p className="text-sm text-muted-foreground">Receive updates about features</p>
        </div>
        <Switch
          id="newsletter"
          checked={profile.subscribeNewsletter || false}
          onCheckedChange={(checked) =>
            setProfile({ ...profile, subscribeNewsletter: checked })
          }
        />
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          Account Status
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-card rounded-md border border-border">
            <span className="text-muted-foreground">Email Verified:</span>
            <div className="flex items-center gap-2">
              <span className={profile.emailVerified ? "text-green-600" : "text-amber-600"}>
                {profile.emailVerified ? "Verified" : "Unverified"}
              </span>
              {!profile.emailVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRequestAccountVerification}
                  disabled={isLoading}
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
              title="Enter code sent to your email:"
            />
          )}

          <div className="flex items-center justify-between p-2 bg-card rounded-md border">
            <span className="text-muted-foreground">Last Login:</span>
            <span className="font-medium">
              {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <Button onClick={handleProfileUpdate} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </CardContent>
  </Card>
);
