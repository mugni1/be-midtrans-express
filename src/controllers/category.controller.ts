import { Request, Response } from "express";
import { countCategoryByIdService, countCategoryByCodeService, countCategoryService, createCategoryService, deleteCategoryService, getCategoryService, updateCategoryService } from "../services/category.service.js";
import { response } from "../utils/response.js";
import { Meta } from "../types/meta.type.js";
import { createCategoryValidation, updateCategoryValidation } from "../validations/category.validation.js";

export const getCategory = async (req: Request, res: Response) => {
  const search = req.query?.search?.toString() || "";
  const limit = Number(req.query?.limit) || 10;
  const page = Number(req.query?.page) || 1;
  const offset = Number(limit * (page - 1));
  const orderBy = req.query.orderBy?.toString() || "createdAt";
  const sortBy = req.query.sortBy?.toString() || "desc";
  const meta: Meta = { search, page, limit, offset, orderBy, sortBy, total: 0 };

  try {
    const data = await getCategoryService({ limit, offset, search, page, orderBy, sortBy });
    if (!data) {
      return response({ res, status: 404, message: "Category not found" });
    }
    meta.total = await countCategoryService({ search });

    return response({ res, status: 200, message: "Category retrieved successfully", data, meta });
  } catch (errors: unknown) {
    return response({ res, status: 500, message: "Internal server error", errors });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { success, error, data } = createCategoryValidation.safeParse(body);
    if (!success) {
      const errors = error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
      return response({ res, status: 400, message: "Invalid input", errors });
    }

    const isExist = await countCategoryByCodeService(data.code);
    if (isExist) {
      return response({ res, status: 400, message: "Category already exists" });
    }

    const category = await createCategoryService(data);
    if (!category) {
      return response({ res, status: 500, message: "Failed to create category" });
    }

    return response({ res, status: 201, message: "Category created successfully", data: category });
  } catch (errors: unknown) {
    return response({ res, status: 500, message: "Internal server error", errors });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { success, error, data } = updateCategoryValidation.safeParse(body);
    if (!success) {
      const errors = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return response({ res, status: 400, message: "Invalid input", errors });
    }

    if (data.code) {
      const isExist = await countCategoryByCodeService(data.code);
      if (isExist) {
        return response({ res, status: 400, message: "Category already exists" });
      }
    }

    const isExistId = await countCategoryByIdService(id);
    if (!isExistId) {
      return response({ res, status: 404, message: "Category not found" });
    }

    const category = await updateCategoryService(id, data);
    if (!category) {
      return response({ res, status: 500, message: "Failed to update category" });
    }

    return response({ res, status: 200, message: "Category updated successfully", data: category });
  } catch (errors: unknown) {
    return response({ res, status: 500, message: "Internal server error", errors });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const isExistId = await countCategoryByIdService(id);
    if (!isExistId) {
      return response({ res, status: 404, message: "Category not found" });
    }

    const category = await deleteCategoryService(id);
    if (!category) {
      return response({ res, status: 500, message: "Failed to delete category" });
    }

    return response({ res, status: 200, message: "Category deleted successfully", data: category });
  } catch (errors: unknown) {
    return response({ res, status: 500, message: "Internal server error", errors });
  }
};
