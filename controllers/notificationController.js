var connection = require('../models/db')

const logNotification = (notification)=>{
        if(notification.message == undefined || notification.subject == undefined){
            return new Error('please provide required details for notification')
        }else{
            connection.query(`insert into notification (userId,subject,message,isRead)
                    values('${notification.userId}','${notification.subject}','${notification.message}','true')`,(err,resp)=>{
                    if(err){
                        return new Error(err)
                    }
                    // console.log('the end',notify)// }else{
                    //     cb('success')
                    // }
            })
        }
}

const getNotifications = (callback)=>{
        connection.query(`select * from notification`,(err,resp)=>{
                if(err){
                    return new Error(err)
                }
                // console.log(resp)
                return callback(resp)
        })
    }



module.exports = {
    logNotification,
    getNotifications
}