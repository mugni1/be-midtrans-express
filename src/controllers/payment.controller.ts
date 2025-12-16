import { Request, Response } from "express";
import { response } from "../utils/response.js";
import midtransSnap from "../libs/midtrans.js";
import { postPaymentValidate } from "../validations/payment.validation.js";

export const postPayment = async (req: Request, res: Response) => {
    const { data, success, error } = postPaymentValidate.safeParse(req.body)
    if (!success) {
        const errors = error.issues.map(err => ({ path: err.path.join('.'), message: err.message }))
        return response({ res, status: 400, message: "Invalid Input", errors })
    }
    
    const amounts = data.item_details.map(item => item.total_price);
    const grossAmount = amounts.reduce((prev, current) => prev + current, 0)
    const params = {
        item_details: data.item_details,
        transaction_details: {
            order_id: data.order_id,
            gross_amount: grossAmount
        },
    }

    try {
        const results = await midtransSnap.createTransaction(params)
        return response({ res, status: 200, message: "From Payment", data: results })
    } catch (err) {
        return response({ res, status: 500, message: "Server Down", errors: err })
    }
}