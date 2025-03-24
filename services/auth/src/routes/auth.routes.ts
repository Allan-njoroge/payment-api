import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {verifyEmail} from "../controllers/verify-email.controller";
import { registerUser } from "../controllers/register.controller";
import { loginUser } from "../controllers/login.controller";
import { refreshToken } from "../controllers/refresh-token.controller";
import { forgotPassword } from "../controllers/forgot-password.controller";

const router: Router = Router();

router.post("/verify-email", asyncHandler(verifyEmail))
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser))
router.post("/refresh-token", asyncHandler(refreshToken))
router.post('/forgot-password', asyncHandler(forgotPassword))

export default router;