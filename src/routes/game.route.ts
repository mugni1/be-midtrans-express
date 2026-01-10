import e from "express";
import { createGame, deleteGame, getGames, updateGame } from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { superUserMiddleware } from "../middlewares/super-user.middleware.js";

const router = e.Router()
router.get("/", getGames)
router.post("/", authMiddleware, superUserMiddleware, createGame)
router.put("/:id", authMiddleware, superUserMiddleware, updateGame)
router.delete("/:id", authMiddleware, superUserMiddleware, deleteGame)

export default router