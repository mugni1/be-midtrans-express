import fileUpload from "express-fileupload"
import { response } from "./response.js"
import { Response } from "express"

export const imageValidation = (image: fileUpload.UploadedFile, res: Response) => {
  if (!image) {
    return response({ res, message: "image is required", status: 400 })
  }
  if (image.size > 4 * 1024 * 1024) {
    return response({ res, message: "maximum image size 4MB", status: 400 })
  }
  if (!image.mimetype.startsWith("image")) {
    return response({ res, message: "please input valid image", status: 400 })
  }

  return image.data
}