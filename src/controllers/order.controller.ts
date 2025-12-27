import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { createOrderValidation } from "../validations/order.validation.js";
import midtransSnap from "../libs/midtrans.js";
import { createOrderDetailService, createOrderItem } from "../services/order.service.js";

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId as string
  const { data, success, error } = createOrderValidation.safeParse(req.body)
  if (!success) {
    const errors = error.issues.map(err => ({ path: err.path.join('.'), message: err.message }))
    return response({ res, status: 400, message: "Invalid Input", errors })
  }

  // payload
  const grossAmount = data.item_details.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const trxId = `TRX_${Date.now()}`
  const payload = {
    item_details: data.item_details,
    transaction_details: {
      order_id: trxId,
      gross_amount: grossAmount
    },
  }

  try {
    const orderDetail = await createOrderDetailService({ destination: data.destination, trxId, grossAmount, userId })
    if (!orderDetail) {
      return response({ res, status: 500, message: "Create Order Detail Failed" })
    }

    data.item_details.map(async (item) => {
      const orderItem = await createOrderItem({ itemId: item.id, orderDetailId: orderDetail.id })
      if (!orderItem) {
        return response({ res, status: 500, message: "Create Order Item Failed" })
      }
    })

    const results = await midtransSnap.createTransaction(payload)
    response({ res, status: 200, message: "Create Order Success", data: results })
  } catch (errors) {
    console.log(errors)
    response({ res, status: 500, message: "Internal server error" })
  }
}