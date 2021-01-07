const {check, validationResult} = require('express-validator')

exports.userValidationResult = (req,res, next) =>{
    const result = validationResult(req);

    if(!result.isEmpty()){
        const error = result.array()[0].msg;
        return res.status(422).json({success:false,error:error})
    }

    next()
}

exports.userValidationResult = this.userValidationResult;
exports.userValidator = [
    check('firstName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('First Name is required!')
        .isLength({min:3})
        .withMessage('First Name must be 3 or more characters long!'),

    check('lastName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Last Name is required!')
        .isLength({min:3})
        .withMessage('Last Name must be 3 or more characters long!'),

    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('email is required!')
        .isEmail()
        .withMessage('please provide a valid email'),

        check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required!')
        .isLength({min:7})
        .withMessage('Password must be at least 8 characters long!')
]