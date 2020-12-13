const Joi = require('Joi')


const validateBody = (schema)=>{
    return (req,res,next)=> {
        const result = schema.validate(req.body)
        if(result.error){
            return res.status(400).json('this na error',result.error)
        }
        if(!req.value) req.value = {};
        req.value.body = result.value;
        next()
    }
}

const schemas = {
    authSchema: Joi.object().keys({
        firstName:Joi.string().min(2).max(50).required(),
        lastName:Joi.string().min(2).max(50).required(),
        email:Joi.string().email().required(),
        password:Joi.string().required()
    }),
}

module.exports.validateBody = validateBody;
module.exports.schemas = schemas;