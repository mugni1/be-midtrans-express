import { prisma } from "../libs/prisma.js";
import { QueryParams } from "../types/param.type.js";
import { CreateGamePayload, UpdateGamePayload } from "../validations/game.validation.js";

export const getGamesService = async (query: QueryParams) => {
    return prisma.game.findMany({
        where: {
            OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { studio: { contains: query.search, mode: 'insensitive' } }
            ]
        },
        take: query.limit,
        skip: query.offset,
        orderBy: {
            [query.orderBy]: query.sortBy
        }
    })
}

export const countGamesBySearchService = async (query: QueryParams) => {
    return prisma.game.count({
        where: {
            OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { studio: { contains: query.search, mode: 'insensitive' } }
            ]
        }
    })
}

export const createGameService = async (payload: CreateGamePayload) => {
    return prisma.game.create({
        data: {
            title: payload.title,
            studio: payload.studio,
            imageUrl: payload.image_url,
            imageId: payload.image_id,
            coverUrl: payload.cover_url,
            coverId: payload.cover_id
        }
    })
}

export const updateGameService = async (id: string, payload: UpdateGamePayload) => {
    return prisma.game.update({
        where: {
            id: id
        },
        data: {
            title: payload.title,
            studio: payload.studio,
            imageId: payload.image_id,
            imageUrl: payload.image_url,
            coverId: payload.cover_id,
            coverUrl: payload.cover_url,
        }
    })
}

export const deleteGameService = async (id: string) => {
    return prisma.game.delete({
        where: { id }
    })
}