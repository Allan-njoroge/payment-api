import { Router, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {registerUser} from "../controllers/register.controller";
import { verifyAccount } from "../controllers/verify-account.controller";

const router: Router = Router();

router.post("/register", asyncHandler(registerUser));
router.post("/verify-account", asyncHandler(verifyAccount))

export default router;