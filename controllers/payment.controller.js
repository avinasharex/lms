import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";
import { log } from "console";

const getRazorpayApiKey = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Razorpay api key",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};
const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorize, please login", 400));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchase subscription", 400));
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 6,
      quantity: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    console.log(subscription.status);

    res.status(200).json({
      success: true,
      message: "Subscribe successfully",
      subscription_id: subscription.id,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};
const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorize, please login", 400));
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment not verified, please try again", 500));
    }

    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";
    console.log(user);
    const u = await user.save();
    console.log(u);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};
const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorize, please login", 400));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchase subscription", 400));
    }

    const subscriptionId = user.subscription.id;
    // Attempt to cancel the subscription
    let subscription;
    try {
      subscription = razorpay.subscriptions.cancel({
        subscriptionId,
      });

      user.subscription.status = subscription.status;
      await user.save();

      // Respond with a success message or status code
      return res
        .status(200)
        .json({ message: "Subscription canceled successfully" });
    } catch (e) {
      // Handle errors from Razorpay or other issues
      return next(
        new AppError(`Failed to cancel subscription: ${e.message}`, 500)
      );
    }
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};
const monthlySalesRecord = async (req, res, next) => {
  try {
    const {count} = req.query;
    const jan = await razorpay.subscriptions.all({
      from: "2023-01-01",
      to: "2023-01-31",
      count: count,
    });
    const feb = await razorpay.subscriptions.all({
      from: "2023-02-01",
      to: "2023-02-29",
      count: count,
    });
    const mar = await razorpay.subscriptions.all({
      from: "2023-03-01",
      to: "2023-01-31",
    });
    const apr = await razorpay.subscriptions.all({
      from: "2023-04-01",
      to: "2023-04-30",
    });
    const may = await razorpay.subscriptions.all({
      from: "2023-05-01",
      to: "2023-05-31",
      count: count,
    });
    const jun = await razorpay.subscriptions.all({
      from: "2023-06-01",
      to: "2023-06-30",
    });
    const jul = await razorpay.subscriptions.all({
      from: "2023-07-01",
      to: "2023-07-31",
    });
    const aug = await razorpay.subscriptions.all({
      from: "2023-08-01",
      to: "2023-08-31",
      count: count,
    });
    const sep = await razorpay.subscriptions.all({
      from: "2023-09-01",
      to: "2023-09-30",
      count: count,
    });
    const oct = await razorpay.subscriptions.all({
      from: "2023-10-01",
      to: "2023-10-31",
      count: count,
    });
    const nov = await razorpay.subscriptions.all({
      from: "2023-11-01",
      to: "2023-11-30",
      count: count,
    });
    const dec = await razorpay.subscriptions.all({
      from: "2023-12-01",
      to: "2023-12-31",
      count: count,
    });
    const record = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];
    let subscribedCount = [];
    record.forEach((element) => {
      const u = element.count;
      subscribedCount.push(u);
    });

    res.status(200).json({
      success: true,
      message: "Monthly subscribed user",
      subscriptions: subscribedCount,
    });
  } catch (e) {
    return next(new AppError(e.message, 500));
  }
};

export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  monthlySalesRecord,
};
