const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

exports.auth = async(req,res,next)=>{
    try{
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")

        if(!token){
            return res.status(400).json({
                success:false,
                message:"token missing"
            })
        }

        // verifying token
        try{
         const decode = await jwt.verify(token,process.env.JWT_SECRET)
         console.log("decode",decode)

         req.user = decode
        }catch(error){
         return res.status(401).json({
            success:false,
            message:"token verification failed"
         })
        }
         next();                            

    }catch(error){
          console.log(error)
          res.status(500).json({
            success:false,
            message:"Something went wrong while token verification"
          })
    }
}

exports.isStudent = async(req,res,next)=>{
    try{

     if(req.user.accountType !== "Student"){
        return res.status(400).json({
            success:false,
            message:"This Route Is Protected for student"
        })
     }
     next();

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Role can not be verified"
        })
    }
}


exports.isInstructor = async(req,res,next)=>{
    try{

     if(req.user.accountType !== "Instructor"){
        return res.status(400).json({
            success:false,
            message:"This Route Is Protected for Instructor"
        })
     }
     next();

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Role can not be verified"
        })
    }
}



exports.isAdmin = async(req,res,next)=>{
    try{

     if(req.user.accountType !== "Admin"){
        return res.status(400).json({
            success:false,
            message:"This Route Is Protected for Admin"
        })
     }
     next();

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User Role can not be verified"
        })
    }
}

