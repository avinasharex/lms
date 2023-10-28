import User from "../models/user.model.js"
import AppError from "../utils/error.util.js"
import jwt from "jsonwebtoken"

const isLoggedIn = (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new AppError("Unauthenticated please login again", 400))
    }
    const userDetails = jwt.verify(token, process.env.JWT_SECRET)

    req.user = userDetails


    next();
}

const authorizedRoles = (...roles) => (req, res, next) => {
    const currentUserRole = req.user.role

    if (!roles.includes(currentUserRole)) {
        return next(new AppError("You do not permssion to access ", 400))
    }
    next();
}

const authorizeSubscriber = async(req,_res,next)=>{
    try {
        const user = await User.findById(req.user.id)
        if(user.role !== "ADMIN" && user.subscription.status !== 'active'){
            return next(new AppError("Please subscribe to access this route", 403))
        }
        next()
    } catch (error) {
        return next(new AppError(error, 403))
    }
}

export {
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
}