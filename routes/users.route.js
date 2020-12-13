const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const auth = require("../controllers/authController");
const { validateBody, schemas} = require('../utils/routeHelpers')

router.get('/root', usersController.root);
router.get('/', auth.authenticate, auth.viewAllUsers, usersController.getUsers);
router.get('/:userId', auth.authenticate, usersController.getSingleUser);
router.post('/', usersController.internalUserSignup);
router.post('/signup', validateBody(schemas.authSchema), usersController.signUp);
router.get('/auth/activation/:userId/:otpCode', usersController.activateAccount);
router.post('/requestActivationLink', usersController.requestActivationLink);
router.post("/resetPassword", usersController.resetPassword);
router.get("/auth/reset/:userID/:otpCode", usersController.handleResetPassword);
router.get("/setNewPassword", usersController.setNewPassword);
router.post('/login', usersController.userLogin);
router.post("/changePassword", auth.authenticate, usersController.changePassword);
router.put('/:id', auth.authenticate, usersController.updateUser);
router.delete('/:id', auth.authenticate, auth.deleteUser, usersController.deleteUser);

module.exports = router