import { Request, Response } from "express"
import { response } from "../utils/response.js"
import { Meta } from "../types/meta.type.js"
import { countGamesBySearchService, createGameService, getGamesService } from "../services/game.service.js"
import { createGameSchema } from "../validations/game.validation.js"

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
        response({ res, status: 200, message: "Success get all game", data, meta })
    } catch {
        response({ res, status: 500, message: "Internal server error" })
    }
}

export const createGame = async (req: Request, res: Response) => {
    const { data, error, success } = createGameSchema.safeParse(req.body)
    if (!success) {
        const errors = error.issues.map((err) => ({ message: err.message, path: err.path.join('.') }))
        return response({ res, status: 400, message: "Invalid input", errors })
    }
    try {
        const results = await createGameService(data)
        response({ res, status: 200, message: "Success created game", data: results })
    } catch {
        response({ res, status: 500, message: "Internal server error" })
    }
}