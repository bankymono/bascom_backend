require('dotenv').config()
const connection = require('../models/db')


const getAllReports = (req,res)=>{
    connection.query(`SELECT * from reports`, (err,resp)=>{
        if(err) return res.status(500).json({success:false,'message':'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:"No report found."})

        res.status(200).json({success:true, data:resp})
    })
}

const getReports = (req,res)=>{
    connection.query(`SELECT * from reports where generatedBy = ${req.user.data.id} and projectId = ${req.params.projectId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, 'message':'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:"No report found."})
        
        res.status(200).json({success:true, data:resp})
    })
}
    
const getSingleReport = (req,res)=>{
    connection.query(`SELECT * from reports where id = ${req.params.reportId} and projectId = ${req.params.projectId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:'Report not found!'});

        if(resp[0].generatedBy == req.user.data.id) return res.status(200).json({success:true, data:resp[0]})
        
        if(req.user.data.permissions.some(permission => permission == "view_all_projects")) 
            return res.status(200).json({success:true, data:resp[0]})
        
        res.status(400).json({success:false, message:'Unauthorized'});
    })
}   
    
// save report
const saveReport = (req,res)=>{
    if(req.file == null) return res.status(400).send('invalid file format');
    
    const reporturl = `${process.env.BASE_URL}/${req.filePath}`
    
    connection.query(`insert into reports (name, description, reportUrl, generatedBy, projectId)
        values('${req.body.name}',
                '${req.body.description}',
                '${reporturl}',
                ${req.user.data.id},
                ${req.params.projectId})`, (errq,resp)=>{
                    if (errq) return res.status(400).json({success:false,message:'fields cannot be empty'});
                    
                    res.status(200).json({success:true,message:"successfully saved!"})
                })
}


// edit report
const editReport = (req,res)=>{
    const d = new Date().toISOString()

    connection.query(`SELECT generatedBy from reports where id = ${req.params.reportId} and projectId=${req.params.projectId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:'Not found!'});

        if(req.user.data.id == resp[0].generatedBy){
            connection.query(`UPDATE reports SET 
                name='${req.body.name}',
                description ='${req.body.description}',
                dateModified = '${d}',
                modifiedBy = ${req.user.data.id}
                WHERE id=${req.params.reportId} and projectId=${req.params.projectId}`, (err,resp)=>{
                    if(err) return res.status(500).json({success:false, message:'internal server error'});
                    
                    res.status(200).json({success:true,message:"successfully updated!"})
            }) 
        }else if(req.user.data.permissions.some(permission => permission == "manage_project")){
            connection.query(`UPDATE reports SET 
            name='${req.body.name}',
            description ='${req.body.description}',
            dateModified = '${d}',
            modifiedBy = ${req.user.data.id}
            WHERE id=${req.params.reportId} and projectId=${req.params.projectId}`, (err,resp)=>{
                if(err) return res.status(500).json({success:false, message:'internal server error'});
                
                res.status(200).json({success:true,message:"successfully updated!"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"})
        }
    })
}
    
const deleteReport = (req,res)=>{
//  handling delete

    connection.query(`SELECT generatedBy from reports where id = ${req.params.reportId} and projectId=${req.params.projectId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, message:'internal server error'});

        if(resp.length < 1) return res.status(404).json({success:false, message:'Not found!'});
    
        if(req.user.data.id == resp[0].generatedBy){
            connection.query(`DELETE FROM reports WHERE id=${req.params.reportId} and projectId = ${req.params.projectId}`, (err,resp)=>{
                if(err) return res.status(500).json({success:false, message:'internal server error'});

                res.status(200).json({success:true,message:"successfully deleted"});
            })     
        }else if(req.user.data.permissions.some(permission => permission == "manage_project")){
            connection.query(`DELETE FROM reports WHERE  id=${req.params.projectId}and projectId = ${req.params.projectId}`, (err,resp)=>{
                if(err) return res.status(500).json({success:false, message:'internal server error'});

                res.status(200).json({success:true,message:"successfully deleted"})
            })
        }else{
            res.status(400).json({success:false,message:"forbidden"});
        }
    })
}

module.exports = {
    getAllReports,
    getReports,
    getSingleReport,
    saveReport,
    editReport,
    deleteReport,
}
