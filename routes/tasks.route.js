const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const auth = require("../controllers/authController");

<<<<<<< HEAD
// router.get('/', auth.authenticate, auth.viewTask, tasksController.getTasks)
// router.get('/:taskId', auth.authenticate, auth.viewTask, tasksController.getSingleTask)
// router.post('/', auth.authenticate, auth.createTask, tasksController.createTask)
// router.put('/:taskId', auth.authenticate, auth.editTask, tasksController.updateTask)
// router.delete('/:taskId', auth.authenticate, auth.deleteTask, tasksController.deleteTask)

router.get('/', auth.authenticate, tasksController.getTasks)
router.get('/:taskid', auth.authenticate,tasksController.getSingleTask)
router.post('/', auth.authenticate,tasksController.createTask)
router.put('/:id', auth.authenticate,tasksController.updateTask)
router.delete('/:id', auth.authenticate,tasksController.deleteTask)
=======
router.get('/', auth.authenticate, tasksController.getUserTasks)
router.get('/:taskId', auth.authenticate, tasksController.getSingleTask)
router.post('/new', auth.authenticate, tasksController.createTask)
router.put('/:taskId', auth.authenticate, tasksController.updateTask)
router.delete('/:taskId', auth.authenticate, tasksController.deleteTask)
>>>>>>> 79dbb74f0614cb49a4f18f066c2f92c0f11c70fd

module.exports = router;