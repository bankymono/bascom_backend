const nodemailer = require('nodemailer');
require('dotenv').config()

// const transport = nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user:process.env.USER,
//         pass:process.env.PASSWORD
//     }
// })

const transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.USER2,
        pass: process.env.PASSWORD2
    }
});

// var transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASSWORD
//   }
// });
// let transport = nodemailer.createTransport({
//     host: process.env.MAILGUN_SMTP_SERVER,
//     port: process.env.MAILGUN_SMTP_PORT,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.MAILGUN_SMTP_LOGIN, 
//       pass: process.env.MAILGUN_SMTP_PASSWORD, 
//     },
//   });


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