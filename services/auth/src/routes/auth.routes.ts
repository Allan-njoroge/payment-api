import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {verifyContact} from "../controllers/verify-contact.controller";
import { registerUser } from "../controllers/register.controller";
import { loginUser } from "../controllers/login.controller";
import { refreshToken } from "../controllers/refresh-token.controller";
import { forgotPassword } from "../controllers/forgot-password.controller";
import { logoutUser } from "../controllers/logout.controller";

const router: Router = Router();

router.post("/verify-contact", asyncHandler(verifyContact))
router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser))
router.post("/refresh-token", asyncHandler(refreshToken))
router.post('/forgot-password', asyncHandler(forgotPassword))
router.post('/logout', asyncHandler(logoutUser))

export default router;