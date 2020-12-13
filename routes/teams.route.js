const express = require('express')
const router = express.Router()
const teamsController = require('../controllers/teamsController')
const auth = require("../controllers/authController");


router.get('/all', auth.authenticate,auth.viewAllProjects,teamsController.getAllTeams)
router.get('/usrprojs', auth.authenticate, teamsController.getTeams)
router.get('/usrprojs/:projectId', auth.authenticate, teamsController.getSingleTeam)
// router.get('/:projectId/tasks', auth.authenticate, teamsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, teamsController.createProjectTask)
router.post('/usrprojs', auth.authenticate, teamsController.createTeam)
router.put('/usrprojs/:projectId', auth.authenticate, teamsController.updateTeam)
router.delete('/usrprojs/:projectId', auth.authenticate, teamsController.deleteTeam)

module.exports = router