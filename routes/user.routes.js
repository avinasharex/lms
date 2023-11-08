import {Router} from "express"
import { changePassword, deleteUser, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/user.controller.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"
import upload from "../middleware/multer.middleware.js"
import { contactus } from "../controllers/contactus.controller.js"


const router = Router()

router.post("/register", upload.single("avatar"), register)
router.post("/login", login)
router.get("/logout", logout)
router.get("/me", isLoggedIn, getProfile)
router.delete("/delete", isLoggedIn, deleteUser)
router.post("/reset", forgotPassword)
router.post("/reset/:resetToken", resetPassword)
router.post("/change-password", isLoggedIn, changePassword)
router.put("/update/:id", upload.single("avatar"), updateUser)

router.post('/contactus', contactus)

export default router