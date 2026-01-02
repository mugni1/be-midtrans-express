import { prisma } from "../libs/prisma.js";
import { QueryParams } from "../types/param.type.js";
import { CreateUpdateItemPayload } from "../validations/item.validation.js";

export const getItemsService = async (query: QueryParams) => {
  return await prisma.item.findMany({
    include: {
      category: { select: { name: true, code: true } }
    },
    where: {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' } },
        {
          category: {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' } },
              { code: { contains: query.search, mode: 'insensitive' } }
            ]
          }
        },
        { merchantName: { contains: query.search, mode: 'insensitive' } },
      ]
    },
    orderBy: {
      [query.orderBy]: query.sortBy
    },
    skip: query.offset,
    take: query.limit
  });
};

export const countItemByKeywordService = async (keyword: string) => {
  return await prisma.item.count({
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        {
          category: {
            OR: [
              { name: { contains: keyword, mode: 'insensitive' } },
              { code: { contains: keyword, mode: 'insensitive' } }
            ]
          }
        },
        { merchantName: { contains: keyword, mode: 'insensitive' } },
      ]
    }
  })
}

export const createItemService = async (payload: CreateUpdateItemPayload, imageUrl: string, imageId: string) => {
  return await prisma.item.create({
    data: {
      name: payload.name,
      imageUrl: imageUrl,
      imageId: imageId,
      price: payload.price,
      categoryId: payload.category_id,
      merchantName: payload.merchant_name
    }
  })
}

export const updateItemSerevice = async (id: string, payload: CreateUpdateItemPayload, imageUrl?: string, imageId?: string) => {
  return await prisma.item.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      imageUrl: imageUrl,
      imageId: imageId,
      price: payload.price,
      categoryId: payload.category_id,
      merchantName: payload.merchant_name
    }
  })
}

export const countItemByIdService = async (id: string) => {
  return await prisma.item.count({
    where: {
      id
    }
  })
}

export const deleteItemService = async (id: string) => {
  return await prisma.item.delete({
    where: {
      id
    }
  })
}

export const getItemByIdService = async (id: string) => {
  return await prisma.item.findUnique({
    where: {
      id
    }
  })
}