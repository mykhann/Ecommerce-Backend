import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,

    },
    avatar: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    isAdmin: { type: Boolean, default: false },




}, { timestamps: true });

// Hashing password before saving it to database using PRE

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// checking if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// Generating RefreshToken 
userSchema.methods.GenerateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id,



    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
    
}


// Generating accessToken
userSchema.methods.GenerateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        username:this.username

    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        
    })

}


export const User = mongoose.model("User", userSchema)