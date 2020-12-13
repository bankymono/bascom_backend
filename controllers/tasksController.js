const connection = require('../models/db')

    

// this will get the list of tasks
const getTasks = (req,res)=>{
    connection.query("SELECT * from tasks", (err,resp)=>{
        if(err) throw err
        res.send(resp)
    })
}

//this will get a single task 
const getSingleTask = (req,res)=>{
    connection.query(`SELECT * from tasks where id = ${req.params.taskid}`, (err,resp)=>{
        if(err|| res){
            console.log(err)
            res.send(err.sqlMessage)
        }
        res.send(resp[0])
    })
                                                                                            
}


 
//this will create a  new task
const createTask = (req,res)=>{

        connection.query(`insert into tasks (name, description) 
                values('${req.body.name}',
                    '${req.body.description}')`, (errq,resp)=>{
                        if (errq) throw errq
                        if (resp){
                        res.send(" Task successfully created!")
                    }
        })
}


 //this will edit an existing task with set Id
const updateTask = (req,res)=>{
    if(req.body.name){    
        connection.query(`UPDATE tasks SET 
            name='${req.body.name}'
            WHERE id=${req.params.taskid}`, (err,resp)=>{
            if (err) {
                console.log(err)
            }//throw err
        }) 
    }
    if(req.body.description){
        connection.query(`UPDATE tasks SET 
            description='${req.body.description}'
            WHERE id=${req.params.taskid}`, (err,resp)=>{
                if (err) {
                    console.log(err)
                }//throw err
            })
    }
    if(req.body.teamId){
        connection.query(`UPDATE tasks SET 
            otherName='${req.body.teamId}'
            WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) {
                    console.log(err)
                }//throw err
            })
    } 
    res.send(`successfully updated task with id ${req.params.taskid}`)
}


//this will edit an existing task with set Id
const deleteTask = (req,res)=>{

    connection.query(`DELETE FROM tasks WHERE  id=${req.params.taskid}`, (err,resp)=>{
        if (err) return res.send(err);
        res.send(`successfully deleted task with id ${req.params.taskid}`)
    })

}



module.exports = {
    
    getTasks,
    getSingleTask,
    createTask,
    updateTask,
    deleteTask
}
