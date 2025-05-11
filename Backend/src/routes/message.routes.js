import { Router } from "express"
import verifyJwt from "../middleware/auth.middleware.js"
import { sendMessage, allMessage } from "../controllers/message.controller.js"
const router = Router()

router
    .route("/:chatId")
    .get(verifyJwt, allMessage)
    .post(verifyJwt, sendMessage)


export default router