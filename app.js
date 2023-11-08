import { config } from "dotenv"
config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import userRoutes from "./routes/user.routes.js"
import courseRoutes from "./routes/course.route.js"
import paymentRoutes from "./routes/payment.route.js"
import adminRoutes from "./routes/admin.route.js"
import errorMiddleware from "./middleware/erro.middleware.js"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.use(morgan("dev"))

app.use("/ping", (req, res) => {
    res.send("/pong")
})

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/courses", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/admin", adminRoutes)

app.all("*", (req, res) => {
    res.status(404).send("OOPS! 404 page not found")
})

app.use(errorMiddleware)

export default app