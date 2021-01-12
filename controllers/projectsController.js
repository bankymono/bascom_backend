const connection = require('../models/db')

    // app.get('/',(req,res)=>{
    //     res.send('Welcome to BASCOM API')
    // })
    
// projects api

const getAllProjects = (req,res)=>{
    connection.query(`SELECT * from projects`, (err,resp)=>{
        if(err) throw err;
        res.send(resp)
    })
}

const getProjects = (req,res)=>{
    connection.query(`SELECT * from projects where createdBy = ${req.user.data.id}`, (err,resp)=>{
        if(err) throw err;
        res.send(resp)
    })
}
    
const getSingleProject = (req,res)=>{
    connection.query(`SELECT * from projects where id = ${req.params.projectId}`, (err,resp)=>{
        if(err) throw err
        if(resp.length < 1) res.status(404).send('does not exist!')
        else
        if(resp[0].createdBy == req.user.data.id){
            res.send(resp[0])
        }else if(req.user.data.permissions.some(permission => permission === "view_all_projects")){
            res.send(resp[0])
        }else{
            res.status(403).send('unauthorized!')
        }
    })
}

const addTeam = (req,res)=>{
    connection.query(`SELECT id, name from teams where id = ${req.body.teamId}`,(err, resp)=>{
        if(err) return res.status(422).send('Internal error')
        if(resp.length < 1){
            res.status(404).json({messag:"no such team found"})
        }else{
            connection.query(`SELECT createdBy from projects where id = ${req.params.projectId}`,(err2, resp2)=>{
                if(err2) return res.status(422).send('Internal error')
                if(req.user.data.id === resp[0].createdBy ){
                    connection.query(`UPDATE projects
                            SET teamId = ${req.body.teamId}
                            WHERE id=${req.params.projectId}`, (err3,resp3)=>{
                            if(err3) return res.status(422).send('Internal error adding team')
                            res.json({'message':"Successfully added"})
                    })
                } else if(req.user.data.permissions.some(permission => permission === "manage_project") ){
                    connection.query(`UPDATE projects
                        SET teamId = ${req.body.teamId}
                        WHERE id=${req.params.projectId}`, (err3,resp3)=>{
                            if(err3) return res.status(422).send('Internal error adding team')
                            res.json({'message':"Successfully added"})
                        })
                    }else{
                    res.status(433).json({'message':"unauthorized"})
                    }
                })
        }
    })
}
    
const createProject = (req,res)=>{
    connection.query(`insert into projects (name, description, teamId, createdBy, startDate, endDate, statusId) 
        values('${req.body.name}',
               '${req.body.description}',
                ${req.body.teamId || null},
                ${req.user.data.id},
                ${req.body.startDate || null},
                ${req.body.endDate || null},
                ${req.body.statusId ||null})`, (errq,resp)=>{
                    if (errq) throw errq
                    res.send("successfully created!")
        })
}
    
const updateProject = (req,res)=>{
    const d = new Date().toISOString()

    connection.query(`SELECT createdBy from projects where id = ${req.params.projectId}`, (err,resp)=>{
        if(err) throw err
        if(resp.length < 1) res.status(404).send('does not exist!')
        else
        if(req.user.data.id === resp[0].createdBy){
            connection.query(`UPDATE projects SET 
                name='${req.body.name}',
                description ='${req.body.description}',
                teamId = ${req.body.teamId || null},
                startDate = ${req.body.startDate || null},
                endDate = ${req.body.endDate || null},
                statusId = ${req.body.statusId ||null},
                lastModified = '${d}',
                modifiedBy = ${req.user.data.id}
                WHERE id=${req.params.projectId}`, (err,resp)=>{
                    if (err) throw err
                    res.send(resp)
            }) 
        }else if(req.user.data.permissions.some(permission => permission === "manage_project")){
            res.send(resp[0])
        }else{
            res.status(403).send('forbidden')
        }
    })

}
    
const deleteProject = (req,res)=>{
//  handling delete

    connection.query(`SELECT createdBy from projects where id = ${req.params.projectId}`, (err,resp)=>{
        if(err) throw err
        if(resp.length < 1) res.status(404).send('does not exist!')
        else
        if(req.user.data.id === resp[0].createdBy){
            connection.query(`DELETE FROM projects WHERE  id=${req.params.projectId}`, (err,resp)=>{
                if (err) throw err
                res.send(`successfully deleted user with id ${req.params.projectId}`)
            })     
        }else if(req.user.data.permissions.some(permission => permission === "manage_project")){
            res.send(resp[0])
        }else{
            res.status(403).send('forbidden')
        }
    })
}

// const createProjectTask = (req,res)=>{
//     connection.query(`insert into tasks (name, description, createdBy, startDate, endDate, projectId, statusId) 
//         values('${req.body.name}',
//                '${req.body.description}',
//                '${req.user.data.id}',
//                '${req.body.startDate}',
//                '${req.body.endDate}',
//                '${req.params.projectId}',
//                '${req.body.statusId}')`, (errq,resp)=>{
//                     if (errq) throw errq
//                     res.send("successfully created!")
//         })
// }

// const getProjectTasks = (req,res)=>{
//     connection.query(`SELECT * from tasks where projectId = ${req.params.projectId}`, (err,resp)=>{
//         res.send(resp)
//     })
// }

module.exports = {
    getAllProjects,
    getProjects,
    getSingleProject,
    addTeam,
    createProject,
    updateProject,
    deleteProject
    // getProjectTasks,
    // createProjectTask
}
