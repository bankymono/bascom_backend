const connection = require('../models/db')
    

// this will get all the list of tasks
const getAllTasks = (req,res)=>{
    connection.query("SELECT * from tasks order by id desc", (err,resp)=>{
        if(err) return res.status(500).json({message:"Internal server error"})
        
        res.send(resp)
    })
}

const getTasks = (req,res)=>{
    if(req.params.projectId){
        connection.query(`SELECT * from tasks where projectId = ${req.params.projectId} order by id desc`, (err,resp)=>{
            if(err) return res.status(500).json({message:"Internal server error"})
            
            if(resp.length < 1) return res.status(404).json({message:"No task found."})
            
            if( req.user.data.id == resp[0].createdBy ||
                req.user.data.permissions.some(permission => permission == "view_all_tasks")){
                res.status(200).json({data:resp})
            }else{
                res.status(403).json({message:'Unauthorized'});
            }
        })
    }else{
        connection.query(`SELECT * from tasks where createdBy = ${req.user.data.id} order by id desc`, (err,resp)=>{
            if(err) return res.status(500).json({message:"Internal server error"})
            
            if(resp.length < 1) return res.status(404).json({message:"No task found."})
            
            if( req.user.data.id == resp[0].createdBy ||
                req.user.data.permissions.some(permission => permission == "view_all_tasks")){
                res.status(200).json({data:resp})
            }else{
                res.status(403).json({message:'Unauthorized'});
            }
        })
    }
}

//this will get a single task 
const getSingleTask = (req,res)=>{
    if(req.params.projectId){
        connection.query(`SELECT * from tasks where projectId = ${req.params.projectId} and id = ${req.params.taskId}`, (err,resp)=>{
            if(err) return res.status(500).json({message:"Internal server error"})
            
            if(resp.length < 1)return res.status(404).json({message:"task not found"})
            
            if( req.user.data.id == resp[0].createdBy ||
                req.user.data.permissions.some(permission => permission === "view_all_projects")){
                res.status(200).json({data:resp[0]})
            }else{
                res.status(403).json({message:'Unauthorized'});
            }
        })           
    }else{
        connection.query(`SELECT * from tasks where id = ${req.params.taskId}`, (err,resp)=>{
            if(err) return res.status(500).json({message:"Internal server error"})
            
            if(resp.length < 1)return res.status(404).json({message:"task not found"})
            
            if( req.user.data.id == resp[0].createdBy ||
                req.user.data.permissions.some(permission => permission === "view_all_projects")){
                res.status(200).json({data:resp[0]})
            }else{
                res.status(403).json({message:'Unauthorized'});
            }
        })
    }
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
                        
                        res.status(200).json({success:true,message:"successfully created!"})
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
                      
                        res.status(200).json({success:true,message:"successfully created!"})
        })
    }
}


 //this will edit an existing task with set Id
const editTask = (req,res)=>{
    const d = new Date().toISOString()

    connection.query(`SELECT createdBy from tasks where id = ${req.params.tasktId}`, (err,resp)=>{
        // if error 
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Not found!'});

        if(req.user.data.id == resp[0].createdBy){
            connection.query(`UPDATE tasks SET 
                name='${req.body.name}',
                description ='${req.body.description}',
                startDate = ${req.body.startDate || null},
                endDate = ${req.body.endDate || null},
                statusId = ${req.body.statusId ||null},
                lastModified = '${d}',
                modifiedBy = ${req.user.data.id}
                WHERE id=${req.params.taskId}`, (err,resp)=>{
                    if(err) return res.status(500).json({message:'internal server error'});
                    
                    res.status(200).json({success:true,message:"successfully updated!"})
            })
        }else if(req.user.data.permissions.some(permission => permission == "manage_tasks")){
            connection.query(`UPDATE projects SET 
            name='${req.body.name}',
            description ='${req.body.description}',
            teamId = ${req.body.teamId || null},
            startDate = ${req.body.startDate || null},
            endDate = ${req.body.endDate || null},
            statusId = ${req.body.statusId ||null},
            lastModified = '${d}',
            modifiedBy = ${req.user.data.id}
            WHERE id=${req.params.taskId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal server error'});
                
                res.status(200).json({success:true,message:"successfully updated!"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"})
        }
    })
}

//this will edit an existing task with set Id
const deleteTask = (req,res)=>{
    
    connection.query(`SELECT createdBy from tasks where id = ${req.params.taskId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Task Not found!'});
    
        if(req.user.data.id == resp[0].createdBy){
            connection.query(`DELETE FROM tasks WHERE  id=${req.params.taskId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal server error'});

                res.status(200).json({success:true,message:"successfully deleted"});
            })     
        }else if(req.user.data.permissions.some(permission => permission == "manage_tasks")){
            connection.query(`DELETE FROM tasks WHERE  id=${req.params.taskId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal server error'});

                res.status(200).json({success:true,message:"successfully deleted"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"});
        }
    })
}

const assignTask = (req,res)=>{
    connection.query(`select * FROM tasks WHERE  id=${req.params.taskId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'task not found'})

            connection.query(`SELECT teams.name, team_members.userId, projects.name FROM team_members 
            INNER JOIN teams
            ON team_members.teamId = teams.id
            INNER JOIN projects 
            ON teams.id = projects.teamId where team_members.userId = ${req.body.assigneeId};
            `, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal error'});
        
                if(resp.length < 1) return res.status(404).json({message:"not a member of project"})
                
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
                
            })
    })
}

module.exports = {
    getAllTasks,
    getTasks,
    getSingleTask,
    createTask,
    editTask,
    deleteTask,
    assignTask
}
