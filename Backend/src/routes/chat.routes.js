import { Router } from "express"
import verifyJwt from "../middleware/auth.middleware.js"
import { accessChat, fetchChat } from "../controllers/chat.controller.js"
const router = Router()

router
    .route("/")
    .get(verifyJwt, fetchChat)

router.route("/:userId")
    .post(verifyJwt, accessChat)


export default router