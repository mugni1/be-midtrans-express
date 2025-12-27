import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router()
router.post("/", authMiddleware, createOrder)

export default router