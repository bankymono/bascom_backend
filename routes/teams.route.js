<<<<<<< HEAD
const express = require('express');
const express = require('express');
const router = express.Router()
const projectsController = require('../controllers/teamsController');
const auth = require("../controllers/authController");

router.get('/', auth.authenticate, tasksController.getTasks)
router.get('/:teamid', auth.authenticate,tasksController.getSingleTask)
router.post('/', auth.authenticate,tasksController.createTask)
router.put('/:teamid', auth.authenticate,tasksController.updateTask)
router.delete('/:teamid', auth.authenticate,tasksController.deleteTask)

module.exports = router;
=======
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
>>>>>>> 79dbb74f0614cb49a4f18f066c2f92c0f11c70fd
