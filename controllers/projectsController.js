const connection = require('../models/db')

    
// projects api

// fetches all projects - accessible only by an administrator
const getAllProjects = (req,res)=>{
    connection.query(`SELECT * from projects`, (err,resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});
        
        if(resp.length < 1) return res.status(404).json({success:false, message:"No project found."})
        
        res.status(200).json({success:true, data:resp})
    })
}

// fetch projects of a logged in user
const getProjects = (req,res)=>{
    // fetch from db
    connection.query(`SELECT * from projects where createdBy = ${req.user.data.id}`, (err,resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});
        
        if(resp.length < 1) return res.status(404).json({success:false, message:"No project found."})
        res.status(200).json({data:resp})
    })
} // fetch user project ends here!


// get project by id
const getSingleProject = (req,res)=>{
    connection.query(`SELECT * from projects where id = ${req.params.projectId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:'internal server error'});

        // if no data returned, send status not found
        if(resp.length < 1) return res.status(404).json({message:'Not found!'});

        // is the logged in user owner of the project?
        if(resp[0].createdBy == req.user.data.id) return res.status(200).json({data:resp[0]})
        
        // does the logged in user have permission to view the project?
        if(req.user.data.permissions.some(permission => permission == "view_all_projects")) 
            return res.status(200).json({data:resp[0]})
        
            // user not authorized to view project
        res.status(403).json({message:'Unauthorized'});
    })
}

const addTeam = (req,res)=>{
    connection.query(`SELECT id, name from teams where id = ${req.body.teamId}`,(err, resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});
        
        if(resp.length < 1) return res.status(404).json({message:'Team not found!'});
        
        connection.query(`SELECT createdBy from projects where id = ${req.params.projectId}`,(err2, resp2)=>{
            if(err2) return res.status(500).json({'message':'internal server error'});

            if(resp2.length < 1) return res.status(404).json({message:'Project Not found!'});

            if(req.user.data.id == resp[0].createdBy ){
                connection.query(`UPDATE projects
                        SET teamId = ${req.body.teamId}
                        WHERE id=${req.params.projectId}`, (err3,resp3)=>{
                        if(err3) return res.status(500).json({'message':'internal server error'});

                        res.status(200).json({success:true,message:"Team successfully added"})
                })
            } else if(req.user.data.permissions.some(permission => permission == "manage_project") ){
                connection.query(`UPDATE projects
                    SET teamId = ${req.body.teamId}
                    WHERE id=${req.params.projectId}`, (err3,resp3)=>{
                        if(err3) return res.status(500).json({'message':'internal server error'});

                        res.status(200).json({success:true,message:"Team successfully added"})
                    })
                }else{
                    res.status(400).json({success:false,message:"forbidden"})
                }
            })
    })
}

// create projejct endpoint
const createProject = (req,res)=>{
    connection.query(`insert into projects (name, description, teamId, createdBy, startDate, endDate, statusId) 
        values('${req.body.name}',
               '${req.body.description}',
                ${req.body.teamId || null},
                ${req.user.data.id},
                ${req.body.startDate || null},
                ${req.body.endDate || null},
                ${req.body.statusId ||null})`, (err,resp)=>{
                    if (err) return res.status(400).json({success:false,message:'name or description cannot be empty'});
                    
                    res.status(200).json({success:true,message:"successfully created!"})
        })
}
     
// edit project controller
const editProject = (req,res)=>{
    const d = new Date().toISOString()

    connection.query(`SELECT createdBy from projects where id = ${req.params.projectId}`, (err,resp)=>{
        // if error 
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Not found!'});

        if(req.user.data.id == resp[0].createdBy){
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
                    if(err) return res.status(500).json({message:'internal server error'});
                    
                    res.status(200).json({success:true,message:"successfully updated!"})
            }) 
        }else if(req.user.data.permissions.some(permission => permission == "manage_project")){
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
                if(err) return res.status(500).json({message:'internal server error'});
                
                res.status(200).json({success:true,message:"successfully updated!"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"})
        }
    })
}
    
const deleteProject = (req,res)=>{
//  handling delete

    connection.query(`SELECT createdBy from projects where id = ${req.params.projectId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({message:'Not found!'});
    
        if(req.user.data.id == resp[0].createdBy){
            connection.query(`DELETE FROM projects WHERE  id=${req.params.projectId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal server error'});

                res.status(200).json({success:true,message:"successfully deleted"});
            })     
        }else if(req.user.data.permissions.some(permission => permission == "manage_project")){
            connection.query(`DELETE FROM projects WHERE  id=${req.params.projectId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:'internal server error'});

                res.status(200).json({success:true,message:"successfully deleted"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"});
        }
    })
}


module.exports = {
    getAllProjects,
    getProjects,
    getSingleProject,
    addTeam,
    createProject,
    editProject,
    deleteProject
}
