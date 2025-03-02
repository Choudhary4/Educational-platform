const mongoose = require('mongoose')
require('dotenv').config();

const connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("database connect successfully")
    })
    .catch((err)=>{
        console.log("database connection failed")
        process.exit(1);
    })
}

module.exports = connect;