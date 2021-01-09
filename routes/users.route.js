const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const auth = require("../controllers/authController");
const {userValidationResult, userValidator} = require('../validators/userValidator') 

// const { validateBody, schemas} = require('../utils/routeHelpers')

router.get('/root', usersController.root);
router.get('/all', auth.authenticate, auth.viewAllUsers, usersController.getUsers);
router.get('/:userId', auth.authenticate, usersController.getSingleUser);
router.post('/',  userValidator, userValidationResult,usersController.internalUserSignup);

// user sign up and activation
router.post('/signup', userValidator, userValidationResult, usersController.signUp);
router.get('/auth/activation/:userId/:otpCode', usersController.activateAccount);
// router.post('/requestActivationLink', usersController.requestActivationLink);

// password reset
// rou/ter.post("/resetPassword", usersController.resetPassword);
// router.get("/auth/reset/:userID/:otpCode", usersController.handleResetPassword);
// router.post("/setNewPassword", usersController.setNewPassword);

//login route
router.post('/login', usersController.userLogin);

// change password
router.post("/changePassword", auth.authenticate, usersController.changePassword);


router.put('/:id', auth.authenticate, usersController.updateUser);
router.delete('/:id', auth.authenticate, auth.deleteUser, usersController.deleteUser);

module.exports = router