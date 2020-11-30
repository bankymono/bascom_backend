const projectsController = (app) =>{
    const connection = require('../models/db')
    const bcrypt = require('bcrypt')


    // app.get('/',(req,res)=>{
    //     res.send('Welcome to BASCOM API')
    // })
    
    // projects api
    app.get('/projects',(req,res)=>{
        connection.query("SELECT * from projects", (err,resp)=>{
            // delete resp[0].password

            res.send(resp)
        })
    })
    
    app.get('/projects/:id',(req,res)=>{
        connection.query(`SELECT * from projects where id = ${req.params.id}`, (err,resp)=>{
            delete resp[0].password
            res.send(resp[0])
        })
    
    })
    
    app.post('/projects',(req,res)=>{
        
        // res.send(req.body)
            connection.query(`insert into projects (name, description) 
                    values('${req.body.name}',
                     '${req.body.description}')`, (errq,resp)=>{
                         if (errq) throw errq
                         res.send("successfully created!")
            })
    })

    
    app.put('/projects/:id',(req,res)=>{
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
    })
    
    app.delete('/projects/:id',(req,res)=>{
    //  handling delete
        connection.query(`DELETE FROM projects WHERE  id=${req.params.id}`, (err,resp)=>{
            if (err) throw err
            res.send(`successfully deleted user with id ${req.params.id}`)
        })
    })
}

module.exports = projectsController