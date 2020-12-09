const connection = require('../models/db')
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require("jsonwebtoken"); 


const root = (req,res)=>{
    res.send('Welcome to BASCOM API')
}

const getUsers = (req,res)=>{
    connection.query("SELECT * from users", (err,resp)=>{
        // delete resp[0].password
        resp.map( user => delete user.password )
            res.send(resp)
    })
}

const getSingleUser = (req,res)=>{
    connection.query(`SELECT * from users where id = ${req.params.id}`, (err,resp)=>{
        delete resp[0].password
        res.send(resp[0])
    })
}

const internalUserSignup = (req,res)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err) throw err
        // res.send(req.body)
        connection.query(`insert into users (firstName,lastName, email, password, isEnabled) 
            values('${req.body.firstName}',
                '${req.body.lastName}',
                '${req.body.email}', 
                '${hash}',true)`, (errq,resp)=>{
                    if (errq) return res.send("Email already exist")
                    connection.query(`INSERT INTO users_role(userId, roleId) VALUES (${resp.insertId}, 1)`,(err,resp)=>{
                        if (err) return res.status(500).send('Internal error')
                            res.send('Successfully added internal user!') 
                    })
        })
    })
}

const signUp = (req,res)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err) throw err
        // res.send(req.body)
        connection.query(`insert into users (firstName,lastName, email, password, isEnabled) 
            values('${req.body.firstName}',
                '${req.body.lastName}',
                '${req.body.email}', 
                '${hash}',true)`, (errq,resp)=>{
                    if (errq) return res.send("Email already exist")
                    connection.query(`INSERT INTO users_role(userId, roleId) VALUES (${resp.insertId}, 3)`,(err,resp)=>{
                        if (err) return res.status(500).send('Internal Error!')
                        res.send('Signup successful!') 
                    })
        })
    })
}

const userLogin = (req,res)=>{
    connection.query(`select * from users where email = '${req.body.email}' `, (err,resp)=>{
        if (err || resp.length < 1){
            res.statusCode=401
            res.send('Invalid username or password')     
        }else{
            bcrypt.compare(req.body.password,resp[0].password,(errhash,success)=>{
                if(errhash){
                    return res.status(500).send('Internal error')
                }
                if(success == true){
                    connection.query(`select permissionName 
                        from permissions inner join role_permission 
                        on permissions.id = role_permission.permissionId 
                        inner join users_role 
                        on role_permission.roleId = users_role.roleId 
                        inner join users 
                        on users.id = users_role.userId where users.id = ${resp[0].id}`,
                        (err, userPermissions) => {
                            if (err) return res.status(401).send(err);
                            resp[0].permissions = userPermissions.map(userPerm => userPerm.permissionName);
                            
                            let data = { data: resp[0] };
    
                            let token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET,
                                {
                                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                                }
                            );
    
                            let tokenData = {
                                data: resp[0],
                                accessToken: token,
                            };
                            res.send(tokenData);
                        })
                }else{
                    res.status(401).send('Invalid username or password')
                }
    
            })
        }
          
    })
}

const updateUser = (req,res)=>{
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
}

const deleteUser = (req,res)=>{
    //  handling delete
    connection.query(`DELETE FROM users WHERE  id=${req.params.id}`, (err,resp)=>{
        if (err) throw err
        res.send(`successfully deleted user with id ${req.params.id}`)
    })
}


module.exports = {
    root,
    getUsers,
    getSingleUser,
    internalUserSignup,
    signUp,
    userLogin,
    updateUser,
    deleteUser
}

