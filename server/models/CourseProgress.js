const mongoose = require('mongoose')
const { stringify } = require('querystring')

const courseProgressSchema = new mongoose.Schema({
courseID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
},
completeVideos:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubSection"
}
]
})

module.exports = mongoose.model("CourseProgress",courseProgressSchema)