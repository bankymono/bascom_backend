const connection = require('../models/db')
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require("jsonwebtoken"); 
const randomstring = require('randomstring');
const sendEmail = require('../utils/mailer');

// Welcome to Bascom
const root = (req,res)=>{
    res.send('Welcome to BASCOM API')
}

// Internal User registration controller
const internalUserSignup = (req,res)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err) throw err

        // res.send(req.body)
        connection.query(`insert into users (firstName,lastName, email, password, isEnabled) 
            values('${req.body.firstName}',
                '${req.body.lastName}',
                '${req.body.email}', 
                '${hash}',true)`, (errq,resp)=>{
                    if (errq) return res.status(422).json({error:"Email already exist"})
                    connection.query(`INSERT INTO users_role(userId, roleId) VALUES (${resp.insertId},2)`,(err,resp)=>{
                        if (err) return res.status(500).send('Internal error')
                            res.json({message:'Successfully added internal user!'}) 
                    })
        })
    })
}

// Get all users
const getUsers = (req,res)=>{
    connection.query("SELECT * from users order by dateCreated desc", (err,resp)=>{
        // delete resp[0].password
        resp.map( user => delete user.password )
            res.json({"users":resp})
    })
}

// Get single user with userID
const getSingleUser = (req,res)=>{
    connection.query(`SELECT * from users where id = ${req.params.userId}`, (err,resp)=>{
        delete resp[0].password
        res.send(resp[0])
    })
}



//###################### USER SIGNUP #############################################################
const signUp = (req,res,next)=>{
    connection.query(`select * from users where email = '${req.body.email}'`, (err, resp)=>{
        if(err) return res.status(500).json({message:"internal server error"})
        if(resp.length < 1){
            bcrypt.hash(req.body.password,10, (errHash,hash)=>{
                if(errHash) throw errHash

                //generate otpCode
                const otpCode = randomstring.generate()

                // insert user to table
                connection.query(`insert into users (firstName,lastName, email, password,otpCode, isEnabled) 
                    values('${req.body.firstName}',
                            '${req.body.lastName}',
                            '${req.body.email}', 
                            '${hash}',
                            '${otpCode}', false)`, 
                            (err,resp)=>{
                            if (err) return res.status(500).json({"success":false,
                                                            "message":"internal server error"});
                        
                            // Assign a default role to user(normal user role)
                            connection.query(`INSERT INTO users_role(userId, roleId) 
                            VALUES (${resp.insertId}, 3)`,(err2,resp2)=>{
                                if (err2) return res.status(500).json({"success":false,
                                                                        "message":"internal server error"});
                            
                                // encode userId and otpCode before sending to user to enable account activation
                                const encodedUserId = encodeURIComponent(Buffer.from(`${resp.insertId}`,'binary').toString('base64')) 
                                const encodedOtpCode = encodeURIComponent(Buffer.from(`${otpCode}`,'binary').toString('base64'));
                        
                            // send mail to user for account verification
                            sendEmail(
                                'Bascom Admin <bankymono@gmail.com>',
                                'User Registration Successful! Please, Activate Your Account!',
                                `${req.body.email}`,
                                `Hi ${req.body.firstName}, <br/>
                                <p>Welcome to <b>Bascom Projects</b>, thank your for registration. Click <a href="${process.env.BASE_URL}/users/auth/activation/${encodedUserId}/${encodedOtpCode}"><b>here</b></a> to activate your account.
                                <p>Or Copy the link below to your browser:<br/>
                                <a href="${process.env.BASE_URL}/users/auth/activation/${encodedUserId}/${encodedOtpCode}">${process.env.BASE_URL}/users/auth/activation/${encodedUserId}/${encodedOtpCode}}</a></p>
                                <br/>`,

                                // response after sending mail
                                (err3,info)=>{
                                    if (err3){console.log(err3); return res.status(500).json({"message":'internal server error'});}
                                    res.status(201).json({message:'Signup Sucessful! Please, check your mail and activate your account!'})
                                }
                            )// ## mail sending logic ends here        
                        })          
                        
                    })
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"user already exists"
            });
        }
    })
}
//################ SIGNUP CONTROLLER ENDS HERE ######################################################

// Login controller
const login = (req,res,next)=>{
    connection.query(`select * from users where email = '${req.body.email}'`, (err,resp)=>{
        if (err) {res.status(500).json({message:'internal sample error'});console.log(err)} 
        if (resp.length < 1){
            res.statusCode=401
            res.send('Invalid username or password')     
        }else if(resp[0].isEnabled = true){
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
        else{
            res.status(401).json({message : `Account not activated! Please, check your mail for activation link.`});
        }          
    })
}

const forgotPassword = (req,res,next) =>{
    res.send('forgot password link')
}

const resetPassword = (req,res,next) =>{
    res.send('reset password link')
}

const activateAccount = (req,res) =>{    
    const decodedUserId = decodeURIComponent(req.params.userId);
    const decodedOtpCode = decodeURIComponent(req.params.otpCode);

    
    const userId = Buffer.from(decodedUserId, 'base64').toString();
    const otpCode = Buffer.from(decodedOtpCode, 'base64').toString();

    connection.query(`SELECT email, otpCode, isEnabled FROM users WHERE id = ${userId}`, (err, resp) => {
        if (err) { return res.status(422).json({message : 'Internal Error!'}); }
        
        if (resp.length > 0) {
            if (resp[0].isEnabled == true) {
                return res.status(200).json({message : 'Account already activated! Proceed to login'})
            }
            if (resp[0].otpCode == otpCode) {
                connection.query(`UPDATE users SET isEnabled = true, otpCode = null WHERE id = ${userId}`, (err2, resp2) => {
                    if (err2) { return res.status(422).json({message : 'Internal error'}); }
                    return res.status(201).json({message : 'Account activated! You may proceed to login'})
                });
            } else {
                return res.status(401).json({message : 'Error validating account!please check the link again'})
            }
        } else {
            return res.status(404).json({message : 'No account found! Check Activation Link Again'})
        }
    });
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

// const changePassword = (req,res)=>{
//     const oldPassword = req.body.oldPassword
//     const password = req.body.password

//     if(req.user.data.id){
//         connection.query(`SELECT password FROM users WHERE id = ${req.user.data.id}`, (err, resp) => {
//             if (err) { return res.status(422).json({message : 'internal error'}); }      
//             const comparePassword = bcrypt.compare(oldPassword, resp[0].password, (err1) => {
//                 if (err1) { return res.status(500).json({ message: 'Internal Error' }); }
//             })
            
//             if (comparePassword == true) {
//                 bcrypt.hash(password, 10, (err2, hash) => {
//                     if (err2) { return res.status(500).json({ message: 'Internal Error' }); }
//                     connection.query(`UPDATE users SET password = ${hash} WHERE id = ${userId}`, (err3, resp3) => {
//                         if (err3) { return res.status(422).json({message : err3.sqlMessage}); }
//                         res.status(200).json({message : "Password Updated!"});
//                         });
//                 })
//             } else {
//                 return res.status(401).json({message : "Old password is Incorrect!"})
//             }
//     })
//     }else{
//         res.status(401).json({message:'unauthorized'})
//     }
// }

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
    activateAccount,
    login,
    forgotPassword,
    resetPassword,
    updateUser,
    deleteUser
}

