const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender')


const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true

    },
    otp:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    },
    
})

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email send successfully",mailResponse)
    }catch(err){
          console.log("error while sending mail",err)
    }
}
OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp)
    next();
})

module.exports = mongoose.model("OTP",OTPSchema)