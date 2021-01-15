/*###################### DATABASE CONNECTION #############*/
const connection = require('../models/db')



/*###################### TO GET/READ ALL FAQs #############*/
const getAllFAQ =(req,res)=>{
        connection.query(`SELECT * from faq`, (err,resp)=>{
            if(err) return res.status(500).json({'message':'internal server error'});
        
        res.status(200).json({data:resp})
           
        })
}    

/*###################### TO GET/READ A SINGLE FAQ #############*/
const getSingleFAQ =(req,res)=>{
<<<<<<< HEAD
    connection.query(`SELECT * from faq where id = ${req.user.data.faqId}`, (err,resp)=>{
=======
    connection.query(`SELECT * from faq where id = ${req.params.faqId}`, (err,resp)=>{
>>>>>>> fc786568e565586587de8977c15df40bd9dc57fa
        if(err) return res.status(500).json({'message':'internal server error'});
        
        res.status(200).json({data:resp})
    })
} 

/*###################### TO CREATE/POST FAQs #############*/

const createFAQ = (req,res)=>{
    connection.query(`insert into faq (question,answer,createdBy) values ('${req.body.question}',
<<<<<<< HEAD
    '${req.body.answer}, ${req.user.data.id}`, (err,resp)=>{
=======
    '${req.body.answer}, ${req.user.data.id}`, (errq,resp)=>{
>>>>>>> fc786568e565586587de8977c15df40bd9dc57fa
        
        if (errq) return res.status(500).json({message:"Internal server error"})
                        
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
                if(err) return res.status(500).json({message:"internal server error"});
                    
                res.status(200).json({success:true,message:"successfully updated!"})
            }
        }) 
    }
    if(req.body.answer){
        connection.query(`UPDATE faq SET 
            answer='${req.body.answer}'
            WHERE id=${req.params.faqId}`, (err,resp)=>{
                if(err) return res.status(500).json({message:"internal server error"});
                    
                res.status(200).json({success:true,message:"successfully updated!"})
            })
    }
    
}



/*###################### TO DELETE FAQs #############*/
const deleteFAQ = (req,res)=>{
    connection.query(`DELETE FROM faq WHERE  id=${req.params.faqId}`, (err,resp)=>{
        if(err) return res.status(500).json({message:"internal server error"});
                    
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