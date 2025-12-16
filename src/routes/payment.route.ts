import e from "express"
import { postPayment } from "../controllers/payment.controller.js"

const router = e.Router()
router.post("/payment", postPayment)

export default router