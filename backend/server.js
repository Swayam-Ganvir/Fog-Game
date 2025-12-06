import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"

import { dbConnect } from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import gameRoutes from "./routes/gameRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()
dotenv.config()

// --- CRITICAL CHANGE 1: Use the system port or 8000 ---
const port = process.env.PORT || 8000; 

app.use(json())

// --- CRITICAL CHANGE 2: Simplified CORS for Deployment ---
// This configuration allows ANY website to talk to your backend.
// This is easiest for deployment. You can lock it down later if you want.
app.use(cors({
    origin: "*", // Allow all origins (Netlify, localhost, etc.)
    credentials: true // Keep this if you use cookies, otherwise optional
}));

// ----------Routes----------
app.use("/api", authRoutes)
app.use("/api/mapData", gameRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/user", userRoutes)


dbConnect().then(() => {
    // Listen on '0.0.0.0' to ensure external access on some cloud platforms
    app.listen(port, "0.0.0.0", ()=> {
        console.log(`Server running at port : ${port}`)
    })
})