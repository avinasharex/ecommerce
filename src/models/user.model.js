import mongoose from "mongoose"
import AuthRoles from "../utils/AuthRole.js"
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import config from "../config/index.js"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            maxLength: [50, "Name must be less than 50 chars"]
        },
        email: {
            type: String,
            required: [true, "Email is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [8, "Password must be at least 8 chars"],
            select: false, //This will never bring password by default
        },
        role: {
            type: String,
            required: [true, "Enum is required"],
            enum: Object.values(AuthRoles),//enum means you can only from given option
            default: AuthRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
    },{timestamps: true})

    // Encrypt the password before saving: HOOKS
    userSchema.pre("save", async function(next){
        if(!this.isModified("password")) return next()
        
        this.password = await bcrypt.hash(this.password, 10)
        next()
    })

    userSchema.methods = {
        // compare password
        comparePassword: async function(enteredPassword){
          return  await bcrypt.compare(enteredPassword, this.password)
        },
        // we can define as many as methods
        generateJWTtoken: function(){
            JWT.sign({_id: this._id, role: this.role},config.JWT_SECRET, {
                expiresIn: config.JWT_EXPIRY
            })
        },
        generateForgotPasswordtoken: function(){
          const forgotToken =  crypto.randomBytes(20).toString("hex")

        //   just to encrypt the token generated by crypto
          this.forgotPasswordToken = crypto 
          .createHash("sha256")
          .update(forgotToken)
          .digest("hex")

        //   time for token to expire
        this.forgotPasswordExpiry = Date.now() +  20 * 60 * 1000

        // It return token to frontend
        return forgotToken
        }
    }

export default mongoose.model("User", userSchema)