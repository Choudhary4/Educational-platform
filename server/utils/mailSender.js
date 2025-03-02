const nodemailer = require('nodemailer')

const mailSender = async (email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.Mail_PASS
            }
        })
        let info = await transporter.sendMail({
            from:`Study Notion By Saurabh`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log("information",info)
        return info;
    }catch(err){
     console.log(err.message)
    }

}

module.exports = mailSender;