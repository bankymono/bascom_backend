const connection = require('../models/db')

    
<<<<<<< HEAD

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
=======
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
>>>>>>> 79dbb74f0614cb49a4f18f066c2f92c0f11c70fd
    })
                                                                                            
}

app.get("/subscriber_group/:id", (req, res) => {
    connection.query(
      `select * from subscriber_group where id = ${req.params.taskid}`,
      (err, resp) => {
        if (err || resp.length < 1)
          return res.status(404).send("Record does not exist.");
      res.send(resp[0]);
      }
    );
  });

 
//this will create a  new task
const createTask = (req,res)=>{
<<<<<<< HEAD

        connection.query(`insert into tasks (name, description) 
                values('${req.body.name}',
                    '${req.body.description}')`, (errq,resp)=>{
                        if (errq) throw errq
                        if (resp){
                        res.send(" Task successfully created!")
                    }
        })
=======
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
>>>>>>> 79dbb74f0614cb49a4f18f066c2f92c0f11c70fd
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
<<<<<<< HEAD

    connection.query(`DELETE FROM tasks WHERE  id=${req.params.taskid}`, (err,resp)=>{
        if (err) return res.send(err);
        res.send(`successfully deleted task with id ${req.params.taskid}`)
=======
//  handling delete
    connection.query(`DELETE FROM tasks WHERE  id=${req.params.taskId}`, (err,resp)=>{
        if (err) throw err
        res.send(`successfully deleted user with id ${req.params.id}`)
>>>>>>> 79dbb74f0614cb49a4f18f066c2f92c0f11c70fd
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
