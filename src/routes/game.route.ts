import e from "express";
import { getGames } from "../controllers/game.controller.js";

const router = e.Router()
router.get("/", getGames)

export default router