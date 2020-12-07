const express = require('express')
const router = express.Router()
<<<<<<< HEAD

// get a list of ninjas from the database
router.get('/', (req,res)=>{

})
=======
const usersController = require('../controllers/usersController')
const auth = require("../controllers/authController");

router.get('/root', usersController.root)
router.get('/', auth.authenticate, auth.viewUser, usersController.getUsers)
router.get('/:id', auth.authenticate, auth.viewUser, usersController.getSingleUser)
router.post('/', auth.authenticate, auth.viewUser, usersController.internalUserSignup)
router.post('/signup', auth.authenticate, auth.viewUser, usersController.signUp)
router.put('/:id', auth.authenticate, auth.viewUser, usersController.updateUser)
router.delete('/:id', auth.authenticate, auth.viewUser, usersController.deleteUser)

module.exports = router
>>>>>>> test-branch
