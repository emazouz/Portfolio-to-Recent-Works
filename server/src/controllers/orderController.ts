import { Response } from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { asyncHandler } from "../middleware/asyncHandler";
import { AuthenticatedRequest } from "../middleware/auth";
import { sendResponse } from "../middleware/response";
import { prisma } from "../utils/prisma";

// Validation schemas
const createOrderSchema = z.object({
  templateId: z.number().int().positive("Template ID must be a positive integer"),
  paymentMethod: z.enum(["STRIPE", "PAYPAL", "BANK_TRANSFER", "OTHER"]).optional(),
  discount: z.number().min(0).optional(),
});

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"]).optional(),
  paymentMethod: z.enum(["STRIPE", "PAYPAL", "BANK_TRANSFER", "OTHER"]).optional(),
  transactionId: z.string().optional(),
  paymentData: z.record(z.string(), z.any()).optional(),
  failureReason: z.string().optional(),
});

// Create a new order
export const createOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { templateId, paymentMethod, discount } = createOrderSchema.parse(req.body);
      const userId = req.user?.userId;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      // Check if template exists and is active
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        select: {
          id: true,
          price: true,
          originalPrice: true,
          isActive: true,
          title_en: true,
        },
      });

      if (!template) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Template not found"
        );
      }

      if (!template.isActive) {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "This template is not available for purchase"
        );
      }

      // Check if user already owns this template (has a completed order)
      const existingOrder = await prisma.order.findFirst({
        where: {
          userId,
          templateId,
          status: "COMPLETED",
        },
      });

      if (existingOrder) {
        return sendResponse(
          res,
          StatusCodes.CONFLICT,
          false,
          "You already own this template"
        );
      }

      // Calculate final price
      const price = Number(template.price);
      const discountAmount = discount || 0;
      const finalPrice = Math.max(0, price - discountAmount);

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          templateId,
          price,
          discount: discountAmount,
          finalPrice,
          paymentMethod: paymentMethod || null,
          status: "PENDING",
        },
        include: {
          template: {
            select: {
              id: true,
              title_en: true,
              title_ar: true,
              imageUrl: true,
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return sendResponse(
        res,
        StatusCodes.CREATED,
        true,
        "Order created successfully",
        { order }
      );
    } catch (error) {
      console.error("Create order error:", error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => err.message).join(", ");
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          `Validation error: ${errorMessages}`
        );
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to create order"
      );
    }
  }
);

// Get all orders (admin) or user's orders
export const getOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === "ADMIN";
      const { status, page = "1", limit = "10" } = req.query;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: Prisma.OrderWhereInput = {};
      
      if (!isAdmin) {
        where.userId = userId; // Non-admins can only see their own orders
      }

      if (status) {
        where.status = status as any;
      }

      // Get orders with pagination
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          include: {
            template: {
              select: {
                id: true,
                title_en: true,
                title_ar: true,
                imageUrl: true,
                price: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        prisma.order.count({ where }),
      ]);

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Orders fetched successfully",
        {
          orders,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
          },
        }
      );
    } catch (error) {
      console.error("Get orders error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to fetch orders"
      );
    }
  }
);

// Get single order by ID
export const getOrderById = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderId = req.params.id;
      const userId = req.user?.userId;
      const isAdmin = req.user?.role === "ADMIN";

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          template: {
            select: {
              id: true,
              title_en: true,
              title_ar: true,
              imageUrl: true,
              price: true,
              downloadUrl: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Order not found"
        );
      }

      // Check permission (user owns order or is admin)
      if (order.userId !== userId && !isAdmin) {
        return sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "You don't have permission to access this order"
        );
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Order fetched successfully",
        { order }
      );
    } catch (error) {
      console.error("Get order error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to fetch order"
      );
    }
  }
);

// Update order (admin only)
export const updateOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderId = req.params.id;
      const isAdmin = req.user?.role === "ADMIN";

      if (!isAdmin) {
        return sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "Admin access required"
        );
      }

      const updateData = updateOrderSchema.parse(req.body);

      // Check if order exists
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existingOrder) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Order not found"
        );
      }

      // Update order
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          ...updateData,
          paidAt: updateData.status === "COMPLETED" ? new Date() : existingOrder.paidAt,
        },
        include: {
          template: {
            select: {
              id: true,
              title_en: true,
              title_ar: true,
              imageUrl: true,
              price: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // If order is completed, increment template downloads
      if (updateData.status === "COMPLETED" && existingOrder.status !== "COMPLETED") {
        await prisma.template.update({
          where: { id: order.templateId },
          data: {
            downloads: { increment: 1 },
          },
        });
      }

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Order updated successfully",
        { order }
      );
    } catch (error) {
      console.error("Update order error:", error);

      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((err) => err.message).join(", ");
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          `Validation error: ${errorMessages}`
        );
      }

      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to update order"
      );
    }
  }
);

// Cancel order
export const cancelOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderId = req.params.id;
      const userId = req.user?.userId;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      // Find order
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Order not found"
        );
      }

      // Check permission
      if (order.userId !== userId) {
        return sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "You don't have permission to cancel this order"
        );
      }

      // Check if order can be cancelled
      if (order.status === "COMPLETED") {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Cannot cancel a completed order. Please request a refund instead."
        );
      }

      if (order.status === "CANCELLED" || order.status === "REFUNDED") {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Order is already cancelled or refunded"
        );
      }

      // Cancel order
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
        include: {
          template: {
            select: {
              id: true,
              title_en: true,
              title_ar: true,
            },
          },
        },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Order cancelled successfully",
        { order: updatedOrder }
      );
    } catch (error) {
      console.error("Cancel order error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to cancel order"
      );
    }
  }
);

// Get order statistics (admin only)
export const getOrderStatistics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const isAdmin = req.user?.role === "ADMIN";

      if (!isAdmin) {
        return sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "Admin access required"
        );
      }

      const [
        totalOrders,
        completedOrders,
        pendingOrders,
        failedOrders,
        totalRevenue,
      ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: "COMPLETED" } }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.order.count({ where: { status: "FAILED" } }),
        prisma.order.aggregate({
          where: { status: "COMPLETED" },
          _sum: { finalPrice: true },
        }),
      ]);

      // Get recent orders
      const recentOrders = await prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          template: {
            select: {
              id: true,
              title_en: true,
              imageUrl: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Order statistics fetched successfully",
        {
          statistics: {
            totalOrders,
            completedOrders,
            pendingOrders,
            failedOrders,
            totalRevenue: totalRevenue._sum.finalPrice || 0,
            averageOrderValue:
              completedOrders > 0
                ? Number(totalRevenue._sum.finalPrice || 0) / completedOrders
                : 0,
          },
          recentOrders,
        }
      );
    } catch (error) {
      console.error("Get order statistics error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to fetch order statistics"
      );
    }
  }
);

// Get user's purchased templates
export const getUserPurchasedTemplates = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return sendResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          false,
          "User authentication required"
        );
      }

      const orders = await prisma.order.findMany({
        where: {
          userId,
          status: "COMPLETED",
        },
        include: {
          template: true,
        },
        orderBy: { paidAt: "desc" },
      });

      const templates = orders.map((order) => ({
        ...order.template,
        purchasedAt: order.paidAt,
        orderId: order.id,
      }));

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Purchased templates fetched successfully",
        { templates, count: templates.length }
      );
    } catch (error) {
      console.error("Get purchased templates error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to fetch purchased templates"
      );
    }
  }
);

// Delete order (admin only - soft delete or for testing)
export const deleteOrder = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderId = req.params.id;
      const isAdmin = req.user?.role === "ADMIN";

      if (!isAdmin) {
        return sendResponse(
          res,
          StatusCodes.FORBIDDEN,
          false,
          "Admin access required"
        );
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return sendResponse(
          res,
          StatusCodes.NOT_FOUND,
          false,
          "Order not found"
        );
      }

      // Only allow deletion of non-completed orders
      if (order.status === "COMPLETED") {
        return sendResponse(
          res,
          StatusCodes.BAD_REQUEST,
          false,
          "Cannot delete completed orders. Please use refund instead."
        );
      }

      await prisma.order.delete({
        where: { id: orderId },
      });

      return sendResponse(
        res,
        StatusCodes.OK,
        true,
        "Order deleted successfully"
      );
    } catch (error) {
      console.error("Delete order error:", error);
      return sendResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        false,
        "Failed to delete order"
      );
    }
  }
);