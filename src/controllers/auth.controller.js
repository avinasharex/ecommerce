import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signup = asyncHandler(async(req,res)=>{
    // get data from user
    // validation
    // check if user already exist
    // create user
    const {name, email, password} = req.body

    if(!name || !email || !password){
        throw new ApiError("Required all fields", 400)
    }
    const isUserExist = await User.findOne({email})

    if(isUserExist){
        throw new ApiError("User already exist", 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    // safety
    user.password = undefined

    return res.status(200).json({
        success: true,
        message: "User registered successfully",
        user
    })
})