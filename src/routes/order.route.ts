import { Router } from "express";
import { createOrder, getOrderByTrxId, getOrders, handleNotification } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { superUserMiddleware } from "../middlewares/super-user.middleware.js";

const router = Router()
router.get("/", authMiddleware, superUserMiddleware, getOrders)
router.get("/:trxId", authMiddleware, getOrderByTrxId)
router.post("/", authMiddleware, createOrder)
router.post("/notification", handleNotification)

export default router