const mongoose = require('mongoose')
const { stringify } = require('querystring')

const categorySchema = new mongoose.Schema({
    name:{
        type:String

    },
    description:{
        type:String
    },
    course:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
        required:true
    }]
})

module.exports = mongoose.model("Category",categorySchema)