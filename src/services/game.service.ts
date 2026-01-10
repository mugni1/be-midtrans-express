import { prisma } from "../libs/prisma.js";
import { QueryParams } from "../types/param.type.js";

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