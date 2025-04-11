import express, {Router} from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { createWallet } from "../controllers/create.controller";
import { updateWallet } from "../controllers/updateWallet";
import { deleteWallet } from "../controllers/delete.controller";
import { getWalletById } from "../controllers/getWalletById";
import { getWalletsByUserId } from "../controllers/getByUser.controller";
import { authenticateRequest } from "../middleware/authenticateRequest";
import { getWalletByAdress } from "../controllers/getWalletByAddress";
import { getAllWalletTypes } from "../controllers/getALLWalletTypes";

const router: Router = express.Router()
router.use(authenticateRequest)

router.get("/id/:wallet_id", asyncHandler(getWalletById))
router.get("/address/:wallet_address", asyncHandler(getWalletByAdress))
router.get("/me", asyncHandler(getWalletsByUserId))
router.post("/create", asyncHandler(createWallet))
router.put("/update/:wallet_id", asyncHandler(updateWallet))
router.delete("/delete/:wallet_id", asyncHandler(deleteWallet))


router.get("/types", asyncHandler(getAllWalletTypes))

export default router