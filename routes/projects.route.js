const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const auth = require("../controllers/authController");


router.get('/all', auth.authenticate,auth.viewAllProjects,projectsController.getAllProjects)
router.get('/usrprojs', auth.authenticate, projectsController.getProjects)
router.get('/usrprojs/:projectId', auth.authenticate, projectsController.getSingleProject)
router.put('/usrprojs/:projectId/addteam', auth.authenticate, projectsController.addTeam)
// router.get('/:projectId/tasks', auth.authenticate, projectsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, projectsController.createProjectTask)
router.post('/usrprojs', auth.authenticate, projectsController.createProject)
router.put('/usrprojs/:projectId', auth.authenticate, projectsController.updateProject)
router.delete('/usrprojs/:projectId', auth.authenticate, projectsController.deleteProject)

module.exports = router