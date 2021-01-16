/*###################### DATABASE CONNECTION #############*/
const connection = require('../models/db')


/*###################### TO GET/READ ALL FAQs #############*/
const getAllFAQ =(req,res)=>{
        connection.query(`SELECT * from faq`, (err,resp)=>{
            if(err) return res.status(500).json({success:false,'message':'internal server error'});
        
        res.status(200).json({success:true, data:resp})
           
        })
}    

/*###################### TO GET/READ A SINGLE FAQ #############*/
const getSingleFAQ =(req,res)=>{
    connection.query(`SELECT * from faq where id = ${req.params.faqId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false,'message':'internal server error'});
        
        res.status(200).json({data:resp})
    })
} 

/*###################### TO CREATE/POST FAQs #############*/

const createFAQ = (req,res)=>{
    connection.query(`insert into faq (question,answer,createdBy) values ('${req.body.question}',
    '${req.body.answer}, ${req.user.data.id}`, (errq,resp)=>{
        
        if (errq) return res.status(500).json({success:false,message:"Internal server error"})
                        
                        res.status(200).json({success:true,message:"successfully created!"})
    })
    
    
}

/*###################### TO UPDATE/PUT FAQs #############*/
const editFAQ = (req,res)=>{
    if(req.body.question){    
        connection.query(`UPDATE tasks SET 
            question='${req.body.question}'
            WHERE id=${req.params.faqId}`, (err,resp)=>{
            if (err) {
                if(err) return res.status(500).json({success:false, message:"internal server error"});
                    
                res.status(200).json({success:true,message:"successfully updated!"})
            }
        }) 
    }
    if(req.body.answer){
        connection.query(`UPDATE faq SET 
            answer='${req.body.answer}'
            WHERE id=${req.params.faqId}`, (err,resp)=>{
                if(err) return res.status(500).json({success:false, message:"internal server error"});
                    
                res.status(200).json({success:true,message:"successfully updated!"})
            })
    }
    
}



/*###################### TO DELETE FAQs #############*/
const deleteFAQ = (req,res)=>{
    connection.query(`DELETE FROM faq WHERE  id=${req.params.faqId}`, (err,resp)=>{
        if(err) return res.status(500).json({success:false, message:"internal server error"});
                    
        res.status(200).json({success:true,message:"successfully deleted!"})
    })
}

module.exports = {
    getAllFAQ,
    getSingleFAQ,
    createFAQ,
    editFAQ,
    deleteFAQ

}