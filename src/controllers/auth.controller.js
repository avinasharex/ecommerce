import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 60 * 60 * 1000),
    httpOnly: true
}

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

export const login = asyncHandler(async(req,res)=>{
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError("All fields are required")
    }

    const user = await User.findOne({email}).select("+password")

    if(!user){
        throw new ApiError("Invalid credentials", 400)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        throw new ApiError("Invalid credentials", 400)
    }

    const token = user.generateJWTtoken()
    user.password = undefined
    res.cookie("token", token, cookieOptions)
    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
        token
    })
})

export const logout = asyncHandler(async(req,res)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})