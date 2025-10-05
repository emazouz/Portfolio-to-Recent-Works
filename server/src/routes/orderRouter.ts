import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  cancelOrder,
  getOrderStatistics,
  getUserPurchasedTemplates,
  deleteOrder,
} from "../controllers/orderController";
import { authenticateJwt, requireAdmin } from "../middleware/auth";

const router = express.Router();

// Public/User routes (require authentication)
router.post("/orders", authenticateJwt, createOrder);
router.get("/orders", authenticateJwt, getOrders);
router.get("/orders/purchased-templates", authenticateJwt, getUserPurchasedTemplates);
router.get("/orders/:id", authenticateJwt, getOrderById);
router.patch("/orders/:id/cancel", authenticateJwt, cancelOrder);

// Admin only routes
router.patch("/orders/:id", authenticateJwt, requireAdmin, updateOrder);
router.delete("/orders/:id", authenticateJwt, requireAdmin, deleteOrder);
router.get("/admin/orders/statistics", authenticateJwt, requireAdmin, getOrderStatistics);

export default router;