const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')

const {uploadImageToCloudinary} = require('../utils/imageUploader')

exports.createCourse = async(req,res)=>{
    try{

        const {courseName,courseDescription,price,whatYouWillLearn,tag} = req.body;

        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName||!courseDescription||!price||!whatYouWillLearn||!tag){
            return res.status(400).json({
                success:false,
                message:"please fill all details carefully"
            })
        }

        // check instructor
        const userId = req.user.id;

        const instructorDetails = await User.findById(userId)

        console.log("instructorDetails",instructorDetails)

        if(!instructorDetails){
            return res.status(400).json({
                success:true,
                message:"instructor details not found"
            })
        }

        const tagDetails = await Tag.findById(tag)

        if(!tagDetails){
            return res.status(400).json({
                success:true,
                message:"tag details not found"
            })
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)


        const newCourse = await Course.create({
            courseName,
            courseDescription,
            price,
            whatYouWillLearn,
            instructor:instructorDetails._id,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        await User.findByIdAndUpdate({_id:instructorDetails._id},
          {
            $push:{courses:newCourse._id}
          },
          {new:true}
        )
       return res.status(200).json({
        success:true,
        message:"Course create successfully"
       })
        

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"course creation failed",
            error:error.message
        })
    }
}


// get all the courses 

exports.getAllCourses = async(req,res)=>{
    try{
        //fetch all the courses

        const allCourse = await Course.find({},{
            courseName:true,
            courseDescription:true,
            price:true,
            thumbnail:true,
            ratingAndReviews:true,
            studentsEnrolled:true
        }).populate("instructor").exec();

        res.status(200).json({
            success:true,
            message:"Data fetched for allCourses successfully",
            Data:allCourse
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"course creation failed",
            error:error.message
        })
    }
}

exports.getCourseDetails = async(req,res)=>{
    try{
        // get courseId
        const {courseId} = req.body;
        // get all detail of course
        const courseDetail = await Course.findById({_id:courseId})
                                .populate({
                                    path:"instructor",
                                    populate:{
                                        path:"additionalDetail"
                                    }
                                })
                                .populate({
                                    path:"courseContent",
                                    populate:{
                                        path:"subSection"
                                    }
                                })
                                .populate("category")
                                .populate("ratingAndReviews")
                                .exec();

    // validation 
    if(!courseDetail){
        return res.status(404).json({
            success:false,
            message:"Course Detail Not Found"
        })
    }

    // return response 

    return res.status(200).json({
        success:true,
        message:"Course Detail Fetched Successfully",
        data:courseDetail
    })


    }catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
          
        })

    }
}