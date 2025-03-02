const Category = require('../models/Category')


exports.createCategory = async (req,res) =>{
    try{
  // fetch data 
  const {name,description} = req.body;

  // validate
   if(!name || !description){ 
    return res.status(400).json({
        success:false,
        message:"Fill all details carefully"
    })
   }

   const categoryDetail = await Category.create({
    name:name,
    description:description
   })
      
   res.status(200).json({
    success:true,
    message:"Category Created Successfully"
   })
    }catch(error){

        console.log(error)
        res.status(500).json({
            success:false,
            message:"Category Creation Failed",
            error:error.message
        })


    }
}


// get all Categories

exports.showAllCategories = async (req,res)=>{
    try{
    
      const allCategories = await Category.find({},{name:true,description:true})

      res.status(200).json({
        success:true,
        message:"All categories returned successfully",
        allCategories
      })




    }catch(error){

        console.log(error)
        res.status(500).json({
            success:false,
            message:"category fetching Failed",
            error:error.message
        })

    }
}


exports.categoryPageDetails = async(req,res)=>{
    try{
            //get categoryId
        const {categoryId} = req.body;

        // get all courses -categoryId
        const selectedCategory = await Category.findById({_id:categoryId})
                                                         .populate("courses")
                                                         .exec()
       
       //validate
       if(!selectedCategory){
        return res.status(404).json({
            success:false,
            message:"selectedCategory not found"
        })
       }  
       
       // get differentCategory

       const differentCategory = await Category.find({
                                                 _id:{$ne:categoryId}
                                                                 })
                                                                 .populate("courses")
                                                                 .exec();

        if(!differentCategory){
        return res.status(404).json({
            success:false,
            message:"differentCategory not found"
        })
       }  
       
       //get top selling courses
       const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })

    }catch(error){

        console.log(error)
        res.status(500).json({
            success:false,
            message:"CategoryPageDetail not Failed",
            error:error.message
        })

    }
}