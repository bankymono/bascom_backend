const connection = require('../models/db')

const getAllTeams = (req,res)=>{
    connection.query(`SELECT * from teams`, (err,resp)=>{
        if(err) throw err;
        res.send(resp)
    })
}

const getTeams = (req,res)=>{
}

const  getSingleTeam = (req,res)=>{
    connection.query(`SELECT * from teams where id = ${req.params.teamid}`, (err,resp)=>{
        if(err) throw err;
        if(req.user.data.id === resp[0].createdBy){
            connection.query(`SELECT teams.name,firstName, lastName FROM users INNER JOIN team_members ON users.id = team_members.userId INNER JOIN teams ON team_members.teamId = teams.id where teams.id = ${req.params.teamid}`, (err2,resp2)=>{
                if(err2) throw err2
                res.status(200).json({
                    'teamName':resp[0].name,
                    'members':resp2.map(member => `${member.firstName} ${member.lastName}`)
                })
            })
        }else{
            res.status(422).json({"message":"access denied"})
        }
    })
}

// creates team
const  createTeam = (req,res)=>{
    connection.query(`insert into teams (name, description, createdBy) 
        values('${req.body.name}',
               '${req.body.description}',
                ${req.user.data.id})`, (errq,resp)=>{
                    if (errq) throw errq
                    console.log(resp)
                    res.status(200).json({message: `${req.body.name} successfully created!`})
        })
}

const addMember = (req,res) =>{
    connection.query(`SELECT id,firstName,email from users where email = '${req.body.email}'`, (err,resp)=>{
        // const otpCode = randomstring.generate()
        if(err) return res.status(422).json({message:"Internal Error"})

        if(resp.length < 1){
            res.status(404).json({message:"User not found"})
        }
        else{
            connection.query(`INSERT INTO team_members(teamId,userId) VALUES (${req.params.teamId}, ${resp[0].id})`,(err2,resp2)=>{
                if (err2) return res.status(500).send(err2)

                res.status(200).json({message:`${resp[0].firstName} successfully added to team!!.`})
            })
        }
    })
}

// const removeMember = (req,res) =>{
//     connection.query(`SELECT id,firstName,email from users where email = '${req.body.email}'`, (err,resp)=>{
//         // const otpCode = randomstring.generate()
//         if(err) return res.status(422).json({message:"Internal Error"})

//         if(resp.length < 1){
//             res.status(404).json({message:"User not found"})
//         }
//         else{
//             connection.query(`DELETE FROM team_members WHERE `,(err2,resp2)=>{
//                 if (err2) return res.status(500).send(err2)

//                 res.status(200).json({message:`${resp[0].firstName} successfully added to team!!.`})
//             })
//         }

//     })
// }

const updateTeam = (req,res)=>{
    //vbnm,.
}



const deleteTeam = (req,res)=>{
    //vbnm,.
}

module.exports = {
    getAllTeams,
    getTeams,
    getSingleTeam,
    addMember,
    // removeMember,
    createTeam,
    updateTeam,
    deleteTeam
}
