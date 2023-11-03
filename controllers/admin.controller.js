
import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const getUserData = async (req, res, next) => {
    try {
        const allUser = await User.countDocuments()
        const subscribedUser = await User.countDocuments({'subscription.status': ['active','created']})
        
        res.status(200).json({
        success: true,
        allUserCount: allUser,
        subscribedUserCount: subscribedUser

      });
    } catch (e) {
      return next(new AppError(e.message, 500));
    }
  };

  export {
    getUserData
  }