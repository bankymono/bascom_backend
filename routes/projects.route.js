const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const auth = require("../controllers/authController");


router.get('/all', auth.authenticate,auth.viewAllProjects,projectsController.getProjects)
router.get('/', auth.authenticate, projectsController.getProjects)
router.get('/:projectId', auth.authenticate, projectsController.getSingleProject)
// router.get('/:projectId/tasks', auth.authenticate, projectsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, projectsController.createProjectTask)
router.post('/', auth.authenticate, projectsController.createProject)
router.put('/:projectId', auth.authenticate, projectsController.updateProject)
router.delete('/:projectId', auth.authenticate, projectsController.deleteProject)

module.exports = router