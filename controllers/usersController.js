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
                                    if (err3) {console.log(err3);return res.status(500).json({"message":'internal server error'})}
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
    // get email and password from request
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({success:false,message:"Please provide email and password!"});
    }

    // check if user exists in the database
    connection.query(`select * from users where email = '${req.body.email}'`, (err,resp)=>{

        if (err) return res.status(500).json({message:'internal server error'});

        // if email is not found
        if (resp.length < 1){
            
            return res.status(404).json({success:false,message:"Invalid credentials!"}) 

        }
        if(resp[0].isEnabled == true){  // if email is found and account is activated
            
            // verify if password is correct
            bcrypt.compare(req.body.password,resp[0].password,(errhash,success)=>{

                if(errhash) return res.status(500).json({message:'internal server error'});

                // if email is successfully confirmed
                if(success == true){
                    
                    // fetch user permissions from database
                    connection.query(`select permissionName 
                        from permissions inner join role_permission 
                        on permissions.id = role_permission.permissionId 
                        inner join users_role 
                        on role_permission.roleId = users_role.roleId 
                        inner join users 
                        on users.id = users_role.userId where users.id = ${resp[0].id}`,
                        (err, userPermissions) => {
                            // if there is error fetching data
                            if (err) return res.status(500).json({message:'internal server error'});

                            // delete user password details
                            delete resp[0].password

                            // add user permissions to user data object
                            resp[0].permissions = userPermissions.map(userPerm => userPerm.permissionName);
                            
                            let data = { data: resp[0] };
    
                            // generate token for frontend authentication
                            let token = jwt.sign(
                                data,
                                process.env.ACCESS_TOKEN_SECRET,
                                {
                                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                                }
                            );
    
                            // set user data and token for authentication as one object
                            let tokenData = {
                                data: resp[0],
                                accessToken: token,
                            };

                            // send user details
                            return res.status(200).json({success:true,user:tokenData});
                        })
                }else{ // if password is not verified
                    return res.status(404).json({success:false,message:"Invalid credentials!"}) 
                }
            })
        }
        else{ // if email is not activated
            res.status(401).json({message : `Account not activated! Please, check your mail for activation link.`});
        }          
    })
}

// forgot password logic
const forgotPassword = (req,res,next) =>{
    const {email} = req.body;

    connection.query(`select * from users where email = '${email}'`, (err1,resp1)=>{
        //check if query returns erroe
        if (err1) return res.status(500).json({message:err1});

        // if email is not found
        if (resp1.length < 1){
            return res.status(404).json({success:false,message:"Email could not be sent"}) 
        }

        //generate a password reset token
        const resetToken = randomstring.generate();
        const resetPasswordExpire = Date.now() + 10 *( 60* 1000);

        // store reset token into database
        connection.query(`update users set resetPasswordToken = '${resetToken}', 
                        resetPasswordExpire='${resetPasswordExpire}' where email='${email}'`,(err2,resp2)=>{
                    if (err2) return res.status(500).json({"success":false,"message":"internal server error"});

                    //encode the reset token
                    const encodedResetToken = encodeURIComponent(Buffer.from(`${resetToken}`,'binary').toString('base64'));
                    
                    // create a frontend url for user to click to reset password
                    const resetUrl = `${process.env.BASE_URL}/passwordreset/${encodedResetToken}`;

                    // generate a message to show to user in mail
                    const message = `
                            Hello ${resp1[0].firstName},
                            <p>You have requested a password reset</p>
                            <p>Please go to this link to reset your password</p>
                            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
                            <p>Kindly ignore this mail if you did not initiate this request.</p>
                    `;

                    sendEmail(
                        'Bascom Project <bankymono@gmail.com>',
                        'Password Reset Request',
                        `${email}`,
                        `${message}`,

                        // response after sending mail
                        (err3,info)=>{
                            //after sending mail, if theres an error
                            if (err3) {

                                // set the resetpasswordtoken and resettoken expire column to null
                                connection.query(`update users set resetPasswordToken = null, 
                                    resetPasswordExpire=null where email='${email}'`,(err4,resp)=>{
                                    if (err4) return res.status(500).json({"success":false,"message":'internal server error'})
                                })
                                // then inform the user of internal server error
                                return res.status(500).json({"message":err3})
                            }

                            res.status(200).json({success:true, message:'Email sent'})
                        }
                    )// ## mail sending logic for forgotpassword ends here
        });

    });
} // forgot password logic ends here

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

