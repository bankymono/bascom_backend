/*###################### DATABASE CONNECTION #############*/
const connection = require('../models/db')



/*###################### TO GET/READ ALL FAQs #############*/
const getAllFAQ =(req,res)=>{
        connection.query(`SELECT * from faq`, (err,resp)=>{
            if (err) return res.status(500).send(err);
            res.status(200).send(resp);
        })
}    

/*###################### TO GET/READ A SINGLE FAQ #############*/
const getSingleFAQ =(req,res)=>{
    connection.query(`SELECT * from faq where id = ${req.user.data.faqId}`, (err,resp)=>{
        if (err) return res.status(500).send(err);
        res.status(200).send(resp);
    })
} 

/*###################### TO CREATE/POST FAQs #############*/

const createFAQ = (req,res)=>{
    connection.query(`insert into faq (question,answer,createdBy) values ('${req.body.question}',
    '${req.body.answer}`, (err,resp)=>{
        
        if (err) return res.status(500).send(err);
        if (res){
            resp.send("uccessfully created FAQ!")
        }
    })
    
    
}

/*###################### TO UPDATE/PUT FAQs #############*/
const updateFAQ = (req,res)=>{
    if(req.body.question){    
        connection.query(`UPDATE tasks SET 
            question='${req.body.question}'
            WHERE id=${req.params.faqId}`, (err,resp)=>{
            if (err) {
                console.log(err)
            }//throw err
        }) 
    }
    if(req.body.answer){
        connection.query(`UPDATE faq SET 
            answer='${req.body.answer}'
            WHERE id=${req.params.faqId}`, (err,resp)=>{
                if (err) {
                    console.log(err)
                }
            })
    }
    
    res.send(`successfully updated FAQ with id ${req.params.faqId}`)
}



/*###################### TO DELETE FAQs #############*/
const deleteFAQ = (req,res)=>{
    connection.query(`DELETE FROM faq WHERE  id=${req.params.faqId}`, (err,resp)=>{
        if (err) return res.send(err);
        resp.send(`successfully deleted FAQ with id ${req.params.faqId}`)
    })
}

module.exports = {
    getAllFAQ,
    getSingleFAQ,
    createFAQ,
    updateFAQ,
    deleteFAQ

}