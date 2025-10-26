import z from "zod";

export enum MessageType {
  GENERAL = "GENERAL",
  PROJECT = "PROJECT",
  JOB_OFFER = "JOB_OFFER",
  COLLABORATION = "COLLABORATION",
  CONSULTATION = "CONSULTATION",
}

// Zod schema for contact message validation
export const createContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(200, "Subject must not exceed 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters")
    .trim(),
  type: z
    .enum(Object.values(MessageType) as [string, ...string[]])
    .default(MessageType.GENERAL),
});


export type CreateContactInput = z.infer<typeof createContactSchema>;