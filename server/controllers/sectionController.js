const Course = require('../models/Course');
const Section = require('../models/Section');


exports.createSection = async (req,res)=>{
    try{
        // fetch data
        const {sectionName,courseId}= req.body;

        //validate data
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:true,
                message:"Fill all field carefully"
            })
        }
        // save to db
        const newSection = await Section.create({sectionName});

        // save course schema
    const updatedCourse = await Course.findByIdAndUpdate({_id:courseId},
                                                          {$push:{courseContent:newSection._id}},
                                                          {new:true});

    //HW: update both section and sub-section updated course

        // return response
        res.status(200).json({
            success:true,
            message:"Section Create Successfully",
            Data:updatedCourse
        })


    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Section creation failed"
        })
    }
}

exports.updateSection = async(req,res)=>{
    try{

        //fetch data
        const {sectionId,sectionName} = req.body;
        //validate 
        if(!sectionId || !sectionName){
            return res.status(400).json({
                success:false,
                message:"Missing Data"
            })
        }

        // update section
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{sectionName},{new:true})

        // return response
        res.status(200).json({
            success:true,
            message:"section update successfully",
            updatedSection
        })



    }catch(error){

        console.log(error)
        res.status(500).json({
            success:false,
            message:"Section creation failed"
        })
    }

    }

    exports.deleteSection = async(req,res)=>{
        try{
            //fetch data 
            const {sectionId} = req.params;
            // validAte data
            if(!sectionId){
                return res.status(400).json({
                    success:false,
                    message:"Missing Data"
                })
            }
            //TODO[TESTING]: delete entry also from courseSchema 
            await Section.findByIdAndDelete({_id:sectionId})
            res.status(200).json({
                success:true,
                message:"section delete successfully"
            })

        }catch(error){
            console.log(error)
            res.status(500).json({
                success:false,
                message:"Section deletion  failed"
            })

        }
    }
    exports.getSection = async (req, res) => {
        try {
            //* get the course id from req.body
            const courseId = req.body.courseId;
            console.log("Course Id ", courseId)
            //* Check whether that course exisits or not
            const exisitingCourse = await courseModel.findById(courseId, { courseContent: true }).populate('courseContent').exec()
            if (!exisitingCourse) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Course not found!'
                })
            }
            //* Get all the sections from that course
            const sections = exisitingCourse.courseContent
    
            //* Send Success response
            res.status(200).json({
                status: "success",
                results: sections.length,
                sections
            })
        }
        catch (err) {
            res.status(500).json({
                status: 'fail',
                data: "Failed to get all the sections from the course",
                message: err.message
            })
        }
    }