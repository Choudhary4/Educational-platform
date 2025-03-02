const mongoose = require('mongoose')
const { stringify } = require('querystring')

const sectionSchema = new mongoose.Schema({
    sectionName:{
        type:String

    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection"
    }],
  
})

module.exports = mongoose.model("Section",sectionSchema)