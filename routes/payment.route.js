import { Router } from "express"
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/payment.controller.js"
import { authorizeSubscriber, authorizedRoles, isLoggedIn } from "../middleware/auth.middleware.js"

const router = Router()

router.route('/razorpay-key')
    .get(isLoggedIn,
        getRazorpayApiKey
    )

router.route('/subscribe')
    .post(isLoggedIn,
        buySubscription
    )

router.route('/verify')
    .post(isLoggedIn,
        verifySubscription
    )

router.route('/unsubscribe')
    .get(isLoggedIn,
        authorizeSubscriber,
        cancelSubscription
    )

router.route('/')
    .get(isLoggedIn,
        authorizedRoles("ADMIN"),
        allPayments
    )

export default router