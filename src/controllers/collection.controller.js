import Collection  from "../models/collection.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCollection = asyncHandler(async(req,res)=>{
    const {name} = req.body

    if(!name){
        throw new ApiError("Collection name is required", 401)
    }

    const collection = await Collection.create({
        name
    })

    return res.status(200).json({
        success: true,
        message: "Collection created successfully",
        collection
    })
})