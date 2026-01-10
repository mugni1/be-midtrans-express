import { Request, Response } from "express"
import { response } from "../utils/response.js"
import { Meta } from "../types/meta.type.js"
import { countGamesBySearchService, getGamesService } from "../services/game.service.js"

export const getGames = async (req: Request, res: Response) => {
    const search = req.query?.search?.toString() || ""
    const limit = Number(req.query?.limit) || 5
    const page = Number(req.query?.page) || 1
    const offset = Number(limit * (page - 1))
    const orderBy = req.query?.orderBy?.toString() || "createdAt"
    const sortBy = req.query?.sortBy?.toString() || "desc"
    const meta: Meta = { limit, offset, orderBy, sortBy, page, search, total: 0 }

    try {
        meta.total = await countGamesBySearchService(meta)
        const data = await getGamesService(meta)
        response({ res, status: 200, message: "Success get all game", data })
    } catch {
        response({ res, status: 500, message: "Internal server error" })
    }
}