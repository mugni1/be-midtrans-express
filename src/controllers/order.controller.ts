import { Request, Response } from "express";
import { response } from "../utils/response.js";
import { createOrderValidation } from "../validations/order.validation.js";
import midtransSnap from "../libs/midtrans.js";
import { countOrderBySearchService, createOrderDetailService, createOrderItem, getOrderDetailByTrxId, getOrdersService, updateOrderDetailByTrxId } from "../services/order.service.js";
import crypto from "crypto";
import "dotenv/config";
import { Meta } from "../types/meta.type.js";

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId as string
  const userName = req.userName as string
  const userPhone = req.userPhone as string
  const userEmail = req.userEmail as string

  // validation body
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
    customer_details: {
      first_name: userName,
      email: userEmail,
      phone: userPhone,
      billing_address: {
        first_name: userName,
        email: userEmail,
        phone: userPhone,
      },
      shipping_address: {
        first_name: userName,
        email: userEmail,
        phone: userPhone,
      }
    },
    transaction_details: {
      order_id: trxId,
      gross_amount: grossAmount
    },
  }

  try {
    // post to database
    const orderDetail = await createOrderDetailService({ destination: data.destination, trxId, grossAmount, userId })
    if (!orderDetail) {
      return response({ res, status: 500, message: "Create order detail falied" })
    }
    data.item_details.map(async (item) => {
      const orderItem = await createOrderItem({ itemId: item.id, orderDetailId: orderDetail.id })
      if (!orderItem) {
        return response({ res, status: 500, message: "Create order detail falied" })
      }
    })

    // create snap token and redirect url
    const results = await midtransSnap.createTransaction(payload)
    response({ res, status: 200, message: "Create Order Success", data: { ...results, id: orderDetail.id, trx_id: orderDetail.trxId } })
  } catch {
    response({ res, status: 500, message: "Internal server error" })
  }
}

export const handleNotification = async (req: Request, res: Response) => {
  const body = req.body;

  // check order detail
  const transaction = await getOrderDetailByTrxId(body.order_id);
  if (transaction) {

    // generate hadheh key
    const hashed = crypto.createHash('sha512').update(`${transaction.trxId}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');

    // check signature key
    if (body.signature_key == hashed) {
      let orderId = transaction.trxId;
      let transactionStatus = body.transaction_status;
      let fraudStatus = body.fraud_status;

      if (transactionStatus == 'capture') {
        if (fraudStatus == 'accept') {
          await updateOrderDetailByTrxId(orderId, body.payment_type, 'paid')
        }
      } else if (transactionStatus == 'settlement') {
        await updateOrderDetailByTrxId(orderId, body.payment_type, 'paid')
      } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
        await updateOrderDetailByTrxId(orderId, body.payment_type, 'failed')
      } else if (transactionStatus == 'pending') {
        await updateOrderDetailByTrxId(orderId, body.payment_type, 'pending')
      }
    }
  }

  response({ res, status: 200, message: "OK" })
}

export const getOrders = async (req: Request, res: Response) => {
  const search = req.query.search?.toString() || "";
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const offset = Number((page - 1) * limit);
  const orderBy = req.query.orderBy?.toString() || "createdAt";
  const sortBy = req.query.sortBy?.toString() || "desc";
  const meta: Meta = { limit, offset, page, search, orderBy, sortBy, total: 0 }

  try {
    const results = await getOrdersService(meta)
    const total = await countOrderBySearchService(meta.search)
    meta.total = total
    response({ res, message: "Success get orders", status: 200, data: results, meta })
  } catch {
    response({ res, message: "Internal server error", status: 500 })
  }
}

export const getOrderByTrxId = async (req: Request, res: Response) => {
  const { trxId } = req.params
  const userId = req.userId
  try {
    const result = await getOrderDetailByTrxId(trxId)
    if (!result) {
      return response({ res, status: 404, message: "Order detail not found" })
    }
    if (userId != result.userId) {
      return response({ res, status: 403, message: "Cannot access this order detail" })
    }
    response({ res, status: 200, message: "Success get detail order", data: result })
  } catch {
    response({ res, status: 500, message: "Internal server errro" })
  }
}