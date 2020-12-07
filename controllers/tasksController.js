const tasksController = (app) =>{
    const connection = require('../models/db')
    const bcrypt = require('bcrypt')
    const auth = require("./authController"); //Authorization controller    
    
    // tasks api
    
    app.get('/tasks', auth.authenticate,auth.viewTask,(req,res)=>{
        connection.query("SELECT * from tasks", (err,resp)=>{
           

            res.send(resp)
        })
    })
    

    //get tasks with user Id
    app.get('/tasks/:id',auth.authenticate,auth.viewTask,(req,res)=>{
        connection.query(`SELECT * from tasks where id = ${req.params.id}`, (err,resp)=>{
            
            res.send(resp[0])
        })
    
    })
    
    app.post('/tasks',(req,res)=>{
        
            connection.query(`insert into tasks (name, description) 
                    values('${req.body.name}',
                     '${req.body.description}')`, (errq,resp)=>{
                         if (errq) throw errq
                         res.send("Task successfully created")
            })
    })


    app.put('/tasks/:id',(req,res)=>{
        if(req.body.name){    
            connection.query(`UPDATE task SET 
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
        // if(req.body.teamId){
        //     connection.query(`UPDATE tasks SET 
        //         otherName='${req.body.teamId}'
        //         WHERE id=${req.params.id}`, (err,resp)=>{
        //             if (err) throw err
        //         })
        // } 
        res.send(" Task successfully updated")
    })
    
    app.delete('/tasks/:id',(req,res)=>{
        connection.query(`DELETE FROM tasks WHERE  id=${req.params.id}`, (err,resp)=>{
            if (err) throw err
            res.send(`successfully deleted task with id ${req.params.id}`)
        })
    })
}

module.exports = tasksController