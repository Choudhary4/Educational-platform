const express = require('express')
const app = express();

const userRoutes = require('./routes/userRoute');
const profileRoutes = require('./routes/profileRoute')
const paymentRoutes = require('./routes/paymentRoute')
const courseRoutes = require('./routes/courseRoute')



const cookieParser = require('cookie-parser')

const cors = require('cors');


const fileUpload = require('express-fileupload')

const connect = require('./config/database')

const {cloudinaryConnect} = require('./config/cloudinary')
require('dotenv').config();



// database connection

connect();
//middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp"
    })
)

// cloudinary
cloudinaryConnect();

//mount routes

app.use('/api/v1/auth',userRoutes)
app.use('/api/v1/profile',profileRoutes)
app.use('/api/v1/payment',paymentRoutes)
app.use('/api/v1/course',courseRoutes)

//home route
app.get('/',(req,res)=>{

    return res.json({
        success:true,
        message:"jai shree ram"
    })

})

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server started at port ${PORT}`)
})

