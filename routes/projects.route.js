const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const auth = require("../controllers/authController");


router.get('/projects', auth.authenticate,auth.viewAllProjects,projectsController.getAllProjects)

router.get('/userprojects', auth.authenticate, projectsController.getProjects)
router.get('/userprojects/:projectId', auth.authenticate, projectsController.getSingleProject)

router.post('/userprojects/:projectId/addteam', auth.authenticate, projectsController.addTeam)

// router.get('/:projectId/tasks', auth.authenticate, projectsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, projectsController.createProjectTask)
router.post('/userprojects/create', auth.authenticate, projectsController.createProject)
router.put('/userprojects/:projectId', auth.authenticate, projectsController.updateProject)
router.delete('/userprojects/:projectId', auth.authenticate, projectsController.deleteProject)

module.exports = router