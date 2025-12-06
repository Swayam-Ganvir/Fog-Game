import express from "express"

import { getUserData } from "../controller/user/getUserData.js"
import { updateUserById } from "../controller/user/EditUserData.js"
import { deleteCheckpoint } from "../controller/user/deleteCheckpoint.js"
import { getPathToCheckpoint } from "../controller/user/getPathToCheckpoint.js"
import { statusUpdate } from "../controller/user/statusUpdate.js"
import { deleteProfile } from "../controller/user/deleteProfile.js"

const router = express.Router()

router.get("/userProfile/:id", getUserData)

router.put("/updateUser/:id", updateUserById)

router.delete("/deleteCheckpoint", deleteCheckpoint);

router.get("/path", getPathToCheckpoint);

router.post("/statusUpdate", statusUpdate)

router.post("/deleteProfile/:id" , deleteProfile)

export default router
    