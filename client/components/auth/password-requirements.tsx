import {
  checkPasswordRequirements,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS,
} from "@/constants/auth.constants";
import { CheckCircle } from "lucide-react";
import React from "react";

function PasswordRequirements(password: string) {
  const passwordChecks = checkPasswordRequirements(password);
  const meetsMinLength = passwordChecks.minLength;
  const meetsUppercase = passwordChecks.requireUppercase;
  const meetsLowercase = passwordChecks.requireLowercase;
  const meetsNumber = passwordChecks.requireNumber;
  const meetsSpecialChar = passwordChecks.requireSpecialChar; // فئة اللون لمتطلبات النجاح (تم تعيينها إلى اللون الأساسي للثيم: الأزرق)

  const successColorClass = "text-primary dark:text-primary";
  const successBgBorderClass =
    "border-primary dark:border-primary bg-primary dark:bg-primary";
  const defaultColorClass = "text-muted-foreground";

  return (
    <div
      id="password-requirements"
      className="text-sm space-y-2 p-3 rounded-lg bg-muted/50"
    >
           {" "}
      <p className="font-medium text-foreground">Password requirements:</p>     {" "}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Minimum Length */}       {" "}
        <li
          className={`flex items-center gap-2 transition-colors ${
            meetsMinLength ? successColorClass : defaultColorClass
          }`}
        >
                   {" "}
          <span
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              meetsMinLength ? successBgBorderClass : "border-muted-foreground"
            }`}
          >
                       {" "}
            {meetsMinLength && <CheckCircle className="w-3 h-3 text-white" />} 
                   {" "}
          </span>
                    At least {PASSWORD_MIN_LENGTH} characters        {" "}
        </li>
                {/* Uppercase Letter */}       {" "}
        {PASSWORD_REQUIREMENTS.requireUppercase && (
          <li
            className={`flex items-center gap-2 transition-colors ${
              meetsUppercase ? successColorClass : defaultColorClass
            }`}
          >
                       {" "}
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                meetsUppercase
                  ? successBgBorderClass
                  : "border-muted-foreground"
              }`}
            >
                           {" "}
              {meetsUppercase && <CheckCircle className="w-3 h-3 text-white" />}
                         {" "}
            </span>
                        At least one uppercase letter          {" "}
          </li>
        )}
                {/* Lowercase Letter */}       {" "}
        {PASSWORD_REQUIREMENTS.requireLowercase && (
          <li
            className={`flex items-center gap-2 transition-colors ${
              meetsLowercase ? successColorClass : defaultColorClass
            }`}
          >
                       {" "}
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                meetsLowercase
                  ? successBgBorderClass
                  : "border-muted-foreground"
              }`}
            >
                           {" "}
              {meetsLowercase && <CheckCircle className="w-3 h-3 text-white" />}
                         {" "}
            </span>
                        At least one lowercase letter          {" "}
          </li>
        )}
                {/* Number */}       {" "}
        <li
          className={`flex items-center gap-2 transition-colors ${
            meetsNumber ? successColorClass : defaultColorClass
          }`}
        >
                   {" "}
          <span
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              meetsNumber ? successBgBorderClass : "border-muted-foreground"
            }`}
          >
                       {" "}
            {meetsNumber && <CheckCircle className="w-3 h-3 text-white" />}     
               {" "}
          </span>
                    At least one number        {" "}
        </li>
                {/* Special Character */}       {" "}
        <li
          className={`flex items-center gap-2 transition-colors ${
            meetsSpecialChar ? successColorClass : defaultColorClass
          }`}
        >
                   {" "}
          <span
            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              meetsSpecialChar
                ? successBgBorderClass
                : "border-muted-foreground"
            }`}
          >
                       {" "}
            {meetsSpecialChar && <CheckCircle className="w-3 h-3 text-white" />}
                     {" "}
          </span>
                    At least one special char        {" "}
        </li>
             {" "}
      </ul>
         {" "}
    </div>
  );
}

export default PasswordRequirements;
