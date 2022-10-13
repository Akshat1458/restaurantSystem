import mongoose from "mongoose";
import  jwt from "jsonwebtoken";

// Name of the owner 
// phone number
// Name of Restaurant
// Address of the restaurant
const userSchema = new mongoose.Schema({

    ownerName:{
        type: String, 
        required: true
    }, 
    phoneNumber:{
        type: String,
        required: true,
        unique: true
    },
    restaurantName:{
        type: String,
        required: true,
    },
    address:{
        type: String,
        required:true
    },
    menu:{
        type: [String]
    },
    phoneOtp:String
});

userSchema.methods.getJWTToken= function (){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_COOKIE_EXPIRE,
    });
};

export const User = mongoose.model("User", userSchema);
