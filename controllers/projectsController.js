const connection = require('../models/db')

    // app.get('/',(req,res)=>{
    //     res.send('Welcome to BASCOM API')
    // })
    
// projects api
const getProjects = (req,res)=>{
    connection.query("SELECT * from projects", (err,resp)=>{
        // delete resp[0].password
        res.send(resp)
    })
}

    
const getSingleProject = (req,res)=>{
    connection.query(`SELECT * from projects where id = ${req.params.id}`, (err,resp)=>{
        delete resp[0].password
        res.send(resp[0])
    })
}
    
const createProject = (req,res)=>{
    // res.send(req.body)
        connection.query(`insert into projects (name, description) 
                values('${req.body.name}',
                    '${req.body.description}')`, (errq,resp)=>{
                        if (errq) throw errq
                        res.send("successfully created!")
        })
}

    
const updateProject = (req,res)=>{
    if(req.body.name){    
        connection.query(`UPDATE projects SET 
            name='${req.body.name}'
            WHERE id=${req.params.id}`, (err,resp)=>{
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
            otherName='${req.body.teamId}'
            WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) throw err
            })
    } 
    res.send("successfully updated")
}
    
const deleteProject = (req,res)=>{
//  handling delete
    connection.query(`DELETE FROM projects WHERE  id=${req.params.id}`, (err,resp)=>{
        if (err) throw err
        res.send(`successfully deleted user with id ${req.params.id}`)
    })
}

<<<<<<< HEAD
module.exports = projectsController;
=======
module.exports = {
    getProjects,
    getSingleProject,
    createProject,
    updateProject,
    deleteProject
}
>>>>>>> test-branch
