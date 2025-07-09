import {Router} from "express"
import { refreshToken, validateToken } from "src/controllers/tokens.controller"
import validateRequest from "src/middleware/validateRequest"
import { refreshTokenSchema, validateTokenSchema } from "src/schema/tokens.schema"
import { asyncHandler } from "src/utils/asyncHandler"

const router = Router()

router.post(
    "/validate",
    validateRequest(validateTokenSchema),
    asyncHandler(validateToken),
)
router.post(
    "/refresh",
    validateRequest(refreshTokenSchema),
    asyncHandler(refreshToken)
)

export default router