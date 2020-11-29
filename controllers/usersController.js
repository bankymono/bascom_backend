const usersController = (app) =>{
    const connection = require('../models/db')
    const bcrypt = require('bcrypt')


    app.get('/',(req,res)=>{
        res.send('Welcome to BASCOM API')
    })
    
    // users api
    app.get('/users',(req,res)=>{
        connection.query("SELECT * from users", (err,resp)=>{
            // delete resp[0].password
            resp.map( user => delete user.password )
            res.send(resp)
        })
    })
    
    app.get('/users/:id',(req,res)=>{
        connection.query(`SELECT * from users where id = ${req.params.id}`, (err,resp)=>{
            delete resp[0].password
            res.send(resp[0])
        })
    
    })
    
    app.post('/users/signup',(req,res)=>{

        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err) throw err

        // res.send(req.body)
            connection.query(`insert into users (firstName,lastName, otherName, email, password, isEnabled) 
                    values('${req.body.firstName}',
                     '${req.body.lastName}',
                     '${req.body.otherName}', 
                     '${req.body.email}', 
                     '${hash}',true)`, (errq,resp)=>{
                            if (errq) throw errq
                            res.send("successfully created!")
            })
        })
    })

    app.post('/users/login',(req,res)=>{
        // res.send(req.body)
        connection.query(`insert into users (firstName,lastName, otherName, email, password, isEnabled) 
                values('${req.body.firstName}', '${req.body.lastName}','${req.body.otherName}', '${req.body.email}', '${req.body.password}',true)`, (err,resp)=>{
            if (err) throw err
            res.send("successfully created!")
        })
    })
    
    app.put('/users/:id',(req,res)=>{
        if(req.body.password){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err) throw err
                connection.query(`UPDATE users SET 
                     password='${hash}' WHERE id=${req.params.id}`, (err,resp)=>{
                    if (err) throw err
                })        
            })
        }
        if(req.body.firstName){    
            connection.query(`UPDATE users SET 
                firstName='${req.body.firstName}'
                WHERE id=${req.params.id}`, (err,resp)=>{
                if (err) throw err
            })
        }
        if(req.body.lastName){
            connection.query(`UPDATE users SET 
                lastName='${req.body.lastName}'
                WHERE id=${req.params.id}`, (err,resp)=>{
                    if (err) throw err
                })
        }
        if(req.body.otherName){
            connection.query(`UPDATE users SET 
                otherName='${req.body.otherName}'
                WHERE id=${req.params.id}`, (err,resp)=>{
                    if (err) throw err
                })
        }
        if(req.body.email){
            connection.query("SELECT * from users", (err,resp)=>{
                // delete resp[0].password
                resp.map( user => {
                    if(user.email === req.body.email){
                        res.send('Email already exist!')
                    }else{
                        connection.query(`UPDATE users SET  
                                        email='${req.body.email}', 
                                        WHERE id=${req.params.id}`, (err,resp)=>{
                                                if (err) throw err
                                        })
                    }
                })
            })
        } 

            res.send("successfully updated")
    })
    
    app.delete('/users/:id',(req,res)=>{
    //  handling delete
        connection.query(`DELETE FROM users WHERE  id=${req.params.id}`, (err,resp)=>{
            if (err) throw err
            res.send(`successfully deleted user with id ${req.params.id}`)
        })
    })
}

module.exports = usersController