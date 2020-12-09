const connection = require('../models/db')

    // app.get('/',(req,res)=>{
    //     res.send('Welcome to BASCOM API')
    // })
    
// projects api
const getUserProjects = (req,res)=>{
    connection.query("SELECT * from projects", (err,resp)=>{
        if(err) throw err;
        res.send(resp)
    })
}
    
const getSingleProject = (req,res)=>{
    connection.query(`SELECT * from projects where id = ${req.params.id}`, (err,resp)=>{
        res.send(resp[0])
    })
}
    
const createProject = (req,res)=>{
    connection.query(`insert into projects (name, description, teamId, createdBy, startDate, endDate, statusId) 
        values('${req.body.name}',
               '${req.body.description}',
               '${req.body.teamId}',
               '${req.user.data.id}',
               '${req.body.startDate}',
               '${req.body.endDate}',
               '${req.body.statusId}')`, (errq,resp)=>{
                    if (errq) throw errq
                    res.send("successfully created!")
        })
}

    
const updateProject = (req,res)=>{
    if(req.body.name){    
        connection.query(`UPDATE projects SET 
            name='${req.body.name}'
            WHERE id=${req.params.projectId}`, (err,resp)=>{
            if (err) throw err
        })
    }
    if(req.body.description){
        connection.query(`UPDATE projects SET 
            description='${req.body.description}'
            WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) throw err
            })
    }
    if(req.body.teamId){
        connection.query(`UPDATE projects SET 
            teamId='${req.body.teamId}'
            WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) throw err
            })
    } 
    res.send("successfully updated")
}

    
const deleteProject = (req,res)=>{
//  handling delete
    connection.query(`DELETE FROM projects WHERE  id=${req.params.projectId}`, (err,resp)=>{
        if (err) throw err
        res.send(`successfully deleted user with id ${req.params.projectId}`)
    })
}

const createProjectTask = (req,res)=>{
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

const getProjectTasks = (req,res)=>{
    connection.query(`SELECT * from tasks where projectId = ${req.params.projectId}`, (err,resp)=>{
        res.send(resp)
    })
}

module.exports = {
    getUserProjects,
    getSingleProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectTasks,
    createProjectTask
}
