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