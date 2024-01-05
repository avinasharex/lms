import {Router} from "express"
import { authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js"
import { getUserData } from "../controllers/admin.controller.js"

const router = Router()

router.get('/stats/user', isLoggedIn, authorizedRoles("ADMIN"), getUserData)

export default router