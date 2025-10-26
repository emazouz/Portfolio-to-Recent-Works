import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface VerificationCodeInputProps {
  code: string;
  onCodeChange: (code: string) => void;
  onVerify: () => void;
  isLoading: boolean;
  title: string;
}

export const VerificationCodeInput = ({
  code,
  onCodeChange,
  onVerify,
  isLoading,
  title,
}: VerificationCodeInputProps) => (
  <div className="p-4 bg-muted/50 border border-primary/50 rounded-lg space-y-3">
    <p className="text-sm font-medium text-primary">{title}</p>
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Enter 6-digit code"
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
