

import { ApiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "no user found")
        }

        if (!user.isAdmin) {
            return next(new ApiError(201, "user is not a admin"))
        }
        next()



    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        next(new ApiError('Internal server error', 500));
    }
}

export { isAdmin }