const User = require('../models/User')
const mailSender = require('../utils/mailSender')
const bcrypt = require('bcrypt')

exports.resetPasswordToken = async (req,res)=>{
    try{
         //fetch data 
         const email = req.body.email;
         // check user existence
         const user = await User.findOne({email:email})
         // validate user
         if(!user){
            return res.status(400).json({
                success:false,
                message:"this email id not register with us"
            })
         }
         // generate token
         const token = crypto.randomUUID()
         
         // update token in db

         const userDetail = await User.findOneAndUpdate({email:email},
                                                                      {token,
                                                                        resetPasswordExpire: Date.now() + 5*60*1000
                                                                      },
                                                                      {new:true}
         )
         //create url
         const url = `http://localhost:3000/update-password/${token}`

         // email send 

         await mailSender(email,"Reset Password Link",
            `Password reset link ${url}`
         )

         res.status(200).json({
            success:true,
            message:"Email sent successfully"
         })

    }catch(error){
   console.log(error)
        return res.status(500).json({
            success:false,
            message:"something went wrong"
        })
    }
}


exports.resetPassword = async(req,res)=>{
    try{

        //fetch data
        const {password,confirmPassword,token} = req.body;
        //validate
        if(!password || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"please fill all details carefully"
            })
        }
        // 2 password check
        if(password !== confirmPassword){
            return res.status(401).json({
                success:false,
                message:"confirmPassword not matching"
            })
        }
      // find user using token

        const user = await User.findOne({token:token})

        // user existence
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user not relate with this token"
            })

        }
//time check of token

       if(user.resetPasswordExpire < Date.now()){
        return res.status(401).json({
            success:false,
            message:"token is expired"
        })
       }
        // hash password
        const hashedPassword = bcrypt.hash(password,10)

        // update user
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )
       
        res.status(200).json({
            
                success:true,
                message:"Password change successfully"
            
        })

    }catch(error){
         console.log(error)
        return res.status(500).json({
            success:false,
            message:"Password reset failed"
        })
    }
}