import express, { Request, Response } from "express"
import cors from "cors"
import { response } from "./utils/response.js"
import PaymentRoute from "./routes/payment.route.js"

// initialization
const app = express()
app.use(express.json())
app.use(cors({
    origin: [
        "https://app.port1.mugni.my.id",
        "https://fe-midtrans-vue.vercel.app"
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

// routes
app.get("/", (req: Request, res: Response) => response({ res, message: "Welcome Bro" }))
app.use(PaymentRoute)

// listening for dev
app.listen(5051, () => console.log("Server up and running"))

export default app