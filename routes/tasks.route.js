const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const auth = require("../controllers/authController");

router.get('/', auth.authenticate, auth.viewUser, tasksController.getTasks)
router.get('/:id', auth.authenticate, auth.viewUser, tasksController.getSingleTask)
router.post('/', auth.authenticate, auth.viewUser, tasksController.createTask)
router.put('/:id', auth.authenticate, auth.viewUser, tasksController.updateTask)
router.delete('/:id', auth.authenticate, auth.viewUser, tasksController.deleteTask)

module.exports = router