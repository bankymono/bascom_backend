const connection = require('../models/db')


const getAllReports = (req,res)=>{
    connection.query(`SELECT * from reports`, (err,resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:"No report found."})

        res.status(200).json({success:true, data:resp})
    })
}

const getReports = (req,res)=>{
    connection.query(`SELECT * from reports where generatedBy = ${req.user.data.id}`, (err,resp)=>{
        if(err) return res.status(500).json({'message':'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:"No report found."})
        
        res.status(200).json({success:true, data:resp})
    })
}
    
const getSingleReport = (req,res)=>{
    connection.query(`SELECT * from reports where id = ${req.params.reportId}`, (err,resp)=>{
        if(err) throw err
        if(resp.length < 1) res.status(404).send('does not exist!')
        else
        if(resp[0].generatedBy == req.user.data.id){
            res.send(resp[0])
        }else if(req.user.data.permissions.some(permission => permission === "view_all_projects")){
            res.send(resp[0])
        }else{
            res.status(403).send('unauthorized!')
        }
    })
}   
    
const saveReport = (req,res)=>{
    if(req.file == null) return res.status(400).send('invalid file format');
    reporturl = `bascom-backend.herokuapp.com/${req.filePath}`
    connection.query(`insert into reports (name, description, reportUrl, generatedBy, projectId)
        values('${req.body.name}',
                '${req.body.description}',
                '${reporturl}',
                26,
                3)`, (errq,resp)=>{
                    if (errq) {console.log(errq);res.send(errq)}
                    else{
                    res.send("report successfully saved")}
                })
}
    
const editReport = (req,res)=>{
    const d = new Date().toISOString()

    connection.query(`SELECT createdBy from reports where id = ${req.params.reportId}`, (err,resp)=>{
        // if(err) throw err
        // if(resp.length < 1) res.status(404).send('does not exist!')
        // else
        // if(req.user.data.id === resp[0].createdBy){
        //     connection.query(`UPDATE projects SET 
        //         name='${req.body.name}',
        //         description ='${req.body.description}',
        //         teamId = ${req.body.teamId || null},
        //         startDate = ${req.body.startDate || null},
        //         endDate = ${req.body.endDate || null},
        //         statusId = ${req.body.statusId ||null},
        //         lastModified = '${d}',
        //         modifiedBy = ${req.user.data.id}
        //         WHERE id=${req.params.projectId}`, (err,resp)=>{
        //             if (err) throw err
        //             res.send(resp)
        //     }) 
        // }else if(req.user.data.permissions.some(permission => permission === "manage_project")){
        //     res.send(resp[0])
        // }else{
        //     res.status(403).send('forbidden')
        // }        
    })

}
    
const deleteReport = (req,res)=>{
//  handling delete

    connection.query(`SELECT createdBy from reports where id = ${req.params.reportId}`, (err,resp)=>{
        
    })
}


module.exports = {
    getAllReports,
    getReports,
    getSingleReport,
    saveReport,
    editReport,
    deleteReport,
    // getProjectTasks,
    // createProjectTask
}
