import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getUserById } from "../controllers/users/getUserById";

const router: Router = Router()

router.get("/:userId", asyncHandler(getUserById))

export default router