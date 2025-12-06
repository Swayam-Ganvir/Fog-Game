import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"

import { dbConnect } from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()
const port = 8000;
dotenv.config()

app.use(json())

const corsSystem = {
    credentials: true,
    origin : "http://localhost:3000",
    methods : ["POST", "GET", "PUT", "DELETE"]
}

app.use(cors(corsSystem))

// ----------Routes----------
app.use("/api", authRoutes)
app.use("/api/mapData", gameRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)


dbConnect().then(() => {
    app.listen(port, ()=> {
        console.log(`Server running at port : ${port}`)
    })
})
