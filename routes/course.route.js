import {Router} from "express"
import { addLectureToCourseById, createCourses,getAllCourses, getCoursesById, removeCourse, removeLectureFromCourse, updateCourse } from "../controllers/course.controller.js"
import upload from "../middleware/multer.middleware.js"
import { isLoggedIn, authorizedRoles } from "../middleware/auth.middleware.js"

const router = Router()

router.route('/')
.get(isLoggedIn,getAllCourses)
.post(isLoggedIn, authorizedRoles("ADMIN") ,upload.single("thumbnail"), createCourses)
.delete(isLoggedIn, authorizedRoles("ADMIN"), removeLectureFromCourse)

router.route("/:id")
.get(isLoggedIn, authorizedRoles("ADMIN","USER"), getCoursesById)
.put(isLoggedIn, authorizedRoles("ADMIN"), updateCourse)
.delete(isLoggedIn, authorizedRoles("ADMIN"), removeCourse)
.post(isLoggedIn, authorizedRoles("ADMIN"), upload.single("lecture"), addLectureToCourseById)

router


export default router