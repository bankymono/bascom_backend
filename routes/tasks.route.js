const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const auth = require("../controllers/authController");

router.get('/', auth.authenticate, tasksController.getUserTasks)
router.get('/:taskId', auth.authenticate, tasksController.getSingleTask)
router.post('/new', auth.authenticate, tasksController.createTask)
router.put('/:taskId', auth.authenticate, tasksController.updateTask)
router.delete('/:taskId', auth.authenticate, tasksController.deleteTask)

module.exports = router;