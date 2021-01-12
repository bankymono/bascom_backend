const {check, validationResult} = require('express-validator')

exports.nameValidationResult = (req,res, next) =>{
    const result = validationResult(req);

    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success:false,error:error})
    }

    next()
}

exports.nameValidationResult = this.nameValidationResult;
exports.nameValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Cannot be empty!')
        .isLength({min:3})
        .withMessage('Name must be 3 or more characters long!')
]