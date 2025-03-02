const mongoose = require('mongoose')
const { stringify } = require('querystring')

const subSectionSchema = new mongoose.Schema({
    title:{
        type:String

    },
    timeDuration:{
        type:String
    },
    description:{
        type:String,
        trim:true
    },
    videoUrl:{
        type:Number,
        trim:true
    }
})

module.exports = mongoose.model("SubSection",subSectionSchema)