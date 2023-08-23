import {Router} from "express"
import { addLectureToCourseById, createCourse, getAllCourses, getCoursesById, removeCourse, updateCourse } from "../controllers/course.controller.js"
import upload from "../middleware/multer.middleware.js"
import { isLoggedIn, authorizedRoles } from "../middleware/auth.middleware.js"

const router = Router()

router.route('/')
.get(getAllCourses)
.post(isLoggedIn, authorizedRoles("ADMIN") ,upload.single("thumbnail"), createCourse)

router.route("/:id")
.get(isLoggedIn, authorizedRoles("ADMIN"), getCoursesById)
.put(isLoggedIn, authorizedRoles("ADMIN"), updateCourse)
.delete(isLoggedIn, authorizedRoles("ADMIN"), removeCourse)
.post(isLoggedIn, authorizedRoles("ADMIN"), upload.single("lecture"), addLectureToCourseById)


export default router