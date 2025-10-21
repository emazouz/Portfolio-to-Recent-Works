import { checkPasswordRequirements, PASSWORD_MIN_LENGTH, PASSWORD_REQUIREMENTS } from "@/constants/auth";
import { CheckCircle } from "lucide-react";
import React from "react";

function PasswordRequirements(password: string) {
  const passwordChecks = checkPasswordRequirements(password);
  const meetsMinLength = passwordChecks.minLength;
  const meetsUppercase = passwordChecks.requireUppercase;
  const meetsLowercase = passwordChecks.requireLowercase;
  const meetsNumber = passwordChecks.requireNumber;
  const meetsSpecialChar = passwordChecks.requireSpecialChar;

  return (
    <div
      id="password-requirements"
      className="text-sm space-y-2 p-3 rounded-lg bg-muted/50"
    >
      <p className="font-medium text-foreground">Password requirements:</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li
          className={`flex items-center gap-2 transition-colors ${
            meetsMinLength
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        >
          <span
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              meetsMinLength
                ? "border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400"
                : "border-muted-foreground"
            }`}
          >
            {meetsMinLength && <CheckCircle className="w-3 h-3 text-white" />}
          </span>
          At least {PASSWORD_MIN_LENGTH} characters
        </li>

        {PASSWORD_REQUIREMENTS.requireUppercase && (
          <li
            className={`flex items-center gap-2 transition-colors ${
              meetsUppercase
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                meetsUppercase
                  ? "border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400"
                  : "border-muted-foreground"
              }`}
            >
              {meetsUppercase && <CheckCircle className="w-3 h-3 text-white" />}
            </span>
            At least one uppercase letter
          </li>
        )}

        {PASSWORD_REQUIREMENTS.requireLowercase && (
          <li
            className={`flex items-center gap-2 transition-colors ${
              meetsLowercase
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }`}
          >
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                meetsLowercase
                  ? "border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400"
                  : "border-muted-foreground"
              }`}
            >
              {meetsLowercase && <CheckCircle className="w-3 h-3 text-white" />}
            </span>
            At least one lowercase letter
          </li>
        )}

        <li
          className={`flex items-center gap-2 transition-colors ${
            meetsNumber
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        >
          <span
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              meetsNumber
                ? "border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400"
                : "border-muted-foreground"
            }`}
          >
            {meetsNumber && <CheckCircle className="w-3 h-3 text-white" />}
          </span>
          At least one number
        </li>

        <li
          className={`flex items-center gap-2 transition-colors ${
            meetsSpecialChar
              ? "text-green-600 dark:text-green-400"
              : "text-muted-foreground"
          }`}
        >
          <span
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              meetsSpecialChar
                ? "border-green-600 dark:border-green-400 bg-green-600 dark:bg-green-400"
                : "border-muted-foreground"
            }`}
          >
            {meetsSpecialChar && <CheckCircle className="w-3 h-3 text-white" />}
          </span>
          At least one special char
        </li>
      </ul>
    </div>
  );
}

export default PasswordRequirements;
