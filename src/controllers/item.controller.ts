import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { createUpdateItemValidation } from "../validations/item.validation.js";
import { countItemByIdService, createItemService, deleteItemService, getItemsService, updateItemSerevice } from "../services/item.service.js";
import { countCategoryByIdService } from "../services/category.service.js";
import { Meta } from "../types/meta.type.js";
import fileUpload from "express-fileupload";
import cloudinary from "../libs/cloudinary.js";
import { imageValidation } from "../utils/image.js";

export const getItems = async (req: Request, res: Response) => {
  const search = req.query.search?.toString() || "";
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const offset = Number((page - 1) * limit);
  const meta: Meta = { limit, offset, page, search, total: 0 }

  try {
    const data = await getItemsService(meta)
    response({ res, status: 200, message: "Get items successfully", data, meta })
  } catch (errors) {
    response({ res, status: 500, message: "Internal server error", errors })
  }
}

export const createItem = async (req: Request, res: Response) => {
  const image = imageValidation(req.files?.image as fileUpload.UploadedFile, res)
  const { data, success, error } = createUpdateItemValidation.safeParse(req.body)
  if (!success) {
    const errors = error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }))
    return response({ res, message: "Invalid input", errors, status: 400 })
  }

  try {
    const result = await new Promise<any>((resolve) => {
      cloudinary.uploader.upload_stream(
        { folder: "item/images" },
        (error: any, result: any) => {
          if (error) {
            return response({ res, status: 500, message: "Failed upload image" })
          }
          else {
            return resolve(result)
          }
        }
      ).end(image)
    })

    const isExistCategory = await countCategoryByIdService(data.category_id)
    if (isExistCategory < 1) {
      return response({ res, message: "Category not found", status: 404 })
    }

    const item = await createItemService(data, result.secure_url, result.public_id)
    if (!item) {
      return response({ res, message: "Item creation failed", status: 500 })
    }

    response({ res, message: "Item created successfully", status: 201, data: item })
  } catch (error) {
    response({ res, message: "Internal server error", status: 500 })
  }
}

export const updateItem = async (req: Request, res: Response) => {
  const id = req.params.id
  const body = req.body

  const { data, success, error } = createUpdateItemValidation.safeParse(body)
  if (!success) {
    const errors = error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }))
    return response({ res, message: "Invalid input", errors, status: 400 })
  }

  try {
    const isExistItem = await countItemByIdService(id)
    if (isExistItem < 1) {
      return response({ res, message: "Item not found", status: 404 })
    }

    const isExistCategory = await countCategoryByIdService(data.category_id)
    if (isExistCategory < 1) {
      return response({ res, message: "Category not found", status: 404 })
    }

    const item = await updateItemSerevice(id, data)
    if (!item) {
      return response({ res, message: "Item updation failed", status: 500 })
    }

    response({ res, message: "Item updated successfully", status: 200, data: item })
  } catch (error) {
    response({ res, message: "Internal server error", status: 500 })
  }
}

export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const isExistItem = await countItemByIdService(id)
    if (isExistItem < 1) {
      return response({ res, message: "Item not found", status: 404 })
    }

    const deleted = await deleteItemService(id)
    if (!deleted) {
      return response({ res, message: "Item deleting failed", status: 500 })
    }

    response({ res, message: "Item deleted successfully", status: 200, data: deleted })
  } catch (error) {
    response({ res, message: "Internal server error", status: 500 })
  }
}