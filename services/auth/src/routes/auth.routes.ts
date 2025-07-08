import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "src/controllers/auth.controller";
import validateRequest from "src/middleware/validateRequest";
import {
  loginUserSchema,
  registerUserSchema,
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
  asyncHandler(logoutUser)

)

export default router;
