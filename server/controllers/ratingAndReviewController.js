const RatingAndReview = require('../models/RatingAndReview')
const Course = require('../models/Course');
const { default: mongoose } = require('mongoose');

exports.createRating = async(req,res)=>{
    try{
        //get userId
        const userId = req.user.id;
        // fetch all data from req body
        const {rating,review,courseId} = req.body;
        // validate all things
        if(!rating || !review || !courseId){
            return res.status(404).json({
                success:false,
                message:"Fill All the blank spaces"
            })
        }

        // check user is enrolled or not
        const courseDetail = await Course.findOne(
                                                      {_id:courseId,
                                                        studentsEnrolled:{$elementMatch:{$eq:userId}}
        });

        if(!courseDetail){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in this course"
            })
        }
        //check user already review or not
        const alreadyReview = await RatingAndReview.findOne(
                                                             {user:userId,
                                                             course:courseId}
        );

        // validate
        if(alreadyReview){
            return res.status(403).json({
                success:false,
                message:"user already reviewed"
            })
        }

        // create rating and review

        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId
        })

        // update the course schema
        const updatedCourse = await Course.findByIdAndUpdate({_id:courseId},{$push:{ratingAndReviews:rating}},{new:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"ratingAndReview create successfully",
            ratingReview
        })


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
          
        })

    }
}

exports.getAverageRating = async(req,res)=>{
    try{
        // get courseId
        const courseId = req.body.courseId;

        //calc avg rating 
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg:"rating"},
                }
            }
        ])

        // return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            })
        }
        // return rating if no rating exist
        return res.status(200).json({
            success:true,
            message:"Average rating is zero, no rating given till now",
            averageRating:0
        })

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
          
        })

    }
}

exports.getAllRating = async(req,res)=>{
    try{
     const allReviews = await RatingAndReview.find({})
                                 .sort({rating:"desc"})
                                 .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                 })
                                 .populate({
                                    path:"course",
                                    select:"courseName"
                                 })
                                 .exec();

     // validate
    
     if(!allReviews){
        return res.status(404).json({
            success:false,
            message:""
        })
     }  
     // return response
     return res.status(200).json({
        success:true,
        message:"All review fetched successfully",
        data:allReviews
     })
    }catch(error){

        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
          
        })

    }
}