import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {registerUser} from "../controllers/register.controller";
import { verifyAccount } from "../controllers/verify-account.controller";
import { loginUser } from "../controllers/login.controller";

const router: Router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/verify-account", asyncHandler(verifyAccount))
router.post("/login", asyncHandler(loginUser))

export default router;