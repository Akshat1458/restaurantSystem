import {User} from "../models/users.js";
import { sendSMS,generateOTP } from "../utils/otp.js";
import { sendToken } from "../utils/sendToken.js";

export const register = async (req,res)=>{

    try{
        const{ownerName,phoneNumber,restaurantName,address}=req.body;
        let user= await User.findOne({phoneNumber});
        if(user){
            return res
                .status(400)
                .json({success: false, message: "User already exists."});
        }

        user=await User.create({
            ownerName,
            phoneNumber,
            restaurantName,
            address,
        });
        res
            .status(200)
            .json({success: true, message: "Registered"});
    }catch(error){
        console.log("error");
        res
            .status(500)
            .json({success: false, message: error.message});

    }
};

export const login= async(req,res,next)=>{
    try {

        const { phoneNumber } = req.body;
        const user = await User.findOne({ phoneNumber });
    
        if (!user) {
          next({ status: 400, message: PHONE_NOT_FOUND_ERR });
          return;
        }
    
        // res.status(201).json({
        //   type: "success",
        //   message: "OTP sended to your registered phone number",
        //   data: {
        //     userId: user._id,
        //   },
        // });
    
        const otp = generateOTP(6);
        user.phoneOtp = otp;
        user.isAccountVerified = true;
        await user.save();
        await sendSMS(
          {
            message: `Your OTP is ${otp}`,
            contactNumber: user.phoneNumber,
          },
          next
        );
        sendToken(
            res,
            user,
            201,
            "OTP sent to your phone, please verify"
          );
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
};

export const verify=async(req,res)=>{
    try {
        const { otp} = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
          next({ status: 400, message: USER_NOT_FOUND_ERR });
          return;
        }
    
        if (user.phoneOtp !== otp) {
          next({ status: 400, message: INCORRECT_OTP_ERR });
          return;
        }
    
        user.phoneOtp = "";
        await user.save();
    
        sendToken(res, user, 200, "Account Verified");
      } catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
      }

};