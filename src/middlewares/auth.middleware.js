import User from "../models/user.mode.js";
import JWT from "jsonwebtoken"
import config from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const isLoggedIn = asyncHandler(async(req,res,next)=>{
    const {token} = req.cookies.token || req.headers.authorization && req.headers.authorization.startsWith("Bearer") && req.headers.authorization.split(" ")[1]

    if(!token){
        throw new ApiError("Unauthorized user", 400)
    }

    try {
        const decoded = JWT.verify(token, config.JWT_SECRET)

        req.user = await User.findById(decoded._id, "name email role")
        next()
    } catch (error) {
        throw new ApiError(error.message, 400)
    }
})