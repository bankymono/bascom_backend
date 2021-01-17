const connection = require('../models/db')
// const notificationController = require('./notificationController')    



const postFeedback = (req,res)=>{
    if(req.body.content == undefined || req.body.subject == undefined){
        res.status(400).send("Please provide feedback details")
    }else{
        
        connection.query(`insert into feedback(subject,content,status,feedbackEmail, feedbackTel)
            values(
                '${req.body.subject}',
                '${req.body.content}',
                'open',
                '${req.body.feedbackEmail}',
                '${req.body.feedbackTel}')`,(err,resp)=>{
                    
                    if(err) return res.status(500).json({success:false,'message':'internal server error'});

                    // var notify = {
                    //         "userId":req.user.data.id,
                    //         "subject": req.body.subject,
                    //         "message": req.body.content
                    //         }
            // notificationController.logNotification(notify,(err,resp) =>{

            // })
                        
            // res.status(200).send('We have received your feedback')
            res.status(200).json({success:true,message:'We have received your feedback'});
        // notificationController.getNotifications((val)=>{
        //     console.log('the val',val)
        // })
    })
}   
}
    

const getFeedbacks  = (req,res)=>{
    connection.query(`SELECT * from feedback`, (err,resp)=>{
        if(err) return res.status(500).json({success:false,'message':'internal server error'});
    
        res.status(200).json({success:true, data:resp}) 
    })
}
    
const getSingleFeedback = (req,res)=>{
    connection.query(`SELECT * from faq where id = ${req.params.feedbackId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false,'message':'internal server error'});
        
        res.status(200).json({success:true, data:resp[0]})
    })
}


module.exports = {
    postFeedback,
    getFeedbacks,
    getSingleFeedback,
}
