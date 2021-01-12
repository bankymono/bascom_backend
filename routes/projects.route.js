const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const auth = require("../controllers/authController");
const {nameValidationResult, nameValidator} = require('../validators/nameValidator');


router.get('/all', auth.authenticate,auth.viewAllProjects,projectsController.getAllProjects)

router.get('/userprojects/', auth.authenticate, projectsController.getProjects)
router.get('/userprojects/:projectId', auth.authenticate, projectsController.getSingleProject)

router.post('/userprojects/:projectId/addteam', auth.authenticate, projectsController.addTeam)

// router.get('/:projectId/tasks', auth.authenticate, projectsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, projectsController.createProjectTask)
router.post('/userprojects/create', auth.authenticate, nameValidator, 
    nameValidationResult, projectsController.createProject)
router.post('/userprojects/:projectId/edit', auth.authenticate, projectsController.editProject)
router.post('/userprojects/:projectId/delete', auth.authenticate, projectsController.deleteProject)

module.exports = router