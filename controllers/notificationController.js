var connection = require('../models/db')

const logNotification = (notification,cb)=>{
        if(notification.message = undefined || notification.subject == undefined){
            return new Error('Err message')
        }else{
            connection.query(`insert into notification(userId,subject,message,isRead)
                    values('${notification.userId}','${notification.subject}','${notification.message}','false')`,(err,resp)=>{
                    if(err){
                        return new Error(err)
                    }else{
                        cb('success')
                    }
            })
        }
}


module.exports = {
    logNotification
}