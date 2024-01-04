const asyncHandler = (fn) => async(req,res,next) => {
    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 5000).json({
            success: false,
            message: error.message
        })
    }
}

export default asyncHandler

// const asyncHandler = "avinasharex"
// const asyncHandler = () => {}
// const asyncHandler = (func) => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async() => {}