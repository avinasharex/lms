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

const authorizeSubscriber = (req,res,next)=>{
    const subscription = req.user.subscription
    const currentUserRole = req.user.role
    if(currentUserRole !== "ADMIN" && subscription !== 'active'){
        return next(new AppError("Please subscribe tp access this route", 403))
    }
}

export {
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
}