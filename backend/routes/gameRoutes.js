import experss from "express"
import { saveMapData } from "../controller/game/saveMapData.js"
import { getMapData } from "../controller/game/getMapData.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = experss.Router();

router.post("/save-map-data",authMiddleware, saveMapData)

router.get("/get-map-data",authMiddleware, getMapData)


export default router