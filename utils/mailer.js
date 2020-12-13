const nodemailer = require('nodemailer');
require('dotenv').config()

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.USER,
        pass:process.env.PASSWORD
    }
})


const sendEmail = (from, subject, to, html,cb) => {

        transport.sendMail({
            from,
            subject,
            to,
            html
        }, (err,info)=>{
            if(err) cb(err,null)
            else {

                cb(null,info)}
        })
}

module.exports = sendEmail