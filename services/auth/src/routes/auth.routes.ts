import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUser,
} from "src/controllers/auth.controller";
import validateRequest from "src/middleware/validateRequest";
import {
  forgotPasswordSchema,
  loginUserSchema,
  logoutUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from "src/schema/auth.schema";
import { asyncHandler } from "src/utils/asyncHandler";

const router = Router();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  asyncHandler(registerUser)
);
router.post(
  "/verify",
  validateRequest(verifyUserSchema),
  asyncHandler(verifyUser)
);
router.post(
  "/login",
  validateRequest(loginUserSchema),
  asyncHandler(loginUser)
);
router.post(
  "/logout",
  validateRequest(logoutUserSchema),
  asyncHandler(logoutUser)
)
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  asyncHandler(forgotPassword)
)
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  asyncHandler(resetPassword)
)

export default router;
