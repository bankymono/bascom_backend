const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const auth = require("../controllers/authController");
const {userValidationResult, userValidator} = require('../validators/userValidator') 


router.get('/root', usersController.root);
router.get('/all', auth.authenticate, auth.viewAllUsers, usersController.getUsers);
router.get('/:userId', auth.authenticate, usersController.getSingleUser);
router.post('/',  userValidator, userValidationResult,usersController.internalUserSignup);

// user sign up and activation
router.post('/signup', userValidator, userValidationResult, usersController.signUp);
router.get('/auth/activation/:userId/:otpCode', usersController.activateAccount);



//login route
router.post('auth/login', usersController.login);

// forgot password
router.post("/auth/forgotpassword", usersController.forgotPassword);
router.put("/auth/resetPassword/:resetToken",  usersController.resetPassword);


router.put('/:id', auth.authenticate, usersController.updateUser);
router.delete('/:id', auth.authenticate, auth.deleteUser, usersController.deleteUser);

module.exports = router