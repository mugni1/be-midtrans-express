import express, { Response } from "express"
import cors from "cors"
import fileUpload from "express-fileupload"
import { response } from "./utils/response.js"
import PaymentRoute from "./routes/payment.route.js"
import AuthRoute from "./routes/auth.route.js"
import CategoryRoute from "./routes/category.route.js"
import ItemRoute from "./routes/item.route.js"
import OrderRoute from "./routes/order.route.js"
import GameRoute from "./routes/game.route.js"
import UploadRoute from "./routes/upload.route.js"

// initialization
const app = express()
app.use(express.json())
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
}));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pos.v1.mugni.my.id",
    "https://app.v1.mugni.my.id",
    "http://192.168.43.160:5173"
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// routes
app.get("/", (_, res: Response) => response({ res, message: "Welcome Bro" }))
app.use("/payment", PaymentRoute)
app.use("/auth", AuthRoute)
app.use("/category", CategoryRoute)
app.use("/item", ItemRoute)
app.use("/order", OrderRoute)
app.use("/game", GameRoute)
app.use("/storage", UploadRoute)
app.use((_, res: Response) => response({ res, status: 404, message: "Route Not Found" }));

// listening for dev
app.listen(5051, () => console.log("Server up and running"))
export default app