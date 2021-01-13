const express = require('express')
const router = express.Router()
const tasksController = require('../controllers/tasksController')
const auth = require("../controllers/authController");
const {nameValidationResult, nameValidator} = require('../validators/nameValidator');


router.get('/all', auth.authenticate, auth.viewAllTasks, tasksController.getAllTasks)
router.get('/usertasks', auth.authenticate, tasksController.getTasks)
router.get('/:taskId', auth.authenticate,tasksController.getSingleTask)
router.post('/create', nameValidator, 
    nameValidationResult, auth.authenticate,tasksController.createTask)
router.post('/:taskId/assign', auth.authenticate,tasksController.assignTask)
router.post('/:id/edit', auth.authenticate,tasksController.editTask)
router.post('/:id/delete', auth.authenticate,tasksController.deleteTask)

module.exports = router;