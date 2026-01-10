import { prisma } from "../libs/prisma.js";
import { QueryParams } from "../types/param.type.js";
import { CreateCategoryPayload, UpdateCategoryPayload } from "../validations/category.validation.js";


export const getCategoryService = async (query: QueryParams) => {
  return await prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } }
      ]
    },
    orderBy: {
      [query.orderBy]: query.sortBy
    },
    skip: query.offset,
    take: query.limit
  });
};

export const countCategoryService = async (query: { search: string }) => {
  return await prisma.category.count({
    where: {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } }
      ]
    }
  });
};

export const createCategoryService = async (payload: CreateCategoryPayload) => {
  return await prisma.category.create({
    data: {
      name: payload.name,
      code: payload.code,
      gameId: payload.game_id
    }
  })
};

export const updateCategoryService = async (id: string, payload: UpdateCategoryPayload) => {
  return await prisma.category.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      code: payload.code,
      gameId: payload.game_id
    }
  })
};

export const deleteCategoryService = async (id: string) => {
  return await prisma.category.delete({
    where: {
      id
    }
  })
};

export const countCategoryByCodeService = async (code: string) => {
  return await prisma.category.count({
    where: {
      code
    }
  });
};

export const countCategoryByIdService = async (id: string) => {
  return await prisma.category.count({
    where: {
      id
    }
  });
};


export const getCategoryByCodeService = async (code: string) => {
  return await prisma.category.findUnique({
    where: {
      code
    }
  });
}
