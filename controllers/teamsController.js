const connection = require('../models/db')
const sendEmail = require('../utils/mailer');

const getAllTeams = (req,res)=>{
    connection.query(`SELECT * from teams`, (err,resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});
        
        res.status(200).json({data:resp});
    })
}

const getTeams = (req,res)=>{
    connection.query(`SELECT * from teams where createdBy = ${req.user.data.id}`, (err,resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});
        
        if(resp.length < 1) return res.status(404).json({message:"No team found."})
        res.status(200).json({data:resp})
    })
}

const  getSingleTeam = (req,res)=>{
    connection.query(`SELECT * from teams where id = ${req.params.teamid}`, (err,resp)=>{
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Not found!'});
        
        if(req.user.data.id === resp[0].createdBy){
            connection.query(`SELECT teams.name,firstName, lastName FROM users INNER JOIN team_members ON users.id = team_members.userId INNER JOIN teams ON team_members.teamId = teams.id where teams.id = ${req.params.teamid}`, (err2,resp2)=>{
                if(err2) return res.status(500).json({message:'internal server error'});

                if(resp2.length < 1) return res.status(404).json({
                    data:{
                        'teamName':resp[0].name,
                        'members':[]
                        }
                });

                return res.status(200).json({
                    data:{
                    'teamName':resp[0].name,
                    'members':resp2.map(member => `${member.firstName} ${member.lastName}`)
                    }
                })
            })
        }
        if(req.user.data.permissions.some(permission => permission == "view_all_teams")){
            connection.query(`SELECT teams.name,firstName, lastName FROM users INNER JOIN team_members ON users.id = team_members.userId INNER JOIN teams ON team_members.teamId = teams.id where teams.id = ${req.params.teamid}`, (err2,resp2)=>{
                if(err2) return res.status(500).json({message:'internal server error'});

                if(resp2.length < 1) return res.status(404).json({
                    data:{
                        'teamName':resp[0].name,
                        'members':[]
                        }
                });

                return res.status(200).json({
                    data:{
                    'teamName':resp[0].name,
                    'members':resp2.map(member => `${member.firstName} ${member.lastName}`)
                    }
                })
            })
        }else{
            res.status(403).json({message:'Unauthorized'});
        }
    })
}

// creates team
const  createTeam = (req,res)=>{
    connection.query(`insert into teams (name, description, createdBy) 
        values('${req.body.name}',
               '${req.body.description || null}',
                ${req.user.data.id})`, (errq,resp)=>{
                    if (errq) return res.status(400).json({success:false,message:'name cannot be empty'});

                    res.status(200).json({success:true,message: `${req.body.name} successfully created!`});
        })
}

const inviteMember = () =>{
    const {email} = req.body;
    
    
    // create a frontend url for user to click to reset password
    const resetUrl = `${process.env.BASE_URL}/invitemember`;

    // generate a message to show to user in mail
    const message = `
            <p>You are invited to collaborate on Bascom!</p>
            <p>Please go to this link to accept or reject invite</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>Kindly ignore this mail if you did not initiate this request.</p>
    `;

    sendEmail(
        'Bascom Project <bankymono@gmail.com>',
        'Invitation to Collaborate',
        `${email}`,
        `${message}`,

        // response after sending mail
        (err3,info)=>{
            //after sending mail, if theres an error
            if (err3) {
                // then inform the user of internal server error
                return res.status(500).json({"message":"internal server error"})
            }

            res.status(200).json({success:true, message:'Invite sent'})
        }
    )// ## mail sending logic for forgotpassword ends here
}

const addMember = (req,res) =>{
    connection.query(`SELECT id,firstName,email from users where email = '${req.body.email}'`, (err,resp)=>{
        
        if(err) return res.status(500).json({message:"Internal Server Error"})

        if(resp.length < 1) return res.status(404).json({success:false, message:"User not found, ask user to sign up!"})

        connection.query(`INSERT INTO team_members(teamId,userId) VALUES (${req.params.teamId}, ${resp[0].id})`,(err2,resp2)=>{
            if (err2) return res.status(500).json({message:"Internal Server Error"})

            res.status(200).json({success:true, message:`${resp[0].firstName} successfully added to team!!.`})
        })
    })
}

const removeMember = (req,res) =>{
    connection.query(`SELECT team_members.id,teams.createdBy from team_members 
        inner join teams on team_members.teamId = teams.id where team_members.id = ${req.params.memberId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:"Internal Server Error"})

        if(resp.length < 1) return res.status(404).json({success:false, message:"Not a team member"})
        
        if(req.user.data.id == resp[0].createdBy){
            connection.query(`DELETE FROM team_members WHERE  id=${req.params.memberId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:"Internal Server Error"})

                return res.status(200).json({success:true, message:`successfully removed member with id ${req.params.memberId}`})
            })     
        }if(req.user.data.permissions.some(permission => permission == "manage_team")){

            connection.query(`DELETE FROM team_members WHERE  id=${req.params.memberId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:"Internal Server Error"})

                return res.status(200).json({success:true, message:`successfully removed member with id ${req.params.memberId}`})
            })
        }else{
            res.status(403).json({message:'Unauthorized'});
        }
    })
}

const editTeam = (req,res)=>{
    const d = new Date().toISOString()

    connection.query(`SELECT createdBy from teams where id = ${req.params.teamId}`, (err,resp)=>{
        
        // if error 
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Not found!'});

        if(req.user.data.id == resp[0].createdBy){
            connection.query(`UPDATE teams SET 
                name='${req.body.name}',
                description ='${req.body.description}',
                lastModified = '${d}',
                modifiedBy = ${req.user.data.id}
                WHERE id=${req.params.teamId}`, (err,resp)=>{
                    if(err) return res.status(500).json({message:'internal server error'});
                    
                    res.status(200).json({success:true,message:"successfully updated!"})
            }) 
        }else if(req.user.data.permissions.some(permission => permission == "manage_team")){
            connection.query(`UPDATE teams SET 
            name='${req.body.name}',
            description ='${req.body.description}',
            lastModified = '${d}',
            modifiedBy = ${req.user.data.id}
            WHERE id=${req.params.teamId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal server error'});
                
                res.status(200).json({success:true,message:"successfully updated!"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"})
        }
    })

}


const deleteTeam = (req,res)=>{
    
    connection.query(`SELECT createdBy from teams where id = ${req.params.teamId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Not found!'});
    
        if(req.user.data.id == resp[0].createdBy){
            connection.query(`DELETE FROM team_members WHERE  teamId=${req.params.teamId}`, (err2,resp2)=>{
                if(err2) return res.status(500).json({message:"Internal Server Error"})
                
                connection.query(`DELETE FROM teams WHERE  id=${req.params.teamId}`, (err3,resp)=>{
                    if(err3) return res.status(500).json({message:'internal server error'});
    
                    res.status(200).json({success:true,message:"successfully deleted"});
                })
            })     
        }else if(req.user.data.permissions.some(permission => permission == "manage_team")){
            connection.query(`DELETE FROM team_members WHERE  teamId=${req.params.teamId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:"Internal Server Error"})

                connection.query(`DELETE FROM teams WHERE  id=${req.params.teamId}`, (err2,resp2)=>{
                    if(err2) return res.status(500).json({message:'internal server error'});
    
                    res.status(200).json({success:true,message:"successfully deleted"})
                })
            })

        }else{
            res.status(400).json({success:false,message:"forbidden"});
        }
    })
}

module.exports = {
    getAllTeams,
    getTeams,
    getSingleTeam,
    inviteMember,
    addMember,
    removeMember,
    createTeam,
    editTeam,
    deleteTeam
}