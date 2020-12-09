const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const auth = require("../controllers/authController");


router.get('/', auth.authenticate, auth.viewProject, projectsController.getUserProjects)
router.get('/userProjects', auth.authenticate, auth.viewProject, projectsController.getUserProjects)
router.get('/:projectId', auth.authenticate, auth.viewProject, projectsController.getSingleProject)
router.get('/:projectId/tasks', auth.authenticate, auth.viewTask, projectsController.getProjectTasks)
router.post('/:projectId/tasks', auth.authenticate, auth.createTask, projectsController.createProjectTask)
router.post('/', auth.authenticate, auth.createProject, projectsController.createProject)
router.put('/:projectId', auth.authenticate, auth.editProject, projectsController.updateProject)
router.delete('/:projectId', auth.authenticate, auth.deleteProject, projectsController.deleteProject)

module.exports = router