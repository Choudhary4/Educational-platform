const Razorpay = require('razorpay');
const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');

exports.capturePayment = async(req,res)=>{
  
        const {course_Id} = req.body;
        const userId = req.user.id;

        // validate courseId 
        if(!course_Id){
            return res.status(400).json({
                success:false,
                message:"courseId not Found"
            })
        }

        //validate course Detail
        let course;
        try{
            course = await Course.findById(course_Id)
            if(!course){
                return res.status(400).json({
                    success:false,
                    message:"course detail not found"
                })
            }
             // user already purchase this course
             const uid = new mongoose.Types.ObjectId(userId);

             if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    message:"User already have this course"
                })
             }

        }catch(error){
            console.error(error)
            res.status(500).json({
                success:false,
                message:"Internal sever failure"
            })
          
        }

        // create a order
        const amount = course.price;
        const currency = "INR"

        const options = {
            amount: amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId: course_Id,
                userId
            }
        }

        try{
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);
            // return response 
            res.status(200).json({
                success:true,
                message:"Order create successfully",
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail:course.thumbnail,
                orderId: paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount
            })

        }catch(error){
            console.error(error)
            res.status(500).json({
                success:false,
                message:"Internal sever failure"
            })
          
        }


}

exports.verifySignature = async(req,res)=>{
    const webhookSecret = "12345678"
    const signature = req.headers[x-razorpar-signature];

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment Authorized")
        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try{

            const enrolledCourse = await Course.findByIdAndUpdate({id:courseId},
                                                                            {$push:{studentsEnrolled:userId}},
                                                                                                            {new:true})


            if(!enrolledCourse){
                return res.status(404).json({
                    success:false,
                    message:"course not found"
                })
            }
            console.log(enrolledCourse)
            
            const enrolledStudent = await User.findByIdAndUpdate({id:userId},
                                                                              {$push:{courses:courseId},
                                                                            })
            console.log(enrolledStudent)  
            
            const emailResponse = mailSender(enrolledStudent.email,
                                                                    "Congratulation From CodeHelp",
                                                                    "Congratulation you are, onboarded into new CodeHelp Course "
            )
            console.log(emailResponse)
            res.status(200).json({
                success:true,
                message:"Signature verified and Course added"
            })

        }catch(error){
            console.error(error)
            res.status(500).json({
                success:false,
                message:"Internal sever failure"
            })
          
        }
    }
    else{
        res.status(400).json({
            success:false,
            message:"invalid req"
        })
    }
}

