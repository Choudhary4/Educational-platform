const mongoose = require('mongoose')
const User = require('../models/User')
const OTP  = require('../models/OTP')
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken')
const Profile = require('../models/Profile')
require('dotenv').config()



//send otp
exports.sendOTP = async(req,res)=>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(404).json({
                success:false,
                message:"Email Not Found"
            })
        }

        const userExist = await User.findOne({email})

        if(userExist){
          return  res.status(400).json({
                success:false,
                message:"user already exist"
            })
        }
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        })
     
        console.log("otp-generated->",otp)
        //{otp:otp}
        const result = await OTP.findOne({otp:otp});

        while(result){
             otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })

            //{otp:otp}
            const result = await OTP.findOne({otp:otp});

        }

        const otpPayload = {email,otp}

        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Stored successfully! ", otpBody);

        res.status(200).json({
            success:true,
            message:"otp generate successfully ",
            otp
        })



    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })

    }
}

//signup
exports.signup = async(req,res)=>{

   try{
     //fetch data 
     const {firstName,lastName,email,password,confirmPassword,accountType,otp,contactNumber} = req.body;
     // validate
     if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
         return res.status(400).json({
             success:false,
             message:"Please all details carefully"
         })
     }
 // 2 password
     if(password !== confirmPassword){
         return res.status(400).json({
             success:false,
             message:"Password and confirmPassword not same"
         })
     }
 // check user exist
 
 const userPresent = await User.findOne({email})
 
 if(userPresent){
     return res.status(400).json({
         success:false,
         message:"user already registered"
     })
 }
 
 const recentOtpArray = await OTP.find({email}).sort({createdAt:-1}).limit(1)
 
 if(recentOtpArray.length == 0){
     return res.status(400).json({
         success:false,
         message:"otp not found"
     })
} 

    console.log("hi",recentOtpArray[0])
 
 if(otp !== recentOtpArray[0].otp){
     return res.status(400).json({
         success:false,
         message:"otp invalid"
     })
 }
 
 console.log(recentOtpArray[0])
 
 const profileDetails = await Profile.create({
     gender:null,
     contactNumber,
     about:null,
     dateOfBirth:null
 })
 
 const hashedPassword = await bcrypt.hash(password,10)
 
 const userPayload = {
     firstName,
     lastName,
     email,
     password:hashedPassword,
     otp,
     contactNumber,
     additionalDetail: profileDetails._id,
     accountType,
     image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
 }

 console.log(userPayload)
 
 const user = await User.create(userPayload)
 
 console.log(user)

 res.status(200).json({
    success:true,
    message:"user registered successfully"
 })

   }catch(error){

    console.log(error)

    res.status(400).json({
        success:false,
        message:"Registration Failed"
    })
   }
}

//login
exports.login = async(req,res)=>{
    try{
//fetch data

const {email,password} = req.body;

if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"please fill all details carefully"
    })
}

const user = await User.findOne({email}).populate("additionalDetail")

if(!user){
    return res.status(400).json({
        success:false,
        message:"First Signup then login"
    })

}

if(await bcrypt.compare(password,user.password)){

    const payload = {
        email:user.email,
        id:user._id,
        accountType:user.accountType
    }

    const token = jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"2h"
    })
    user.token = token
    user.password = undefined

    const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true
    }

    res.cookie("token",token,options).status(200).json({
        success:true,
        token,
        user,
        message:"user logged successfully"
    })
        
    

}else{
    return res.status(401).json({
        success:false,
        message:"incorrect password"
    })
}



    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Login failure,please try again"
        })

    }
}
exports.changePassword = async(req,res)=>{

}

//isAdmin isStudent