import User from '../models/user.model.js'
import Payment from '../models/payment.model.js'
import { razorpay } from '../server.js'
import AppError from '../utils/error.util.js'
import crypto from 'crypto'
import { log } from 'console'

const getRazorpayApiKey = (req, res, next) => {
    try { 
        res.status(200).json({
            success: true,
            message: "Razorpay api key",
            key: process.env.RAZORPAY_KEY_ID
        })
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}
const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user
    
        const user = await User.findById(id)
    
        if (!user) {
            return next(new AppError("Unauthorize, please login", 400))
        }
    
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot purchase subscription", 400))
        }
    
        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 6,
            quantity: 1,
        })
    
        user.subscription.id = subscription.id
        user.subscription.status = subscription.status
    
        await user.save()

        console.log(subscription.status);
    
        res.status(200).json({
            success: true,
            message: "Subscribe successfully",
            subscription_id: subscription.id
        })    
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}
const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user
    
        const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body
    
        const user = await User.findById(id)
    
        if (!user) {
            return next(new AppError("Unauthorize, please login", 400))
        }
        
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET).update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
            .digest('hex')
    
        if (generatedSignature !== razorpay_signature) {
            return next(new AppError("Payment not verified, please try again", 500))
        }
    
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        })
    
        user.subscription.status = 'active'
        console.log(user);
        const u = await user.save();
        console.log(u);
    
        res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        })   
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}
const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user
    
        const user = await User.findById(id)
    
        if (!user) {
            return next(new AppError("Unauthorize, please login", 400))
        }
    
        if (user.role === "ADMIN") {
            return next(new AppError("Admin cannot purchase subscription", 400))
        }
    
        const subscriptionId = user.subscription.id
                // Attempt to cancel the subscription
                let subscription;
                try {
                    subscription = razorpay.subscriptions.cancel({
                        subscriptionId
                    });
        
                    user.subscription.status = subscription.status;
                    await user.save();
        
                    // Respond with a success message or status code
                    return res.status(200).json({ message: 'Subscription canceled successfully' });
                } catch (e) {
                    // Handle errors from Razorpay or other issues
                    return next(new AppError(`Failed to cancel subscription: ${e.message}`, 500));
                }
    } catch (e) {
        return next(new AppError(e.message, 500))
    }

}
const allPayments = async (req, res, next) => {
    try {
        const {count} = req.user;
    
        const subscriptions = await razorpay.subscription.all({
            count: count || 10
        })
    
        res.status(200).json({
            success: true,
            message: "All payment",
            subscriptions
        }) 
    } catch (e) {
        return next(new AppError(e.message, 500))
    }
}

export {
    getRazorpayApiKey,
    buySubscription,
    verifySubscription,
    cancelSubscription,
    allPayments

}