/**
 * Password validation constants and utilities
 * @module constants/auth
 */

/**
 * Minimum password length requirement
 */

export const PASSWORD_MIN_LENGTH = 8;

/**
 * Password requirements configuration
 * Controls which validation rules are enforced
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: false,
  requireSpecialChar: false,
} as const;

/**
 * Regular expressions for password validation
 */
export const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /\d/,
  specialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/,
} as const;

/**
 * Password requirement check result
 */

export interface PasswordRequirementCheck {
  minLength: boolean;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
}

/**
 * Checks which password requirements are met for a given password
 * @param password - The password string to check
 * @returns Object indicating which requirements are satisfied
 *
 * @example
 * ```typescript
 * const requirements = checkPasswordRequirements("MyPass123!");
 * console.log(requirements.minLength); // true
 * console.log(requirements.requireUppercase); // true
 * ```
 */

export function checkPasswordRequirements(
  password: string
): PasswordRequirementCheck {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    requireUppercase: PASSWORD_REGEX.uppercase.test(password),
    requireLowercase: PASSWORD_REGEX.lowercase.test(password),
    requireNumber: PASSWORD_REGEX.number.test(password),
    requireSpecialChar: PASSWORD_REGEX.specialChar.test(password),
  };
}

/**
 * Checks if a password meets all enabled requirements
 * @param password - The password string to validate
 * @returns True if all enabled requirements are met, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = isPasswordValid("MyPassword123");
 * console.log(isValid); // true or false based on PASSWORD_REQUIREMENTS
 * ```
 */

export function isPasswordValid(password: string): boolean {
  const checks = checkPasswordRequirements(password);

  return (
    checks.minLength &&
    (!PASSWORD_REQUIREMENTS.requireUppercase || checks.requireUppercase) &&
    (!PASSWORD_REQUIREMENTS.requireLowercase || checks.requireLowercase) &&
    (!PASSWORD_REQUIREMENTS.requireNumber || checks.requireNumber) &&
    (!PASSWORD_REQUIREMENTS.requireSpecialChar || checks.requireSpecialChar)
  );
}

/**
 * Gets a list of enabled password requirements for display
 * @returns Array of requirement descriptions that are currently enabled
 *
 * @example
 * ```typescript
 * const requirements = getEnabledRequirements();
 * // ["At least 8 characters", "At least one uppercase letter", ...]
 * ```
 */

export function getEnabledRequirements(): string[] {
  const requirements: string[] = [`At least ${PASSWORD_MIN_LENGTH} characters`];

  if (PASSWORD_REQUIREMENTS.requireUppercase) {
    requirements.push("At least one uppercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase) {
    requirements.push("At least one lowercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireNumber) {
    requirements.push("At least one number");
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChar) {
    requirements.push("At least one special character");
  }

  return requirements;
}

/**
 * Password strength levels
 */
export enum PasswordStrength {
  WEAK = "weak",
  FAIR = "fair",
  GOOD = "good",
  STRONG = "strong",
}

/**
 * Calculates password strength based on requirements met
 * @param password - The password string to evaluate
 * @returns Password strength level
 *
 * @example
 * ```typescript
 * const strength = getPasswordStrength("MyPass");
 * console.log(strength); // PasswordStrength.WEAK
 * ```
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return PasswordStrength.WEAK;

  const checks = checkPasswordRequirements(password);
  const metRequirements = Object.values(checks).filter(Boolean).length;

  if (metRequirements <= 2) return PasswordStrength.WEAK;
  if (metRequirements === 3) return PasswordStrength.FAIR;
  if (metRequirements === 4) return PasswordStrength.GOOD;
  return PasswordStrength.STRONG;
}
