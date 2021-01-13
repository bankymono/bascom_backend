const express = require('express');
const router = express.Router()
const teamsController = require('../controllers/teamsController');
const auth = require("../controllers/authController");
const {nameValidationResult, nameValidator} = require('../validators/nameValidator');

router.get('/all', auth.authenticate, teamsController.getAllTeams)
router.post('/:teamId/addmember', auth.authenticate, teamsController.addMember)
router.post('/:teamId/invite', auth.authenticate, teamsController.inviteMember)
router.post('/:teamId/:memberId/remove', auth.authenticate, teamsController.removeMember)
router.get('/userteams', auth.authenticate, teamsController.getTeams)
router.get('/:teamid', auth.authenticate,teamsController.getSingleTeam)
router.post('/create', nameValidator, 
    nameValidationResult, auth.authenticate,teamsController.createTeam)
router.post('/:teamid/edit', auth.authenticate,teamsController.editTeam)
router.delete('/:teamid/delete', auth.authenticate,teamsController.deleteTeam)

module.exports = router;