const connection = require('../models/db')

const getAllContactUs = (req,res)=>{
    connection.query(`SELECT * from contact_us`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, 'message':'internal server error'});
        
        if(resp.length < 1) return res.status(404).json({success:false, message:"No message found."})
        
        res.status(200).json({success:true, data:resp})
    })
}

const postContactUs = (req,res)=>{
    if(req.body.name == undefined || req.body.email == undefined ||req.body.message == undefined){
        if(err) return res.status(400).json({success:false, message:"please provide name, email and your message"});
        
        connection.query(`insert into contact_us(name,email,subject,message)
            values(
                '${req.body.name}',
                '${req.body.email}',
                '${req.body.subject || null}',
                '${req.body.message}')`,(err,resp)=>{
                if(err) return res.status(500).json({success:false, message:'internal server error'});
                
                res.status(200).json({success:true,message:"successfully received"})
        })
    }   
}
    

const getSingleContactUs = (req,res)=>{

    connection.query(`SELECT * from contact_us where id = ${req.params.contactUsId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, message:'internal server error'});

        // if no data returned, send status not found
        if(resp.length < 1) return res.status(404).json({success:false, message:'no message found!'});


        res.status(200).json({success:true, data:resp[0]})
    })

}


module.exports = {
    postContactUs,
    getAllContactUs,
    getSingleContactUs,
}
