import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { createUpdateItemValidation } from "../validations/item.validation.js";
import { countItemByIdService, createItemService, deleteItemService, getItemByIdService, getItemsService, updateItemSerevice } from "../services/item.service.js";
import { countCategoryByIdService } from "../services/category.service.js";
import { Meta } from "../types/meta.type.js";
import fileUpload from "express-fileupload";
import { imageValidateAndUpload } from "../utils/image.js";
import cloudinary from "../libs/cloudinary.js";

export const getItems = async (req: Request, res: Response) => {
  const search = req.query.search?.toString() || "";
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const offset = Number((page - 1) * limit);
  const orderBy = req.query.orderBy?.toString() || "createdAt";
  const sortBy = req.query.sortBy?.toString() || "desc";
  const meta: Meta = { limit, offset, page, search, orderBy, sortBy, total: 0 }

  try {
    const data = await getItemsService(meta)
    response({ res, status: 200, message: "Get items successfully", data, meta })
  } catch (errors) {
    response({ res, status: 500, message: "Internal server error", errors })
  }
}

export const createItem = async (req: Request, res: Response) => {
  const { data, success, error } = createUpdateItemValidation.safeParse(req.body)
  if (!success) {
    const errors = error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }))
    return response({ res, message: "Invalid input", errors, status: 400 })
  }

  try {
    const image = await imageValidateAndUpload(req.files?.image as fileUpload.UploadedFile, res)

    const isExistCategory = await countCategoryByIdService(data.category_id)
    if (isExistCategory < 1) {
      return response({ res, message: "Category not found", status: 404 })
    }

    const item = await createItemService(data, image.secure_url, image.public_id)
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

  // image 
  let image = req.files?.image as fileUpload.UploadedFile
  let imageUrl: string | undefined
  let publicId: string | undefined

  // body
  const { data, success, error } = createUpdateItemValidation.safeParse(req.body)
  if (!success) {
    const errors = error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message }))
    return response({ res, message: "Invalid input", errors, status: 400 })
  }

  try {
    const isExistItem = await getItemByIdService(id)
    if (!isExistItem) {
      return response({ res, message: "Item not found", status: 404 })
    }

    if (image) {
      const uploadedImage = await imageValidateAndUpload(image, res)
      await cloudinary.uploader.destroy(isExistItem.imageId)
      imageUrl = uploadedImage.secure_url
      publicId = uploadedImage.public_id
    }

    const isExistCategory = await countCategoryByIdService(data.category_id)
    if (isExistCategory < 1) {
      return response({ res, message: "Category not found", status: 404 })
    }

    const updated = await updateItemSerevice(id, data, imageUrl, publicId)
    if (!updated) {
      return response({ res, message: "Item updation failed", status: 500 })
    }

    response({ res, message: "Item updated successfully", status: 200, data: updated })
  } catch (error) {
    response({ res, message: "Internal server error", status: 500 })
  }
}

export const deleteItem = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    const isExistItem = await getItemByIdService(id)
    if (!isExistItem) {
      return response({ res, message: "Item not found", status: 404 })
    }

    await cloudinary.uploader.destroy(isExistItem.imageId)
    const deleted = await deleteItemService(id)
    if (!deleted) {
      return response({ res, message: "Item deleting failed", status: 500 })
    }

    response({ res, message: "Item deleted successfully", status: 200, data: deleted })
  } catch (error) {
    response({ res, message: "Internal server error", status: 500 })
  }
}