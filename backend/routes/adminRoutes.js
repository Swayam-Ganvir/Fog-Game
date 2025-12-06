import express from "express"

import { authMiddleware } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/authorizeRoles.js"

import { getAllUsers } from "../controller/admin/getAllUsers.js"
import { deleteUser } from "../controller/admin/deleteUser.js"
import { getUserById } from "../controller/admin/getUserById.js"
import { admnLogin } from "../controller/admin/adminLogin.js"

const router = express.Router()

router.post("/adminLogin", admnLogin)

router.get("/allUsers", authMiddleware, authorizeRoles("admin"), getAllUsers)

router.delete("/deleteUser/:id", deleteUser)

router.get("/user/:id", getUserById)



export default router
