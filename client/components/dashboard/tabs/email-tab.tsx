import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerificationCodeInput } from "@/components/verification-code-input";
import { AlertTriangle, Check } from "lucide-react";

export const EmailTab = ({
  profile,
  newEmail,
  setNewEmail,
  emailPassword,
  setEmailPassword,
  code,
  setCode,
  showEmailVerification,
  handleEmailChange,
  handleVerifyEmailChange,
  isLoading,
}: any) => (
  <Card className="tab">
    <CardHeader>
      <CardTitle>Change Email Address</CardTitle>
      <CardDescription>Update your email for notifications</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border border-border flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Email</p>
            <p className="font-semibold text-foreground">{profile.email}</p>
          </div>
          <div>
            {profile.emailVerified ? (
              <span className="flex items-center gap-1 text-xs bg-green-200 text-green-800 px-2.5 py-1 rounded-full">
                <Check className="h-3 w-3" />
                Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs bg-amber-200 text-amber-800 px-2.5 py-1 rounded-full">
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
              placeholder="Enter new email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailPassword">Confirm Password</Label>
            <Input
              id="emailPassword"
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="Current password"
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
              title="Enter verification code sent to new email:"
            />
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
