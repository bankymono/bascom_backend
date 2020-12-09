const connection = require('../models/db')

    // app.get('/',(req,res)=>{
    //     res.send('Welcome to BASCOM API')
    // })
    
// this will get the list of tasks
const getTasks = (req,res)=>{
    connection.query("SELECT * from tasks", (err,resp)=>{
        // delete resp[0].password
        res.send(resp)
    })
}

//this will get a single task 
const getSingleTask = (req,res)=>{
    connection.query(`SELECT * from tasks where id = ${req.params.id}`, (err,resp)=>{
        delete resp[0].password
        res.send(resp[0])
    })
}
 
//this will create a  new task
const createTask = (req,res)=>{
    // res.send(req.body)
        connection.query(`insert into tasks (name, description) 
                values('${req.body.name}',
                    '${req.body.description}')`, (errq,resp)=>{
                        if (errq) throw errq
                        res.send("successfully created!")
        })
}

 //this will edit an existing task
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

    connection.query(`DELETE FROM tasks WHERE  id=${req.params.id}`, (err,resp)=>{
        if (err) throw err
        res.send(`successfully deleted user with id ${req.params.id}`)
    })
}

module.exports = {
    getTasks,
    getSingleTask,
    createTask,
    updateTask,
    deleteTask
}
