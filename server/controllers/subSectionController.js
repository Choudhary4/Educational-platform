const subSection = require('../models/SubSection')
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');


exports.createSubSection = async(req,res)=>{
    try{
        //fetch all data 
        const {title,description,timeDuration,sectionId} = req.body
        // fetch file 
        const video = req.files.videoFile;
        // validate data
        if(!title || !description || !timeDuration || !video || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Data Missing"
            })
        }
        //upload video on cloudinary
        const videoUpload = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        const subSectionDetail = await subSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            videoUrl:videoUpload.secure_url
        })

        // update section by subSection objectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection:subSectionDetail._id}},{new:true})

        // return res
        res.status(200).json({
            success:true,
            message:"subSection create successfully",
            updatedSection
        })
        //HW: update section here, after populated query
        


    }catch(error){

        console.log(error)
        res.status(500).json({
            success:false,
            message:"subSection creation failed"
        })
    }
}

exports.deleteSubSection = async(req,res)=>{
    try{
        //fetch data 
        const {subSectionId} = req.body;

        // validate data 
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"filled all detail carefully"
            })
        }
        await subSection.findByIdAndDelete({_id:subSectionId});
        //HW: Delete from section schema also
        //response
        res.status(200).json({
            success:true,
            message:"subSection delete successfully"
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Section deletion failed"
        })
    }
}

exports.updateSubSection = async(req,res)=>{
    try{
        //fetch data 
        const {subSectionId,timeDuration,description,title,videoUrl} = req.body;

        // validate data 
        if(!timeDuration || !description || !title || !videoUrl || !subSectionId){
            return res.status(400).json({
                success:false,
                message:"filled all detail carefully"
            })
        }
      // update details 
      const updatedSubSection = await subSection.findByIdAndUpdate({_id:subSectionId},{timeDuration,description,title,videoUrl})

      res.status(200).json({
        success:true,
        message:"subSection update  successfully",
        updatedSubSection
    })


    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Section deletion failed"
        })
    }
}

exports.getSubSection = async (req, res) => {
    try {
        //* Get the sectionId
        const sectionId = req.body.sectionId;

        //* validate the sectionId
        if (!sectionId) {
            return res.status(400).json({
                status: 'fail',
                message: 'SectionId is missing'
            })
        }

        //* Check whether the sectionId exists or not?
        const exisitingSection = await sectionModel.findById(sectionId, { subSection: true }).populate('subSection').exec();
        if (!exisitingSection) {
            return res.status(404).json({
                status: 'fail',
                message: 'Section not found!'
            })
        }

        //* Get all the subsections from that particular section
        const data = exisitingSection.subSection;

        //* Send response
        res.status(200).json({
            status: 'success',
            results: data.length,
            data
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to get all subsections inside a section',
            message: err.message,
        })
    }
}