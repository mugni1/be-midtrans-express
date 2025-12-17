import { prisma } from "../libs/prisma.js";
import { QueryParams } from "../types/param.type.js";


export const getCategoryService = async (query: QueryParams) => {
  return await prisma.category.findMany({
    where: {
      name: {
        contains: query.search,
        mode: 'insensitive'
      }
    },
    skip: query.offset,
    take: query.limit
  });
};

export const countCategoryService = async (query: { search: string }) => {
  return await prisma.category.count({
    where: {
      name: {
        contains: query.search,
        mode: 'insensitive'
      }
    }
  });
};

export const createCategoryService = async (payload: { name: string }) => {
  return await prisma.category.create({
    data: payload
  })
};

export const updateCategoryService = async (id: string, payload: { name: string }) => {
  return await prisma.category.update({
    where: {
      id
    },
    data: payload
  })
};

export const deleteCategoryService = async (id: string) => {
  return await prisma.category.delete({
    where: {
      id
    }
  })
};

export const countCategoryByNameService = async (name: string) => {
  return await prisma.category.count({
    where: {
      name
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


export const getCategoryByNameService = async (name: string) => {
  return await prisma.category.findUnique({
    where: {
      name
    }
  });
}
