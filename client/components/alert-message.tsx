import { AlertTriangle, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface AlertMessageProps {
  type: "success" | "error";
  message: string;
}

export const AlertMessage = ({ type, message }: AlertMessageProps) => (
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
