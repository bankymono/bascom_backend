const connection = require('../models/db')
const notificationController = require('./notificationController')    

const postFeedback = (req,res)=>{
    if(req.body.content = undefined || req.body.subject == undefined){
        res.status(400).send("Please provide feedback details")
    }else{
        connection.query(`insert into feedback(subject,content,status,feedbackEmail, feedbackTel)
            values(
                '${req.body.subject}',
                '${req.body.content}',
                'open',
                '${req.body.feedbackEmail}',
                '${req.body.feedbackTel}')`,(err,resp)=>{
                if(err){
                    res.status(400).send('Internal error!')
                }if(resp){
                    var notify = {
                            "userId":req.user.data.id,
                            "subject": req.body.subject,
                            "message":req.body.content
                            }
            notificationController.logNotification(notify,(res)=>{
                console.log(res)
            })
            res.status(200).send('We have received your feedback')
        }
    })
}   
}
    

const getFeedbacks  = (req,res)=>{

}
    
const getSingleFeedback = (req,res)=>{

}


module.exports = {
    postFeedback,
    getFeedbacks,
    getSingleFeedback,
}
