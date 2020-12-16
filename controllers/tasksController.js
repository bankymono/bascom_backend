const connection = require('../models/db')
    

// this will get the list of tasks
const getAllTasks = (req,res)=>{
    connection.query("SELECT * from tasks order by id desc", (err,resp)=>{
        if(err) return res.status(500).json({message:"Internal server error"})
        
        res.send(resp)
    })
}

const getTasks = (req,res)=>{
    connection.query(`SELECT * from tasks where projectId = ${req.params.projectId} order by id desc`, (err,resp)=>{
        if(err) return res.status(500).json({message:"Internal server error"})
        
        if(resp.length < 1){
            res.status(404).json({message:"task not found"})
        }else if( req.user.data.id == resp[0].createdBy ||
            req.user.data.permissions.some(permission => permission === "view_all_projects")){
            res.send(resp)
        }else{
            res.status(433).json({message:"Access denied"})
        }
    })
}

//this will get a single task 
const getSingleTask = (req,res)=>{
    connection.query(`SELECT * from tasks where projectId = ${req.params.projectId} and id = ${req.params.taskid} `, (err,resp)=>{
        if(err) return res.status(500).json({message:"Internal server error"})
        
        if(resp.length < 1){
            res.status(404).json({message:"task not found"})
        }else if( req.user.data.id == resp[0].createdBy ||
            req.user.data.permissions.some(permission => permission === "view_all_projects")){
            res.send(resp[0])
        }else{
            res.status(433).json({message:"Access denied"})
        }
    })
                                                                                            
}

 
//this will create a  new task
const createTask = (req,res)=>{
    if(req.params.projectId){
        connection.query(`insert into tasks (name, description,createdBy,projectId,startDate,endDate,statusId) 
                values('${req.body.name}',
                    '${req.body.description || null}',
                    '${req.user.data.id}',
                    '${req.params.projectId}',
                    '${req.body.startDate || null}',
                    '${req.body.endDate || null}',
                    '${req.body.statusId || null}')`, (errq,resp)=>{
                        if (errq) return res.status(500).json({message:"Internal server error"})
                        if (resp){
                            res.send(" Task successfully created!")
                        }
        })
    }else{
        connection.query(`insert into tasks (name, description,createdBy,startDate,endDate,statusId) 
                values('${req.body.name}',
                    '${req.body.description || null}',
                    '${req.user.data.id}',
                    '${req.body.startDate || null}',
                    '${req.body.endDate || null}',
                     ${req.body.statusId || null})`, (errq,resp)=>{
                        if (errq) return res.status(500).json({message:"Internal server error"})
                        if (resp){
                            res.send(" Task successfully created!")
                        }
        })
    }
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

const assignTask = (req,res)=>{
    connection.query(`select * FROM tasks WHERE  id=${req.params.taskid}`, (err,resp)=>{
        if (err) return res.send(err);
        if(resp.length < 1){
            return res.status(404).json({message:'task not found'})
        }else{
            connection.query(`SELECT teams.name, team_members.userId, projects.name FROM team_members 
            INNER JOIN teams
            ON team_members.teamId = teams.id
            INNER JOIN projects 
            ON teams.id = projects.teamId where team_members.userId = ${req.body.assigneeId};
            `, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal error'})
                if(resp.length < 1){
                    res.status(404).json({message:"not a member of project"})
                } else {
                    if(req.user.data.id == resp[0].createdBy){
                        connection.query(`insert into assigned_tasks (taskId,assigneeId, assignerId) 
                        values(${req.params.taskid},
                            ${req.body.assigneeId},
                            ${req.user.data.id})`,(err2,resp2)=>{
                                if(err2) return res.status(500).json({message:'internal error'})

                                res.status(200).json({'message':"successfully assigned"})
                        })
                    }else{
                        res.status(422).json({'message': 'unauthorized'})
                    }
                }
            })
        }       
    })
}

module.exports = {
    getAllTasks,
    getTasks,
    getSingleTask,
    createTask,
    updateTask,
    deleteTask,
    assignTask
}
