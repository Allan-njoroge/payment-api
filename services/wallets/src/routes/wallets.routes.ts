import express, {Router} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createWallet } from "../controllers/create.controller";
import { updateWallet } from "../controllers/updateWallet";
import { deleteWallet } from "../controllers/delete.controller";
import { getWalletById } from "../controllers/getWalletById";
import { getWalletsByUserId } from "../controllers/getByUser.controller";
import { authenticateRequest } from "../middleware/authenticateRequest";

const router: Router = express.Router()
router.use(authenticateRequest)

router.get("/:wallet_id", asyncHandler(getWalletById))
router.get("/me", asyncHandler(getWalletsByUserId))
router.post("/create", asyncHandler(createWallet))
router.put("/update/:wallet_id", asyncHandler(updateWallet))
router.delete("/delete/:wallet_id", asyncHandler(deleteWallet))

export default router