import { Router } from "express";
import {
  login,
  register,
  refreshAccessToken,
  logout,
  changePassword,
  resetPassword,
  forgotPassword,
  requestEmailChange,
  verifyEmailChange,
  getAllUsers,
  getUserByID,
  updateUserRole,
  deleteUser,
  requestEmailVerified,
  verifyEmailVerified,
  getUser,
} from "../controllers/authController";
import { authenticateJwt } from "../middleware/auth";

const router = Router();

router.get("/", authenticateJwt, getUser);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.post("/change-password", authenticateJwt, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/request-email-change", authenticateJwt, requestEmailChange);
router.post("/verify-email-change", authenticateJwt, verifyEmailChange);

router.post("/request-email-verified", authenticateJwt, requestEmailVerified);
router.post("/verify-email-verified", authenticateJwt, verifyEmailVerified);

router.get("/", getAllUsers);
router.get("/:id", getUserByID);
router.post("/:id", updateUserRole);
router.delete("/:id", deleteUser);
export default router;
