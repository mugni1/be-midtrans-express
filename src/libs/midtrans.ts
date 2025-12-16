import Midtrans from "midtrans-client"
import dotenv from "dotenv"
dotenv.config()

const midtransSnap = new Midtrans.Snap({
    isProduction: false,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
    serverKey: process.env.MIDTRANS_SERVER_KEY || ""
})

export default midtransSnap