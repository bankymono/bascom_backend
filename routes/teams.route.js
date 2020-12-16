const express = require('express');
const router = express.Router()
const teamsController = require('../controllers/teamsController');
const auth = require("../controllers/authController");

router.get('/', auth.authenticate, teamsController.getAllTeams)
router.post('/:teamId/addMember', auth.authenticate, teamsController.addMember)
router.get('/prjteam', auth.authenticate, teamsController.getTeams)
router.get('/:teamid', auth.authenticate,teamsController.getSingleTeam)
router.post('/', auth.authenticate,teamsController.createTeam)
router.put('/:teamid', auth.authenticate,teamsController.updateTeam)
router.delete('/:teamid', auth.authenticate,teamsController.deleteTeam)

module.exports = router;