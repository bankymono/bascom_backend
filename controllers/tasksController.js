const connection = require('../models/db')

    // app.get('/',(req,res)=>{
    //     res.send('Welcome to BASCOM API')
    // })
    
// tasks api
const getUserTasks = (req,res)=>{
    connection.query(`SELECT * from tasks where createdBy=${req.user.data.id}`, (err,resp)=>{
        // delete resp[0].password
        res.send(resp)
    })
}
    
const getSingleTask = (req,res)=>{
    connection.query(`SELECT * from tasks where id = ${req.params.taskId}`, (err,resp)=>{
        delete resp[0].password
        if(resp[0].createdBy == req.user.data.id){
            res.send(resp[0])
        }else if(req.user.data.permissions.some(permission => permission === "view_all_tasks")){
            res.send(resp[0])
        }else{
            res.status(403).send('unauthorized!')
        }
    })
}
    
const createTask = (req,res)=>{
    // res.send(req.body)
    connection.query(`insert into tasks (name, description, createdBy, startDate, endDate, projectId, statusId) 
             values('${req.body.name}',
                    '${req.body.description}',
                    '${req.user.data.id}',
                    '${req.body.startDate}',
                    '${req.body.endDate}',
                    '${req.params.projectId}',
                    '${req.body.statusId}')`, (errq,resp)=>{
                         if (errq) throw errq
                         res.send("successfully created!")
             })
}

    
const updateTask = (req,res)=>{
    if(req.body.name){    
        connection.query(`UPDATE tasks SET 
            name='${req.body.name}'
            WHERE id=${req.params.id}`, (err,resp)=>{
            if (err) throw err
        })
    }
    if(req.body.description){
        connection.query(`UPDATE tasks SET 
            description='${req.body.description}'
            WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) throw err
            })
    }
    if(req.body.teamId){
        connection.query(`UPDATE tasks SET 
            otherName='${req.body.teamId}'
            WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) throw err
            })
    } 
    res.send("successfully updated")
}
    
const deleteTask = (req,res)=>{
//  handling delete
    connection.query(`DELETE FROM tasks WHERE  id=${req.params.taskId}`, (err,resp)=>{
        if (err) throw err
        res.send(`successfully deleted user with id ${req.params.id}`)
    })
}

module.exports = {
    // getTasks,
    getUserTasks,
    getSingleTask,
    createTask,
    updateTask,
    deleteTask
}
