import { Response } from "express"

export const response = ({ res, status = 200, message = "Message Response", data = null, meta = null, errors = null }: { res: Response, status?: number, message?: string, data?: any, meta?: any, errors?: any }) => {
    return res.status(status).json({ message, data, meta, errors })
}