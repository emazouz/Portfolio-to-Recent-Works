import { Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";
import { z } from "zod";
import { sendResponse } from "../middleware/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../utils/prisma";
import { MessageType } from "@prisma/client";

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

// Create contact message handler
export const createContact = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // Check authentication
    if (!requireAuth(req, res)) return;

    // Validate request body
    const validateData = createContactSchema.safeParse(req.body);

    if (!validateData.success) {
      return sendResponse(
        res,
        StatusCodes.BAD_REQUEST,
        false,
        "Invalid data provided",
        {
          errors: validateData.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        }
      );
    }

    try {
      // Create contact message in database
      const addContact = await prisma.contactMessage.create({
        data: {
          name: validateData.data.name,
          email: validateData.data.email,
          subject: validateData.data.subject,
          message: validateData.data.message,
          type: validateData.data.type as MessageType,
          status: "UNREAD",
        },
      });

      return sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "Contact message created successfully",
        addContact
      );
    } catch (error) {
      console.error("Error creating contact message:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to create contact message. Please try again later."
      );
    }
  }
);

// Get all contact messages (admin only)
export const getAllContacts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    try {
      const { status, type, page = "1", limit = "10" } = req.query;

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      // Build filter object
      const where: any = {};
      if (status) where.status = status;
      if (type) where.type = type;

      // Get total count and messages
      const [total, contacts] = await Promise.all([
        prisma.contactMessage.count({ where }),
        prisma.contactMessage.findMany({
          where,
          skip,
          take: limitNum,
          orderBy: { createdAt: "desc" },
        }),
      ]);

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Contact messages retrieved successfully",
        {
          contacts,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        }
      );
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to retrieve contact messages"
      );
    }
  }
);

// Get single contact message by ID
export const getContactById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    try {
      const id = parseInt(req.params.id);

      const contact = await prisma.contactMessage.findUnique({
        where: { id },
      });

      if (!contact) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Contact message not found"
        );
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Contact message retrieved successfully",
        contact
      );
    } catch (error) {
      console.error("Error fetching contact message:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to retrieve contact message"
      );
    }
  }
);

// Update contact message status
export const updateContactStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["UNREAD", "READ", "ARCHIVED"].includes(status)) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Invalid status value"
        );
      }

      const updatedContact = await prisma.contactMessage.update({
        where: { id },
        data: { status },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Contact status updated successfully",
        updatedContact
      );
    } catch (error) {
      console.error("Error updating contact status:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to update contact status"
      );
    }
  }
);

// Delete contact message
export const deleteContact = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!requireAuth(req, res)) return;

    try {
      const id = parseInt(req.params.id);

      await prisma.contactMessage.delete({
        where: { id },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Contact message deleted successfully"
      );
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to delete contact message"
      );
    }
  }
);
