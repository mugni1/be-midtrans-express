import e from "express"
import { postPayment } from "../controllers/payment.controller.js"

const router = e.Router()
router.post("/", postPayment)

export default router