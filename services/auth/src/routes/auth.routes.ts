import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {registerUser} from "../controllers/register.controller";
import { verifyAccount } from "../controllers/verify-account.controller";
import { loginUser } from "../controllers/login.controller";
import { refreshToken } from "../controllers/refresh-token.controller";

const router: Router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/verify-account", asyncHandler(verifyAccount))
router.post("/login", asyncHandler(loginUser))
router.post("/refresh-token", asyncHandler(refreshToken))

export default router;