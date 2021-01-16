const cors = require('cors')
const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const tasksController = require('../controllers/tasksController')
const reportsController = require('../controllers/reportsController')
const auth = require("../controllers/authController");
const {nameValidationResult, nameValidator} = require('../validators/nameValidator');

router.options("*", cors())
router.get('/all', auth.authenticate,auth.viewAllProjects,projectsController.getAllProjects)

router.get('/userprojects/', auth.authenticate, projectsController.getProjects)
router.get('/:projectId/tasks/', auth.authenticate, tasksController.getTasks)

router.get('/userprojects/:projectId', auth.authenticate, projectsController.getSingleProject)
router.get('/:projectId/tasks/:taskId', auth.authenticate,tasksController.getSingleTask)

router.get('/:projectId/reports/', auth.authenticate, reportsController.getReports)
router.get('/:projectId/reports/reportId', auth.authenticate, reportsController.getSingleReport)
router.post('/:projectId/reports/save', auth.authenticate, reportsController.saveReport)
router.post('/:projectId/reports/reportId/edit', auth.authenticate, reportsController.editReport)
router.post('/:projectId/reports/reportId/delete', auth.authenticate, reportsController.deleteReport)

router.post('/userprojects/:projectId/addteam', auth.authenticate, projectsController.addTeam)

// router.get('/:projectId/tasks', auth.authenticate, projectsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, projectsController.createProjectTask)
router.post('/userprojects/create', auth.authenticate, nameValidator, 
    nameValidationResult, projectsController.createProject)
router.post('/userprojects/:projectId/edit', auth.authenticate, projectsController.editProject)
router.post('/userprojects/:projectId/delete', auth.authenticate, projectsController.deleteProject)


router.post('/:projectId/tasks/create', nameValidator, 
    nameValidationResult, auth.authenticate,tasksController.createTask)
router.post('/:projectId/tasks/:taskId/assign', auth.authenticate,tasksController.assignTask)
router.post('/:projectId/tasks/:taskId/edit', auth.authenticate,tasksController.editTask)
router.post('/:projectId/tasks/:taskId/delete', auth.authenticate,tasksController.deleteTask)

module.exports = router