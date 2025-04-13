import express, { Router } from "express";
import { asyncHandler} from "../utils/asyncHandler";
import { authenticateRequest } from "../middleware/authenticateRequest";
import { depositAmount } from "../controllers/deposit.controller";

const router: Router = express.Router()
router.use(authenticateRequest)


router.post("/deposit", asyncHandler(depositAmount))

export default router