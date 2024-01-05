import Contactus from "../models/contactus.model.js";
import AppError from "../utils/error.util.js";

export const contactus = async(req,res,next)=>{
    try {
        const {name,email,message} = req.body

        if(!name || !email || !message){
            return next(new AppError("All field are required", 400));
        }

        const contactus = await Contactus.create({
            name,
            email,
            message
        })

        if(!contactus){
            return next(new AppError("Cannot your message received, Please try again", 400));
        }

        await contactus.save()
        res.status(201).json({
            success: true,
            message: "Your message successfully received",
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}