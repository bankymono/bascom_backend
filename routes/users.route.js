const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const auth = require("../controllers/authController");

router.get('/root', usersController.root)
router.get('/', auth.authenticate, auth.viewUser, usersController.getUsers)
router.get('/:id', auth.authenticate, auth.viewUser, usersController.getSingleUser)
router.post('/', usersController.internalUserSignup)
router.post('/signup', usersController.signUp)
router.post('/login', usersController.userLogin)
router.put('/:id', auth.authenticate, auth.editUser, usersController.updateUser)
router.delete('/:id', auth.authenticate, auth.deleteUser, usersController.deleteUser)

module.exports = router